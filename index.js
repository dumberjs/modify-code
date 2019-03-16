var tokenize = require('./tokenize');
var SourceNode = require('source-map').SourceNode;

module.exports = function(code, filePath) {
  // the file name to be used in sourcemap sources and file fields
  filePath = (filePath || 'file.js').replace(/\\/g, '/');
  var tokens = tokenize(code);
  var mutations = [];

  function checkIndex(idx) {
    if (typeof idx !== 'number' || idx < 0) {
      throw new Error('index: ' + JSON.stringify(idx) + ' is not a valid index');
    }
    if (idx > code.length) {
      throw new Error('index: ' + idx + ' is out of range of code length: ' + code.length);
    }
  }

  function replace(start, end, str) {
    var existing;
    checkIndex(start);
    checkIndex(end);
    if (end < start) {
      throw new Error('end-index: ' + end + ' cannot be smaller than start-index: ' + start);
    }
    if (start === end) {
      // allow multiple insertion to same location
      existing = mutations.find(function(m) {
        return m.start === start && m.end === start;
      });
    }

    if (existing) {
      existing.value += str;
    } else {
      mutations.push({start: start, end: end, value: str});
    }
    return modifyCode;
  }

  var modifyCode = {};
  modifyCode.prepend = function(str) {
    return replace(0, 0, str);
  };
  modifyCode.append = function(str) {
    return replace(code.length, code.length, str);
  };
  modifyCode.insert = function(start, str) {
    return replace(start, start, str);
  };
  modifyCode.replace = function(start, end, str) {
    return replace(start, end, str);
  };
  modifyCode.delete = function(start, end) {
    return replace(start, end, '');
  };
  modifyCode.transform = function() {
    var i = 0, ti = 0, ii = mutations.length, newTokens = [];
    var mutation, newValue, offset, offset2, merged;

    function advance() { if (ti < tokens.length) ti++; }
    function token() { return tokens[ti]; }
    function prev() { return tokens[ti - 1]; }

    mutations.sort(function(a, b) {return a.start - b.start;});

    for (; i < ii; i++) {
      mutation = mutations[i];

      if (token() && token().start > mutation.start) {
        if (newTokens.length && newTokens[newTokens.length - 1].start <= mutation.start) {
          throw new Error('does not allow mutating same token again. Token affected: ' +
            JSON.stringify(newTokens[newTokens.length - 1].value));
        } else {
          panic(mutation);
        }
      } else {
        // move to current affected token
        while (token() && token().end <= mutation.start) {
          newTokens.push(token());
          advance();
        }
      }

      if (mutation.start === mutation.end) {
        // an insertion
        if (!token()) {
          // append
          newTokens.push({
            value: mutation.value,
            start: mutation.start,
            end: mutation.end,
            line: prev() ? prev().endLine : 1,
            column: prev() ? prev().endColumn : 0
          });
        } else if (token().start === mutation.start) {
          // prepend or insert
          newTokens.push({
            value: mutation.value,
            start: mutation.start,
            end: mutation.end,
            line: token().line,
            column: token().column
          });
          newTokens.push(token());
          advance();
        } else {
          // insertion in this token
          offset = mutation.start - token().start;
          newValue = token().value.slice(0, offset) + mutation.value + token().value.slice(offset);
          newTokens.push({
            value: newValue,
            start: token().start,
            end: token().end,
            line: token().line,
            column: token().column
          });
          advance();
        }
      } else {
        // a replacement
        if (!token()) panic(mutation);

        // merge tokens if replacement affects multiple tokens
        merged = {
          value: token().value,
          start: token().start,
          end: token().end,
          line: token().line,
          column: token().column
        };

        while (merged.end < mutation.end) {
          advance();
          if (!token()) panic(mutation);
          merged.value = merged.value + token().value;
          merged.end = token().end;
        }

        offset = mutation.start - merged.start;
        offset2 = mutation.end - merged.start;
        merged.value = merged.value.slice(0, offset) + mutation.value + merged.value.slice(offset2);
        newTokens.push(merged);
        advance();
      }
    }

    // the rest unaffected tokens
    while (token()) {
      newTokens.push(token());
      advance();
    }

    var node = new SourceNode(null, null, null, newTokens.map(function(t) {
      return new SourceNode(t.line, t.column, filePath, t.value);
    }));

    var result = node.toStringWithSourceMap({file: filePath});
    result.map.setSourceContent(filePath, code);

    return {
      code: result.code,
      map: JSON.parse(result.map.toString())
    };
  }

  return modifyCode;
};

function panic(mutation) {
  throw new Error('Panic! mutation: start=' + mutation.start + ' end=' + mutation.end + ' str=' + mutation.value);
}
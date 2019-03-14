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
    var i = 0, ti = 0, ii = mutations.length, transformedTokens = [];
    var mutation, newValue, offset, offset2, token;

    mutations.sort(function(a, b) {return a.start - b.start;});

    for (; i < ii; i++) {
      mutation = mutations[i];

      if (!tokens[ti]) {
        // reached end
      } else if (tokens[ti].start > mutation.start) {
        if (transformedTokens.length && transformedTokens[transformedTokens.length - 1].start <= mutation.start) {
          throw new Error('does not allow mutating same token again. Token affected: ' +
            JSON.stringify(transformedTokens[transformedTokens.length - 1].value));
        } else {
          panic(mutation);
        }
      } else {
        // move to current affected token
        while (tokens[ti] && tokens[ti].end <= mutation.start) {
          transformedTokens.push(tokens[ti]);
          ti++;
        }
      }

      if (mutation.start === mutation.end) {
        // an insertion
        if (!tokens[ti] || tokens[ti].start === mutation.start) {
          // append or prepend
          transformedTokens.push({value: mutation.value});
          if (tokens[ti]) {
            transformedTokens.push(tokens[ti]);
            ti++;
          }
        } else {
          // insertion in this token
          offset = mutation.start - tokens[ti].start;
          newValue = tokens[ti].value.slice(0, offset) + mutation.value + tokens[ti].value.slice(offset);
          transformedTokens.push({
            value: newValue,
            start: tokens[ti].start,
            end: tokens[ti].end,
            line: tokens[ti].line,
            column: tokens[ti].column
          });
          ti++;
        }
      } else {
        // a replacement
        if (!tokens[ti]) panic(mutation);

        // merge tokens if replacement affects multiple tokens
        token = {
          value: tokens[ti].value,
          start: tokens[ti].start,
          end: tokens[ti].end,
          line: tokens[ti].line,
          column: tokens[ti].column
        };
        while (token.end < mutation.end) {
          ti++;
          if (!tokens[ti]) panic(mutation);
          token.value = token.value + tokens[ti].value;
          token.end = tokens[ti].end;
        }

        offset = mutation.start - token.start;
        offset2 = mutation.end - token.start;
        token.value = token.value.slice(0, offset) + mutation.value + token.value.slice(offset2);
        transformedTokens.push(token);
        ti++;
      }
    }

    while (ti < tokens.length) {
      transformedTokens.push(tokens[ti]);
      ti++;
    }

    // console.log('transformedTokens', transformedTokens);

    var node = new SourceNode(null, null, null, transformedTokens.map(function(t) {
      if (t.line) {
        return new SourceNode(t.line, t.column, filePath, t.value);
      } else {
        return t.value; // no source map needed
      }
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
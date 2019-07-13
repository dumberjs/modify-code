var tokenize = require('./tokenize');
var SourceNode = require('source-map').SourceNode;

exports.__esModule = true;
exports['default'] = function(code, filePath) {
  // the file name to be used in sourcemap sources and file fields
  filePath = (filePath || 'file.js').replace(/\\/g, '/');
  var mutations = [];

  function checkIndex(idx) {
    if (typeof idx !== 'number' || idx < 0) {
      throw new Error('index: ' + JSON.stringify(idx) + ' is not a valid index');
    }
    if (idx > code.length) {
      throw new Error('index: ' + idx + ' is out of range of code length: ' + code.length);
    }
  }

  function checkOverlap(start, end, str) {
    var i = 0, ii = mutations.length, mutation;
    for (; i < ii; i++) {
      mutation = mutations[i];
      // don't check insertion against insertion
      if (mutation.start === mutation.end && start === end) continue;
      if (mutation.start < end && mutation.end > start) {
        throw new Error('Conflict! new mutation: start=' + mutation.start +
          ' end=' + mutation.end + ' str=' + mutation.value + ' ' +
          'with existing mutation: start=' + start +
          ' end=' + end + ' str=' + str);

      }
    }
  }

  function replace(start, end, str) {
    var existing;
    checkIndex(start);
    checkIndex(end);
    checkOverlap(start, end, str);

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
    var mutation, offset, offset2, merged, isInsertion;
    var tokens = tokenize(code);

    mutations.sort(function(a, b) {return a.start - b.start;});

    for (; i < ii; i++) {
      mutation = mutations[i];
      isInsertion = mutation.start === mutation.end;

      if (tokens[ti] && tokens[ti].start > mutation.start) {
        if (newTokens.length && newTokens[newTokens.length - 1].start <= mutation.start) {
          throw new Error('does not allow mutating same token again. Token affected: ' +
            JSON.stringify(newTokens[newTokens.length - 1].value));
        } else {
          panic(mutation);
        }
      } else {
        // move to current affected token
        while (tokens[ti] && (isInsertion ?
          tokens[ti].end < mutation.start :
          tokens[ti].end <= mutation.start // push replacement to next token
        )) {
          newTokens.push(tokens[ti]);
          ti++;
        }
      }

      if (isInsertion) {
        // an insertion
        if (!tokens[ti]) {
          // this can only happen when
          // 1. empty code where tokens size is zero.
          // 2. append in the end
          if (mutation.start === 0) {
            newTokens.push({
              value: mutation.value,
              start: 0,
              end: 0,
              line: 1,
              column: 0
            });
          } else if (newTokens.length && newTokens[newTokens.length - 1].end === mutation.start) {
            newTokens[newTokens.length - 1].value += mutation.value;
          } else {
            panic(mutation);
          }
        } else {
          // insertion in this token
          offset = mutation.start - tokens[ti].start;
          tokens[ti].value = tokens[ti].value.slice(0, offset) + mutation.value + tokens[ti].value.slice(offset);
          newTokens.push(tokens[ti]);
          ti++;
        }
      } else {
        // a replacement
        if (!tokens[ti]) panic(mutation);

        // merge tokens if replacement affects multiple tokens
        merged = tokens[ti];
        while (merged.end < mutation.end) {
          ti++;
          if (!tokens[ti]) panic(mutation);
          merged.value = merged.value + tokens[ti].value;
          merged.end = tokens[ti].end;
        }

        offset = mutation.start - merged.start;
        offset2 = mutation.end - merged.start;
        merged.value = merged.value.slice(0, offset) + mutation.value + merged.value.slice(offset2);
        newTokens.push(merged);
        ti++;
      }
    }

    // the rest unaffected tokens
    while (tokens[ti]) {
      newTokens.push(tokens[ti]);
      ti++;
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
  throw new Error('Panic! mutation: start=' + mutation.start +
    ' end=' + mutation.end + ' str=' + mutation.value);
}
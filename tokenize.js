var esprima = require('esprima');

// esprima tokens only contain essential tokens, we fill up gaps in between
// so that we can reproduce the full code string.
module.exports = function(code) {
  var lastToken = {end: 0, endLine: 1, endColumn: 0};
  var tokens = esprima.tokenize(code, {range: true, loc: true});
  var i = 0, ii = tokens.length, fullTokens = [], token;

  for (; i < ii; i++) {
    token = {
      value: tokens[i].value,
      start: tokens[i].range[0],
      end: tokens[i].range[1],
      line: tokens[i].loc.start.line,
      column: tokens[i].loc.start.column,
      endLine: tokens[i].loc.end.line,
      endColumn: tokens[i].loc.end.column,
    };

    if (token.start !== lastToken.end) {
      // fill up gap (e.g. white spaces, comments)
      fullTokens.push({
        value: code.slice(lastToken.end, token.start),
        start: lastToken.end,
        end: token.start,
        line: lastToken.endLine,
        column: lastToken.endColumn,
        endLine: token.line,
        endColumn: token.column
      });
    }

    lastToken = token;
    fullTokens.push(token);
  }

  if (code.length > lastToken.end) {
    // fill up tailing gap
    fullTokens.push({
      value: code.slice(lastToken.end),
      start: lastToken.end,
      end: code.length,
      line: lastToken.endLine,
      column: lastToken.endColumn,
      // technically end line/column is not correct for tailing gap,
      // but it doesn't matter since it is an irrelevant token.
      endLine: lastToken.endLine,
      endColumn: lastToken.endColumn
    });
  }

  return fullTokens;
};

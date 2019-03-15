var esprima = require('esprima');

// esprima tokens only contain essential tokens, we fill up gaps in between
// so that we can reproduce the full code string.
module.exports = function(code) {
  var lastToken = {end: 0};
  var tokens = esprima.tokenize(code, {range: true, loc: true});
  var i = 0, ii = tokens.length, fullTokens = [], token;

  for (; i < ii; i++) {
    token = {
      value: tokens[i].value,
      start: tokens[i].range[0],
      end: tokens[i].range[1],
      line: tokens[i].loc.start.line,
      column: tokens[i].loc.start.column,
    };

    if (token.start !== lastToken.end) {
      // fill up gap (e.g. white spaces, comments)
      fullTokens.push({
        value: code.slice(lastToken.end, token.start),
        start: lastToken.end,
        end: token.start
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
      end: code.length
    });
  }

  return fullTokens;
};

var esprima = require('esprima');

// esprima tokens only contain essential tokens, we fill up gaps in between
// so that we can reproduce the full code string.
module.exports = function(code) {
  var tokens = esprima.tokenize(code, {range: true, loc: true});
  var i = 0, ii = tokens.length, fullTokens = [], token, lastToken;

  for (; i < ii; i++) {
    token = {
      value: tokens[i].value,
      start: tokens[i].range[0],
      end: tokens[i].range[1],
      line: tokens[i].loc.start.line,
      column: tokens[i].loc.start.column
    };

    if (i === 0) {
      if (token.start !== 0) {
        // merge leading gap (e.g. white spaces, comments)
        token.value = code.slice(0, token.start) + token.value;
        token.start = 0;
      }
    } else if (token.start !== lastToken.end) {
      // merge gap (e.g. white spaces, comments) into pervious token
      lastToken.value += code.slice(lastToken.end, token.start);
      lastToken.end = token.start;
    }

    lastToken = token;
    fullTokens.push(token);
  }

  if (lastToken && code.length > lastToken.end) {
    // merge tailing gap (e.g. white spaces, comments) into pervious token
    lastToken.value += code.slice(lastToken.end, code.length);
    lastToken.end = code.length;
  }

  return fullTokens;
};

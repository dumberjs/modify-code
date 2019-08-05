var parser = require('@babel/parser');

module.exports = function(code) {
  var tokens = parser.parse(code, {sourceType: 'module', plugins: [
    'jsx',
    'typescript',
    'asyncGenerators',
    'bigInt',
    'classProperties',
    'classPrivateProperties',
    'classPrivateMethods',
    'decorators-legacy',
    // ['decorators', {'decoratorsBeforeExport': true}],
    'doExpressions',
    'dynamicImport',
    'exportDefaultFrom',
    'exportNamespaceFrom',
    'functionBind',
    'functionSent',
    'importMeta',
    'logicalAssignment',
    'nullishCoalescingOperator',
    'numericSeparator',
    'objectRestSpread',
    'optionalCatchBinding',
    'optionalChaining',
    'partialApplication',
    // ['pipelineOperator', {proposal: 'minimal'}],
    'throwExpressions',
  ], tokens: true}).tokens;

  var i = 0, ii = tokens.length, fullTokens = [], token, lastToken;

  for (; i < ii; i++) {
    token = {
      start: tokens[i].start,
      end: tokens[i].end,
      line: tokens[i].loc.start.line,
      column: tokens[i].loc.start.column
    };

    if (token.start === token.end) continue;
    token.value = code.slice(token.start, token.end);

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

  if (fullTokens.length === 0 && code.length) {
    // code contains non-empty string but no valid js like /* empty */
    fullTokens.push({
      value: code,
      start: 0,
      end: code.length,
      line: 1,
      column: 0
    });
  }

  return fullTokens;
};

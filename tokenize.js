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
      value: code.slice(tokens[i].start, tokens[i].end),
      start: tokens[i].start,
      end: tokens[i].end,
      line: tokens[i].loc.start.line,
      column: tokens[i].loc.start.column,
      endLine: tokens[i].loc.end.line,
      endColumn: tokens[i].loc.end.column
    };

    if (token.start === token.end) continue;

    if (i === 0) {
      if (token.start !== 0) {
        // leading gap (e.g. white spaces, comments)
        fullTokens.push({
          value: code.slice(0, token.start),
          start: 0,
          end: token.start,
          line: 1,
          column: 0
        });
      }
    } else if (token.start !== lastToken.end) {
      // gap (e.g. white spaces, comments)
      fullTokens.push({
        value: code.slice(lastToken.end, token.start),
        start: lastToken.end,
        end: token.start,
        line: lastToken.endLine,
        column: lastToken.endColumn
      });
    }

    lastToken = token;
    fullTokens.push({
      value: token.value,
      start: token.start,
      end: token.end,
      line: token.line,
      column: token.column
    });
  }

  if (lastToken && code.length > lastToken.end) {
    // tailing gap (e.g. white spaces, comments) into previous token
    fullTokens.push({
      value: code.slice(lastToken.end),
      start: lastToken.end,
      end: code.length,
      line: lastToken.endLine,
      column: lastToken.endColumn
    });
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

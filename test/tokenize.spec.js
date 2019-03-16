var test = require('tape');
var tokenize = require('../tokenize');

function tokensToCode(tokens) {
  return tokens.map(function(t) {return t.value;}).join('');
}

test('tokenize supports empty input', function(t) {
  var code = '';
  var tokens = tokenize(code);
  t.deepEqual(tokens, []);
  t.equal(tokensToCode(tokens), code);
  t.end();
});

test('tokenize outputs tokens', function(t) {
  var code = 'var a = 1;';
  var tokens = tokenize(code);
  t.deepEqual(
    tokens,
    [
      { value: 'var', start: 0, line: 1, column: 0 , end: 3, endLine: 1, endColumn: 3 },
      { value: ' ', start: 3 , end: 4, line: 1, column: 3, endLine: 1, endColumn: 4 },
      { value: 'a', start: 4, line: 1, column: 4, end: 5, endLine: 1, endColumn: 5 },
      { value: ' ', start: 5, end: 6, line: 1, column: 5, endLine: 1, endColumn: 6 },
      { value: '=', start: 6, line: 1, column: 6, end: 7, endLine: 1, endColumn: 7 },
      { value: ' ', start: 7, end: 8, line: 1, column: 7, endLine: 1, endColumn: 8 },
      { value: '1', start: 8, line: 1, column: 8 , end: 9, endLine: 1, endColumn: 9 },
      { value: ';', start: 9, line: 1, column: 9 , end: 10, endLine: 1, endColumn: 10 }
    ]
  );
  t.equal(tokensToCode(tokens), code);
  t.end();
});

test('tokenize outputs tokens with leading and tailing white spaces', function(t) {
  var code = '// lorem\nvar a = 1;\n\n';
  var tokens = tokenize(code);
  t.deepEqual(
    tokens,
    [
      { value: '// lorem\n', start: 0, end: 9, line: 1, column: 0, endLine: 2, endColumn: 0 },
      { value: 'var', start: 9, line: 2, column: 0, end: 12, endLine: 2, endColumn: 3 },
      { value: ' ', start: 12, end: 13, line: 2, column: 3, endLine: 2, endColumn: 4 },
      { value: 'a', start: 13, line: 2, column: 4, end: 14, endLine: 2, endColumn: 5 },
      { value: ' ', start: 14, end: 15, line: 2, column: 5, endLine: 2, endColumn: 6 },
      { value: '=', start: 15, line: 2, column: 6, end: 16, endLine: 2, endColumn: 7 },
      { value: ' ', start: 16, end: 17, line: 2, column: 7, endLine: 2, endColumn: 8 },
      { value: '1', start: 17, line: 2, column: 8, end: 18, endLine: 2, endColumn: 9 },
      { value: ';', start: 18, line: 2, column: 9, end: 19, endLine: 2, endColumn: 10 },
      { value: '\n\n', start: 19, end: 21, line: 2, column: 10, endLine: 2, endColumn: 10 }
    ]
  );
  t.equal(tokensToCode(tokens), code);
  t.end();
});

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

test('tokenize supports empty input, case2', function(t) {
  var code = '// empty code';
  var tokens = tokenize(code);
  t.deepEqual(tokens, [
    { value: '// empty code', start: 0, end: 13, line: 1, column: 0 }
  ]);
  t.equal(tokensToCode(tokens), code);
  t.end();
});

test('tokenize outputs tokens', function(t) {
  var code = 'var a = 1;';
  var tokens = tokenize(code);
  t.deepEqual(
    tokens,
    [
      { value: 'var ', start: 0, end: 4, line: 1, column: 0 },
      { value: 'a ', start: 4, end: 6, line: 1, column: 4 },
      { value: '= ', start: 6, end: 8, line: 1, column: 6 },
      { value: '1', start: 8, end: 9, line: 1, column: 8 },
      { value: ';', start: 9, end: 10, line: 1, column: 9 }
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
      { value: '// lorem\nvar ', start: 0, end: 13, line: 2, column: 0 },
      { value: 'a ', start: 13, end: 15, line: 2, column: 4 },
      { value: '= ', start: 15, end: 17, line: 2, column: 6 },
      { value: '1', start: 17, line: 2, column: 8, end: 18 },
      { value: ';\n\n', start: 18, end: 21, line: 2, column: 9 }
    ]
  );
  t.equal(tokensToCode(tokens), code);
  t.end();
});

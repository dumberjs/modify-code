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

test('tokenize supports almost empty input', function(t) {
  var code = '\n';
  var tokens = tokenize(code);
  t.deepEqual(tokens, [
    { value: '\n', start: 0, end: 1, line: 1, column: 0 }
  ]);
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
      { value: 'var', start: 0, end: 3, line: 1, column: 0 },
      { value: ' ', start: 3, end: 4, line: 1, column: 3 },
      { value: 'a', start: 4, end: 5, line: 1, column: 4 },
      { value: ' ', start: 5, end: 6, line: 1, column: 5 },
      { value: '=', start: 6, end: 7, line: 1, column: 6 },
      { value: ' ', start: 7, end: 8, line: 1, column: 7 },
      { value: '1', start: 8, end: 9, line: 1, column: 8 },
      { value: ';', start: 9, end: 10, line: 1, column: 9 }
    ]
  );
  t.equal(tokensToCode(tokens), code);
  t.end();
});

test('tokenize outputs tokens with leading and tailing white spaces', function(t) {
  var code = '\n// lorem\nvar a = 1;\n\n';
  var tokens = tokenize(code);
  t.deepEqual(
    tokens,
    [
      { value: '\n', start: 0, end: 1, line: 1, column: 0 },
      { value: '// lorem', start: 1, end: 9, line: 2, column: 0 },
      { value: '\n', start: 9, end: 10, line: 2, column: 8 },
      { value: 'var', start: 10, end: 13, line: 3, column: 0 },
      { value: ' ', start: 13, end: 14, line: 3, column: 3 },
      { value: 'a', start: 14, end: 15, line: 3, column: 4 },
      { value: ' ', start: 15, end: 16, line: 3, column: 5 },
      { value: '=', start: 16, end: 17, line: 3, column: 6 },
      { value: ' ', start: 17, end: 18, line: 3, column: 7 },
      { value: '1', start: 18, end: 19, line: 3, column: 8 },
      { value: ';', start: 19, end: 20, line: 3, column: 9 },
      { value: '\n\n', start: 20, end: 22, line: 3, column: 10 }
    ]
  );
  t.equal(tokensToCode(tokens), code);
  t.end();
});

test('tokenize understand latest syntax', function(t) {
  var code = '@a()\nexport class B {\n  c = 1;\n}\n';
  var tokens = tokenize(code);
  t.deepEqual(tokens, [
    { value: '@', start: 0, end: 1, line: 1, column: 0 },
    { value: 'a', start: 1, end: 2, line: 1, column: 1 },
    { value: '(', start: 2, end: 3, line: 1, column: 2 },
    { value: ')', start: 3, end: 4, line: 1, column: 3 },
    { value: '\n', start: 4, end: 5, line: 1, column: 4 },
    { value: 'export', start: 5, end: 11, line: 2, column: 0 },
    { value: ' ', start: 11, end: 12, line: 2, column: 6 },
    { value: 'class', start: 12, end: 17, line: 2, column: 7 },
    { value: ' ', start: 17, end: 18, line: 2, column: 12 },
    { value: 'B', start: 18, end: 19, line: 2, column: 13 },
    { value: ' ', start: 19, end: 20, line: 2, column: 14 },
    { value: '{', start: 20, end: 21, line: 2, column: 15 },
    { value: '\n  ', start: 21, end: 24, line: 2, column: 16 },
    { value: 'c', start: 24, end: 25, line: 3, column: 2 },
    { value: ' ', start: 25, end: 26, line: 3, column: 3 },
    { value: '=', start: 26, end: 27, line: 3, column: 4 },
    { value: ' ', start: 27, end: 28, line: 3, column: 5 },
    { value: '1', start: 28, end: 29, line: 3, column: 6 },
    { value: ';', start: 29, end: 30, line: 3, column: 7 },
    { value: '\n', start: 30, end: 31, line: 3, column: 8 },
    { value: '}', start: 31, end: 32, line: 4, column: 0 },
    { value: '\n', start: 32, end: 33, line: 4, column: 1 }
  ]);
  t.equal(tokensToCode(tokens), code);
  t.end();
});

test('tokenize understand jsx and typescript syntax', function(t) {
  var code = 'export default () => <button onClick={props.onClick}>OK</button>;';
  var tokens = tokenize(code);
  t.deepEqual(tokens, [
    { value: 'export', start: 0, end: 6, line: 1, column: 0 },
    { value: ' ', start: 6, end: 7, line: 1, column: 6 },
    { value: 'default', start: 7, end: 14, line: 1, column: 7 },
    { value: ' ', start: 14, end: 15, line: 1, column: 14 },
    { value: '(', start: 15, end: 16, line: 1, column: 15 },
    { value: ')', start: 16, end: 17, line: 1, column: 16 },
    { value: ' ', start: 17, end: 18, line: 1, column: 17 },
    { value: '=>', start: 18, end: 20, line: 1, column: 18 },
    { value: ' ', start: 20, end: 21, line: 1, column: 20 },
    { value: '<', start: 21, end: 22, line: 1, column: 21 },
    { value: 'button', start: 22, end: 28, line: 1, column: 22 },
    { value: ' ', start: 28, end: 29, line: 1, column: 28 },
    { value: 'onClick', start: 29, end: 36, line: 1, column: 29 },
    { value: '=', start: 36, end: 37, line: 1, column: 36 },
    { value: '{', start: 37, end: 38, line: 1, column: 37 },
    { value: 'props', start: 38, end: 43, line: 1, column: 38 },
    { value: '.', start: 43, end: 44, line: 1, column: 43 },
    { value: 'onClick', start: 44, end: 51, line: 1, column: 44 },
    { value: '}', start: 51, end: 52, line: 1, column: 51 },
    { value: '>', start: 52, end: 53, line: 1, column: 52 },
    { value: 'OK', start: 53, end: 55, line: 1, column: 53 },
    { value: '<', start: 55, end: 56, line: 1, column: 55 },
    { value: '/', start: 56, end: 57, line: 1, column: 56 },
    { value: 'button', start: 57, end: 63, line: 1, column: 57 },
    { value: '>', start: 63, end: 64, line: 1, column: 63 },
    { value: ';', start: 64, end: 65, line: 1, column: 64 }
  ]
);
  t.equal(tokensToCode(tokens), code);
  t.end();
});

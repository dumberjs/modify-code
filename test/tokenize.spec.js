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
  var code = '\n// lorem\nvar a = 1;\n\n';
  var tokens = tokenize(code);
  t.deepEqual(
    tokens,
    [
      { value: '\n// lorem\n', start: 0, end: 10, line: 2, column: 0 },
      { value: 'var ', start: 10, end: 14, line: 3, column: 0 },
      { value: 'a ', start: 14, end: 16, line: 3, column: 4 },
      { value: '= ', start: 16, end: 18, line: 3, column: 6 },
      { value: '1', start: 18, end: 19, line: 3, column: 8 },
      { value: ';\n\n', start: 19, end: 22, line: 3, column: 9 }
    ]
  );
  t.equal(tokensToCode(tokens), code);
  t.end();
});

test('tokenize understand latest syntax', function(t) {
  var code = '@a()\nexport class B {\n  c = 1;\n}\n';
  var tokens = tokenize(code);
  t.deepEqual(tokens, [
    { start: 0, end: 1, line: 1, column: 0, value: '@' },
    { start: 1, end: 2, line: 1, column: 1, value: 'a' },
    { start: 2, end: 3, line: 1, column: 2, value: '(' },
    { start: 3, end: 5, line: 1, column: 3, value: ')\n' },
    { start: 5, end: 12, line: 2, column: 0, value: 'export ' },
    { start: 12, end: 18, line: 2, column: 7, value: 'class ' },
    { start: 18, end: 20, line: 2, column: 13, value: 'B ' },
    { start: 20, end: 24, line: 2, column: 15, value: '{\n  ' },
    { start: 24, end: 26, line: 3, column: 2, value: 'c ' },
    { start: 26, end: 28, line: 3, column: 4, value: '= ' },
    { start: 28, end: 29, line: 3, column: 6, value: '1' },
    { start: 29, end: 31, line: 3, column: 7, value: ';\n' },
    { start: 31, end: 33, line: 4, column: 0, value: '}\n' }
  ]);
  t.equal(tokensToCode(tokens), code);
  t.end();
});

test('tokenize understand jsx and typescript syntax', function(t) {
  var code = 'export default () => <button onClick={props.onClick}>OK</button>;';
  var tokens = tokenize(code);
  t.deepEqual(tokens, [
    { start: 0, end: 7, line: 1, column: 0, value: 'export ' },
    { start: 7, end: 15, line: 1, column: 7, value: 'default ' },
    { start: 15, end: 16, line: 1, column: 15, value: '(' },
    { start: 16, end: 18, line: 1, column: 16, value: ') ' },
    { start: 18, end: 21, line: 1, column: 18, value: '=> ' },
    { start: 21, end: 22, line: 1, column: 21, value: '<' },
    { start: 22, end: 29, line: 1, column: 22, value: 'button ' },
    { start: 29, end: 36, line: 1, column: 29, value: 'onClick' },
    { start: 36, end: 37, line: 1, column: 36, value: '=' },
    { start: 37, end: 38, line: 1, column: 37, value: '{' },
    { start: 38, end: 43, line: 1, column: 38, value: 'props' },
    { start: 43, end: 44, line: 1, column: 43, value: '.' },
    { start: 44, end: 51, line: 1, column: 44, value: 'onClick' },
    { start: 51, end: 52, line: 1, column: 51, value: '}' },
    { start: 52, end: 53, line: 1, column: 52, value: '>' },
    { start: 53, end: 55, line: 1, column: 53, value: 'OK' },
    { start: 55, end: 56, line: 1, column: 55, value: '<' },
    { start: 56, end: 57, line: 1, column: 56, value: '/' },
    { start: 57, end: 63, line: 1, column: 57, value: 'button' },
    { start: 63, end: 64, line: 1, column: 63, value: '>' },
    { start: 64, end: 65, line: 1, column: 64, value: ';' }
  ]);
  t.equal(tokensToCode(tokens), code);
  t.end();
});

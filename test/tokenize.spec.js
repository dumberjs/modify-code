var test = require('tape');
var tokenize = require('../tokenize');

function tokensToCode(tokens) {
  return tokens.map(function(t) {return t.value;}).join('');
}

test('tokenize outputs tokens', function(t) {
  var code = 'var a = 1;';
  var tokens = tokenize(code);
  t.deepEqual(
    tokens,
    [
      { type: 'Keyword', value: 'var', start: 0, line: 1, column: 0 , end: 3 },
      { value: ' ', start: 3 , end: 4 },
      { type: 'Identifier', value: 'a', start: 4, line: 1, column: 4 , end: 5 },
      { value: ' ', start: 5, end: 6 },
      { type: 'Punctuator', value: '=', start: 6, line: 1, column: 6 , end: 7 },
      { value: ' ', start: 7, end: 8 },
      { type: 'Numeric', value: '1', start: 8, line: 1, column: 8 , end: 9 },
      { type: 'Punctuator', value: ';', start: 9, line: 1, column: 9 , end: 10 }
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
      { value: '// lorem\n', start: 0, end: 9 },
      { type: 'Keyword', value: 'var', start: 9, line: 2, column: 0, end: 12 },
      { value: ' ', start: 12, end: 13 },
      { type: 'Identifier', value: 'a', start: 13, line: 2, column: 4, end: 14 },
      { value: ' ', start: 14, end: 15 },
      { type: 'Punctuator', value: '=', start: 15, line: 2, column: 6, end: 16 },
      { value: ' ', start: 16, end: 17 },
      { type: 'Numeric', value: '1', start: 17, line: 2, column: 8, end: 18 },
      { type: 'Punctuator', value: ';', start: 18, line: 2, column: 9, end: 19 },
      { value: '\n\n', start: 19, end: 21 }
    ]
  );
  t.equal(tokensToCode(tokens), code);
  t.end();
});

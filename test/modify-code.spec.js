var test = require('tape');
var modify = require('../index');
var smc = require('sourcemap-codec');
// var decode = smc.decode;
var encode = smc.encode;

test('modify-code outputs identity map', function(t) {
  var m = modify('var a = 1;');
  t.deepEqual(m.transform(), {
    code: 'var a = 1;',
    map: {
      version: 3,
      sources: ['file.js'],
      sourcesContent: ['var a = 1;'],
      file: 'file.js',
      names: [],
      mappings: encode([
        [
          [0, 0, 0, 0],
          [3],
          [4, 0, 0, 4],
          [5],
          [6, 0, 0, 6],
          [7],
          [8, 0, 0, 8],
          [9, 0, 0, 9]
        ]
      ])
    }
  })
  t.end();
});

test('modify-code replaces one token', function(t) {
  var m = modify('var a = 1;');
  m.replace(4, 5, 'hello')
  t.deepEqual(m.transform(), {
    code: 'var hello = 1;',
    map: {
      version: 3,
      sources: ['file.js'],
      sourcesContent: ['var a = 1;'],
      file: 'file.js',
      names: [],
      mappings: encode([
        [
          [0, 0, 0, 0],
          [3],
          [4, 0, 0, 4],
          [9],
          [10, 0, 0, 6],
          [11],
          [12, 0, 0, 8],
          [13, 0, 0, 9]
        ]
      ])
    }
  })
  t.end();
});

test('modify-code deletes one token', function(t) {
  var m = modify('var a = 1;');
  m.delete(9, 10);
  t.deepEqual(m.transform(), {
    code: 'var a = 1',
    map: {
      version: 3,
      sources: ['file.js'],
      sourcesContent: ['var a = 1;'],
      file: 'file.js',
      names: [],
      mappings: encode([
        [
          [0, 0, 0, 0],
          [3],
          [4, 0, 0, 4],
          [5],
          [6, 0, 0, 6],
          [7],
          [8, 0, 0, 8]
        ]
      ])
    }
  })
  t.end();
});

test('modify-code prepends content', function(t) {
  var m = modify('var a = 1;');
  m.prepend('/* c */ ');
  t.deepEqual(m.transform(), {
    code: '/* c */ var a = 1;',
    map: {
      version: 3,
      sources: ['file.js'],
      sourcesContent: ['var a = 1;'],
      file: 'file.js',
      names: [],
      mappings: encode([
        [
          [8, 0, 0, 0],
          [11],
          [12, 0, 0, 4],
          [13],
          [14, 0, 0, 6],
          [15],
          [16, 0, 0, 8],
          [17, 0, 0, 9]
        ]
      ])
    }
  })
  t.end();
});

test('modify-code prepends multiple contents', function(t) {
  var m = modify('var a = 1;');
  m.prepend('/* c */ ');
  m.prepend('/* d */ ');
  t.deepEqual(m.transform(), {
    code: '/* c */ /* d */ var a = 1;',
    map: {
      version: 3,
      sources: ['file.js'],
      sourcesContent: ['var a = 1;'],
      file: 'file.js',
      names: [],
      mappings: encode([
        [
          [16, 0, 0, 0],
          [19],
          [20, 0, 0, 4],
          [21],
          [22, 0, 0, 6],
          [23],
          [24, 0, 0, 8],
          [25, 0, 0, 9]
        ]
      ])
    }
  })
  t.end();
});

test('modify-code appends content', function(t) {
  var m = modify('var a = 1;');
  m.append(' /* c */');
  t.deepEqual(m.transform(), {
    code: 'var a = 1; /* c */',
    map: {
      version: 3,
      sources: ['file.js'],
      sourcesContent: ['var a = 1;'],
      file: 'file.js',
      names: [],
      mappings: encode([
        [
          [0, 0, 0, 0],
          [3],
          [4, 0, 0, 4],
          [5],
          [6, 0, 0, 6],
          [7],
          [8, 0, 0, 8],
          [9, 0, 0, 9],
          [10]
        ]
      ])
    }
  })
  t.end();
});

test('modify-code appends multiple contents', function(t) {
  var m = modify('var a = 1;');
  m.append(' /* c */');
  m.append(' /* d */');
  t.deepEqual(m.transform(), {
    code: 'var a = 1; /* c */ /* d */',
    map: {
      version: 3,
      sources: ['file.js'],
      sourcesContent: ['var a = 1;'],
      file: 'file.js',
      names: [],
      mappings: encode([
        [
          [0, 0, 0, 0],
          [3],
          [4, 0, 0, 4],
          [5],
          [6, 0, 0, 6],
          [7],
          [8, 0, 0, 8],
          [9, 0, 0, 9],
          [10]
        ]
      ])
    }
  })
  t.end();
});


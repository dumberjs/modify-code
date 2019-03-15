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

test('modify-code does two replacement, each for one token', function(t) {
  var m = modify('require("a");\nrequire("b");\n', 'some.js');
  // replace "a" to "foo";
  m.replace(9, 10, 'foo');
  // replace "b" to "bar";
  m.replace(23, 24, 'bar');

  t.deepEqual(m.transform(), {
    code: 'require("foo");\nrequire("bar");\n',
    map: {
      version: 3,
      sources: ['some.js'],
      sourcesContent: ['require("a");\nrequire("b");\n'],
      file: 'some.js',
      names: [],
      mappings: encode([
        [
          [0, 0, 0, 0],
          [7, 0, 0, 7],
          [8, 0, 0, 8],
          [13, 0, 0, 11],
          [14, 0, 0, 12],
          [15]
        ],
        [
          [0, 0, 1, 0],
          [7, 0, 1, 7],
          [8, 0, 1, 8],
          [13, 0, 1, 11],
          [14, 0, 1, 12],
          [15]
        ]
      ])
    }
  })
  t.end();
});

test('modify-code does two replacement, each for one token, in different order', function(t) {
  var m = modify('require("a");\nrequire("b");\n', 'some.js')
  // replace "b" to "bar"
  .replace(23, 24, 'bar')
  // replace "a" to "foo"
  .replace(9, 10, 'foo');

  t.deepEqual(m.transform(), {
    code: 'require("foo");\nrequire("bar");\n',
    map: {
      version: 3,
      sources: ['some.js'],
      sourcesContent: ['require("a");\nrequire("b");\n'],
      file: 'some.js',
      names: [],
      mappings: encode([
        [
          [0, 0, 0, 0],
          [7, 0, 0, 7],
          [8, 0, 0, 8],
          [13, 0, 0, 11],
          [14, 0, 0, 12],
          [15]
        ],
        [
          [0, 0, 1, 0],
          [7, 0, 1, 7],
          [8, 0, 1, 8],
          [13, 0, 1, 11],
          [14, 0, 1, 12],
          [15]
        ]
      ])
    }
  })
  t.end();
});

test('modify-code replaces across multiple tokens', function(t) {
  var m = modify('require("a");\nrequire("b");\n', 'some.js');
  // replace "a" to "foo"
  m.replace(9, 10, 'foo');
  // replace require("b") to globalB()
  m.replace(14, 26, 'globalB()');

  t.deepEqual(m.transform(), {
    code: 'require("foo");\nglobalB();\n',
    map: {
      version: 3,
      sources: ['some.js'],
      sourcesContent: ['require("a");\nrequire("b");\n'],
      file: 'some.js',
      names: [],
      mappings: encode([
        [
          [0, 0, 0, 0],
          [7, 0, 0, 7],
          [8, 0, 0, 8],
          [13, 0, 0, 11],
          [14, 0, 0, 12],
          [15]
        ],
        [
          [0, 0, 1, 0],
          [9, 0, 1, 12],
          [10]
        ]
      ])
    }
  })
  t.end();
});

test('modify-code inserts content', function(t) {
  var m = modify('require("a");\nrequire("b");\n', 'some.js');
  // insert "var b =" before require("b")
  m.insert(14, 'var b = ');

  t.deepEqual(m.transform(), {
    code: 'require("a");\nvar b = require("b");\n',
    map: {
      version: 3,
      sources: ['some.js'],
      sourcesContent: ['require("a");\nrequire("b");\n'],
      file: 'some.js',
      names: [],
      mappings: encode([
        [
          [0, 0, 0, 0],
          [7, 0, 0, 7],
          [8, 0, 0, 8],
          [11, 0, 0, 11],
          [12, 0, 0, 12],
          [13]
        ],
        [
          [8, 0, 1, 0],
          [15, 0, 1, 7],
          [16, 0, 1, 8],
          [19, 0, 1, 11],
          [20, 0, 1, 12],
          [21]
        ]
      ])
    }
  })
  t.end();
});

test('modify-code inserts content inside a token', function(t) {
  var m = modify('require("a");\nrequire("b");\n', 'some.js');
  // insert "mock" before b
  m.insert(23, 'mock');

  t.deepEqual(m.transform(), {
    code: 'require("a");\nrequire("mockb");\n',
    map: {
      version: 3,
      sources: ['some.js'],
      sourcesContent: ['require("a");\nrequire("b");\n'],
      file: 'some.js',
      names: [],
      mappings: encode([
        [
          [0, 0, 0, 0],
          [7, 0, 0, 7],
          [8, 0, 0, 8],
          [11, 0, 0, 11],
          [12, 0, 0, 12],
          [13]
        ],
        [
          [0, 0, 1, 0],
          [7, 0, 1, 7],
          [8, 0, 1, 8],
          [15, 0, 1, 11],
          [16, 0, 1, 12],
          [17]
        ]
      ])
    }
  })
  t.end();
});

test('modify-code complains about invalid insertion', function(t) {
  var m = modify('var a = 1;');
  t.throws(function() { m.insert(20, '// lorem'); });
  t.throws(function() { m.insert(-1, '// lorem'); });
  t.end();
});

test('modify-code complains about invalid replacement', function(t) {
  var m = modify('var a = 1;');
  t.throws(function() { m.replace(20, '// lorem'); });
  t.throws(function() { m.replace(-1, 2, '// lorem'); });
  t.throws(function() { m.replace(8, 20, '// lorem'); });
  t.throws(function() { m.replace(8, 5, '// lorem'); });
  t.end();
});

test('modify-code complains about invalid delete', function(t) {
  var m = modify('var a = 1;');
  t.throws(function() { m.delete(20); });
  t.throws(function() { m.delete(-1, 2); });
  t.throws(function() { m.delete(8, 20); });
  t.throws(function() { m.delete(8, 5); });
  t.end();
});

test('modify-code complains about mutation on same token', function(t) {
  var m = modify('var foo = 1;');
  m.insert(5, '-');
  m.insert(6, '-');
  t.throws(function() { m.transform(); });
  t.end();
});

test('modify-code can chain mutation calls', function(t) {
  var result = modify('var a = require("a");\nexports.foo = a;\n', 'optional-file-name.js')
    // modify dependency "a" into "mock-a"
    .replace(17, 18, 'mock-a')
    // modify exported name "foo" to "bar"
    .replace(30, 33, 'bar')
    // remove line breaks
    .delete(21, 22)
    .delete(38, 39)
    // insert a statement after first line
    .insert(22, "a = '#' + a;")
    // prepend some content at the beginning
    .prepend('/* modified */\n')
    // append some content at the end
    .append('/* end of modified */\n')
    // generate code and sourcemap
    .transform();

  t.deepEqual(result, {
    code: '/* modified */\nvar a = require("mock-a");a = \'#\' + a;exports.bar = a;/* end of modified */\n',
    map: {
      version: 3,
      sources: [ 'optional-file-name.js' ],
      names: [],
      mappings: ';AAAA,G,CAAI,C,CAAE,C,CAAE,OAAO,CAAC,QAAG,CAAC,C,YACpB,OAAO,CAAC,G,CAAI,C,CAAE,CAAC,C',
      file: 'optional-file-name.js',
      sourcesContent: [ 'var a = require("a");\nexports.foo = a;\n' ]
    }
  });
  t.end();
});

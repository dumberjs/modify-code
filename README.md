# modify-code [![Build Status](https://travis-ci.org/dumberjs/modify-code.svg?branch=master)](https://travis-ci.org/dumberjs/modify-code)

Modify JavaScript code, generate source map for the modification. Inspired by [magic-string](https://github.com/Rich-Harris/magic-string).

Different from magic-string which either generates source map in resolution of line or char, modify-code generates source map in resolution of token (tokenized by [esprima](https://github.com/jquery/esprima)). The other difference is that modify-code has less features, for simplicity, it doesn't allow multiple mutations to touch same token.

modify-code got two npm dependencies: `esprima` and `source-map@^0.6.1` (easier to run in browser), so the footprint is bigger than magic-string.

## Usage

Following code example showed all methods.

1. The mutation APIs always use index numbers on original code string.
2. You don't need to apply updated index number in second mutation due to the code change done by first mutation.
3. All mutation calls are kind of independent, you can reorder the mutations, the final result would not change. Except multiple `prepend()` (or `append()`, or `insert()` on same location), the order matters for the insertions to same index.
4. Simpler than magic-string, modify-code doesn't allow multiple mutations to touch same token (code was tokenized by esprima) twice.
5. calls can be chained together. `const result = modifyCode(...).replace(...).prepend(...).transform()`.

```js
const modifyCode = require('modify-code');
// if optional-file-name is not provided, the default file name is "file.js"
const m = modifyCode('var a = require("a");\nexports.foo = a;\n', 'optional-file-name.js');
// modify dependency "a" into "mock-a"
m.replace(17, 18, 'mock-a');
// modify exported name "foo" to "bar"
m.replace(30, 33, 'bar');
// remove line breaks
m.delete(21, 22);
m.delete(38, 39);
// insert a statement after first line
m.insert(22, "a = '#' + a;");
// prepend some content at the beginning, it's a short-cut of insert(0, ...);
m.prepend('/* modified */\n');
// append some content at the end, it's a short-cut of insert(code.length, ...);
m.append('/* end of modified */\n');

// generate code and sourcemap
const result = m.transform();
// result is
{
  code: '/* modified */\nvar a = require("mock-a");a = \'#\' + a;exports.bar = a;/* end of modified */\n',
  map: {
    version: 3,
    sources: [ 'optional-file-name.js' ],
    names: [],
    mappings: 'AAAA;AAAA,IAAI,EAAE,EAAE,OAAO,CAAC,QAAG,CAAC,CACpB,mBAAO,CAAC,IAAI,EAAE,CAAC',
    file: 'optional-file-name.js',
    sourcesContent: [ 'var a = require("a");\nexports.foo = a;\n' ]
  }
}
```

## Join existing source map

If the code modification is one of the stages of code transpiling, you might want to apply this source map on top of an existing source map.

modify-code does not support existing source map. But you can use npm package `source-map` to easily apply source map on an existing source map, an example can be found here: https://github.com/gulp-sourcemaps/vinyl-sourcemaps-apply/blob/master/index.js

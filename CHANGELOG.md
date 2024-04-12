## [2.1.4](https://github.com/dumberjs/modify-code/compare/v2.1.3...v2.1.4) (2024-04-12)



## [2.1.3](https://github.com/dumberjs/modify-code/compare/v2.1.2...v2.1.3) (2023-04-26)


### Bug Fixes

* **build:** add esm to published file ([a8ab384](https://github.com/dumberjs/modify-code/commit/a8ab384db6fceada292a4af0b342d70b37b37eb5))



## [2.1.2](https://github.com/dumberjs/modify-code/compare/v2.1.1...v2.1.2) (2023-04-25)



## [2.1.1](https://github.com/dumberjs/modify-code/compare/v2.1.0...v2.1.1) (2022-06-06)



# [2.1.0](https://github.com/dumberjs/modify-code/compare/v2.0.0...v2.1.0) (2022-05-19)


### Features

* add .transformCodeOnly() ([bc7dfd4](https://github.com/dumberjs/modify-code/commit/bc7dfd44b8c3d0d2a5656134c0988dc550ce31cf))



# [2.0.0](https://github.com/dumberjs/modify-code/compare/v1.2.0...v2.0.0) (2022-05-17)


### Bug Fixes

* update source-map to fix issues on nodejs v18 ([dabd7e5](https://github.com/dumberjs/modify-code/commit/dabd7e515e720d9a051e67c8df1300404c8ae872))


### BREAKING CHANGES

* drop support of nodejs v8 and v10



# [1.2.0](https://github.com/dumberjs/modify-code/compare/v1.1.0...v1.2.0) (2020-04-02)


### Features

* remove babel parser, replaced with a patched js-tokens ([bc468b0](https://github.com/dumberjs/modify-code/commit/bc468b09bb006d3284a477aed19473b472370480))



# [1.1.0](https://github.com/dumberjs/modify-code/compare/v1.0.2...v1.1.0) (2020-01-18)


### Features

* support option noJsx and noTypeScript to skip those parsers ([52018aa](https://github.com/dumberjs/modify-code/commit/52018aa253817a7c473ca35f24f9707f295d1182)), closes [babel/babel#11029](https://github.com/babel/babel/issues/11029)



## [1.0.2](https://github.com/dumberjs/modify-code/compare/v1.0.1...v1.0.2) (2019-12-05)



## [1.0.1](https://github.com/dumberjs/modify-code/compare/v1.0.0...v1.0.1) (2019-09-05)


### Bug Fixes

* make spaces separated token to avoid mutation on same token ([63cc1da](https://github.com/dumberjs/modify-code/commit/63cc1da))



# [1.0.0](https://github.com/dumberjs/modify-code/compare/v0.5.3...v1.0.0) (2019-08-29)



## [0.5.3](https://github.com/dumberjs/modify-code/compare/v0.5.2...v0.5.3) (2019-07-16)


### Bug Fixes

* fix a regression on tokenising empty source code ([e85263d](https://github.com/dumberjs/modify-code/commit/e85263d))



## [0.5.2](https://github.com/dumberjs/modify-code/compare/v0.5.1...v0.5.2) (2019-07-14)



## [0.5.1](https://github.com/dumberjs/modify-code/compare/v0.5.0...v0.5.1) (2019-07-14)


### Bug Fixes

* support modify adjacent positions ([4f8e21a](https://github.com/dumberjs/modify-code/commit/4f8e21a))



# [0.5.0](https://github.com/dumberjs/modify-code/compare/v0.4.2...v0.5.0) (2019-07-13)


### Features

* switch from esprima to @babel/parser to support latest JS/TS/JSX syntax ([e88dfc9](https://github.com/dumberjs/modify-code/commit/e88dfc9))



## [0.4.2](https://github.com/dumberjs/modify-code/compare/v0.4.1...v0.4.2) (2019-07-13)


### Features

* improve TypeScript typing ([302879b](https://github.com/dumberjs/modify-code/commit/302879b))



## [0.4.1](https://github.com/dumberjs/modify-code/compare/v0.4.0...v0.4.1) (2019-07-13)



# [0.4.0](https://github.com/dumberjs/modify-code/compare/v0.3.2...v0.4.0) (2019-07-13)


### Features

* make it an ES module with default export ([00a0ac2](https://github.com/dumberjs/modify-code/commit/00a0ac2))


### BREAKING CHANGES

* the func is now on default export. This will make TypeScript happier.



## [0.3.2](https://github.com/dumberjs/modify-code/compare/v0.3.1...v0.3.2) (2019-07-13)


### Features

* improve TypeScript typing ([8c9e6ae](https://github.com/dumberjs/modify-code/commit/8c9e6ae))



## [0.3.1](https://github.com/dumberjs/modify-code/compare/v0.3.0...v0.3.1) (2019-07-13)


### Bug Fixes

* publish missing d.ts file ([9ca19e0](https://github.com/dumberjs/modify-code/commit/9ca19e0))



# [0.3.0](https://github.com/dumberjs/modify-code/compare/v0.2.1...v0.3.0) (2019-07-06)


### Features

* add TypeScript typing definition ([56f3385](https://github.com/dumberjs/modify-code/commit/56f3385))



## [0.2.1](https://github.com/dumberjs/modify-code/compare/v0.2.0...v0.2.1) (2019-03-17)


### Bug Fixes

* fix tokenization on non-empty code with no js (only comments or white spaces) ([850ca3e](https://github.com/dumberjs/modify-code/commit/850ca3e))



# [0.2.0](https://github.com/dumberjs/modify-code/compare/v0.1.3...v0.2.0) (2019-03-17)


### Features

* reduce source map size by merging white spaces and mutations into existing tokens ([5eafbd7](https://github.com/dumberjs/modify-code/commit/5eafbd7))



## [0.1.3](https://github.com/dumberjs/modify-code/compare/v0.1.2...v0.1.3) (2019-03-16)



## [0.1.2](https://github.com/dumberjs/modify-code/compare/v0.1.1...v0.1.2) (2019-03-15)


### Bug Fixes

* avoid mapping to null source ([4076d3f](https://github.com/dumberjs/modify-code/commit/4076d3f))



## [0.1.1](https://github.com/dumberjs/modify-code/compare/v0.1.0...v0.1.1) (2019-03-15)



# 0.1.0 (2019-03-14)


### Features

* first implementation of modify-code ([91cd63e](https://github.com/dumberjs/modify-code/commit/91cd63e))





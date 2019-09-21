[![view on npm](http://img.shields.io/npm/v/uttori-utilities.svg)](https://www.npmjs.org/package/uttori-utilities)
[![npm module downloads](http://img.shields.io/npm/dt/uttori-utilities.svg)](https://www.npmjs.org/package/uttori-utilities)
[![Build Status](https://travis-ci.org/uttori/uttori-utilities.svg?branch=master)](https://travis-ci.org/uttori/uttori-utilities)
[![Dependency Status](https://david-dm.org/uttori/uttori-utilities.svg)](https://david-dm.org/uttori/uttori-utilities)
[![Coverage Status](https://coveralls.io/repos/uttori/uttori-utilities/badge.svg?branch=master)](https://coveralls.io/r/uttori/uttori-utilities?branch=master)

# Uttori Utilities

A set of helper utilities for Uttoti components. All utilities should be at 100% test coverage to be included here.

## FileUtility

Utilities for dealing with files on the file system. Wrappers for methods that might change in the future but the method should not need to.

## FunctionQueue

A fork of [throttled-queue](https://github.com/shaunpersad/throttled-queue) by [Shaun Persad](https://github.com/shaunpersad) to use ES6 and simpler exports.

## SqlWhereParser / TokenizeThis / Operator / parseQueryToArray

A fork of [SqlWhereParser](https://github.com/shaunpersad/sql-where-parser) by [Shaun Persad](https://github.com/shaunpersad). Cleaned up and converted to ES6 with more test coverage and some additions to the default syntax and a reogranization of the code.

```
MIT License

Copyright (c) 2016 shaunpersad

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## validateQuery

Validates and parses a SQL-like query structure using `SqlWhereParser`.

## parseQueryToRamda

Using default SQL tree output, from `SqlWhereParser` for example, iterate over that tree to convert to items to be checked group-by-group (AND, OR), prop-by-prop to filter functions with [Ramda](https://ramdajs.com/).

## Classifiers - Naive Bayes / Fisher's Discriminant Ratio aka Fisher's Linear Discriminant

A fork of [spam-filter](https://github.com/zrajnis/spam-filter) by [Zvonimir Rajniš](https://github.com/zrajnis). Cleaned up and converted to ES6 with more test coverage and a more readable code flow and some optimizations for more generic use.

# Namesake

> ウットリ, うっとり: When you become enraptured by beauty. In rapture, in ecstasy, captivated. A rapt stare.

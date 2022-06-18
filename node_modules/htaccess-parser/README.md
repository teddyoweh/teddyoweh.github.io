# htaccess-parser

[![npm version](https://badge.fury.io/js/htaccess-parser.svg)](http://badge.fury.io/js/htaccess-parser) 
[![Travis](https://travis-ci.org/rundef/node-htaccess-parser.svg?branch=master)](https://travis-ci.org/rundef/node-htaccess-parser?branch=master) 
[![Coverage Status](https://coveralls.io/repos/github/rundef/node-htaccess-parser/badge.svg?branch=master)](https://coveralls.io/github/rundef/node-htaccess-parser?branch=master)

An .htaccess rewrite rules parser.

Used by the [express-htaccess-middleware](https://npmjs.com/package/express-htaccess-middleware) module to rewrite URLs.

## Installation

> npm i htaccess-parser

## Usage

```javascript
var path = require('path');
var htaccessParser = require('htaccess-parser');

htaccessParser({
  file: path.resolve(__dirname, '.htaccess')
}, 
function(err, parsedFile) {
  console.log(parsedFile);
});
```
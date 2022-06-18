'use strict';

var fs = require('graceful-fs');

var HtaccessFile = require('./HtaccessFile');
var RewriteRule = require('./RewriteRule');
var RewriteCond = require('./RewriteCond');

function Parser(options, cb) {
  if (typeof options.file === 'undefined') {
    throw new Error('options.file not specified');
  }

  this.callback = cb;
  this.rules = [];

  fs.readFile(options.file, function (err, content) {
    if (err) {
      return this.callback(err);
    }


    this.content = content.toString().split('\n').filter(function (line) {
      var trimmed = line.trim();
      return trimmed.length > 0 && trimmed.substring(0, 1) !== '#';
    });

    return this.parseContent();
  }.bind(this));
}


Parser.prototype.parseContent = function () {
  var htaccessFile = new HtaccessFile();

  var RewriteEngineActivated = false;
  var conditions = [];
  var flags = null;

  for (var i = 0; i < this.content.length; i++) {
    var line = this.content[i].trim();
    var parts = line.trim().split(' ').filter(function (part) {
      return part.length > 0;
    });

    var directive = parts[0];

    if (directive === 'RewriteEngine') {
      RewriteEngineActivated = (parts[1].toLowerCase() === 'on');
    } else if (directive === 'RewriteBase') {
      if (RewriteEngineActivated) {
        htaccessFile.RewriteBase = parts[1];
      }
    } else if (directive === 'RewriteCond') {
      if (RewriteEngineActivated) {
        flags = (typeof parts[3] === 'undefined' ? '' : parts[3]);
        conditions.push(new RewriteCond(this.stripQuotes(parts[1]), this.stripQuotes(parts[2]), flags));
      }
    } else if (directive === 'RewriteRule') {
      if (RewriteEngineActivated) {
        flags = (typeof parts[3] === 'undefined' ? '' : parts[3]);
        var rule = new RewriteRule(this.stripQuotes(parts[1]), this.stripQuotes(parts[2]), flags, conditions);

        htaccessFile.RewriteRules.push(rule);

        conditions = [];
      }
    }
  }

  this.callback(null, htaccessFile);
};


Parser.prototype.stripQuotes = function (s) {
  if (/^"([^"]*)"$/.test(s) || /^'([^']*)'$/.test(s)) {
    return s.slice(1, -1);
  }

  return s;
};


module.exports = function (options, cb) {
  return (new Parser(options, cb));
};

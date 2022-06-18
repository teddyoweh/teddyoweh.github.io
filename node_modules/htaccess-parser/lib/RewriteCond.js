'use strict';

function RewriteCond(variable, pattern, flags) {
  this.variable = variable;
  this.pattern = pattern;
  this.flags = flags.replace('[', '').replace(']', '').split(',')
    .map(Function.prototype.call, String.prototype.trim)
    .filter(function (flag) {
      return flag.length > 0;
    });
}

module.exports = RewriteCond;

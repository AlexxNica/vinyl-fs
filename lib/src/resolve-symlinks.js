'use strict';

var through = require('through2');
var fs = require('graceful-fs');

var options = require('../options');

function resolveSymlinks() {

  // A stat property is exposed on file objects as a (wanted) side effect
  function resolveFile(file, enc, callback) {
    var resolveSymlinks = options.get(file, 'resolveSymlinks');

    if (!file.isSymbolic() || !resolveSymlinks) {
      return callback(null, file);
    }

    fs.stat(file.path, onStat);

    function onStat(statErr, stat) {
      if (statErr) {
        return callback(statErr);
      }

      file.stat = stat;
      callback(null, file);
    }
  }

  return through.obj(resolveFile);
}

module.exports = resolveSymlinks;

'use strict';

var fs = require('graceful-fs');
var File = require('vinyl');
var through = require('through2');

function wrapVinyl() {

  function wrapFile(globFile, enc, callback) {

    fs.lstat(globFile.path, onStat);

    function onStat(statErr, stat) {
      if (statErr) {
        return callback(statErr);
      }

      var file = new File(globFile);
      file.stat = stat;

      callback(null, file);
    }
  }

  return through.obj(wrapFile);
}

module.exports = wrapVinyl;

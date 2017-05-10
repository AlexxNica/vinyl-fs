'use strict';

var through = require('through2');

var fo = require('../file-operations');
var options = require('../options');

function makeDirs() {

  function makeFileDirs(file, enc, callback) {
    var dirMode = options.get(file, 'dirMode');

    fo.mkdirp(file.dirname, dirMode, onMkdirp);

    function onMkdirp(mkdirpErr) {
      if (mkdirpErr) {
        return callback(mkdirpErr);
      }
      callback(null, file);
    }
  }

  return through.obj(makeFileDirs);
}

module.exports = makeDirs;

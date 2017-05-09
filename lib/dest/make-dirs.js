'use strict';

var through = require('through2');

var map = require('./map');
var fo = require('../file-operations');

function makeDirs() {

  function makeFileDirs(file, enc, callback) {
    var options = map.get(file);
    // TODO: always have this, even on sourcemap
    var dirMode = options && options.dirMode;

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

'use strict';

var through = require('through2');

var fo = require('../file-operations');

function makeDirs() {

  function makeFileDirs(file, enc, callback) {
    // TODO: always have this, even on sourcemap files
    var dirMode = file._vfsOpts && file._vfsOpts.dirMode;

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

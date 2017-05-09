'use strict';

var through = require('through2');
var sourcemap = require('vinyl-sourcemap');

function sourcemapStream() {

  function saveSourcemap(file, enc, callback) {
    var self = this;

    var options = file._vfsOpts;

    if (!options.sourcemaps) {
      return callback(null, file);
    }

    var srcMapLocation;
    if (typeof options.sourcemaps === 'string') {
      srcMapLocation = options.sourcemaps;
    }

    sourcemap.write(file, srcMapLocation, onWrite);

    function onWrite(sourcemapErr, updatedFile, sourcemapFile) {
      if (sourcemapErr) {
        return callback(sourcemapErr);
      }

      self.push(updatedFile);
      if (sourcemapFile) {
        self.push(sourcemapFile);
      }

      callback();
    }
  }

  return through.obj(saveSourcemap);
}

module.exports = sourcemapStream;

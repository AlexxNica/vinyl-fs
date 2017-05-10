'use strict';

var through = require('through2');

var options = require('../options');

function prepareRead() {

  function normalize(file, enc, callback) {

    var since = options.get(file, 'since');

    // Skip this file if since option is set and current file is too old
    if (file.stat && file.stat.mtime <= since) {
      return callback();
    }

    return callback(null, file);
  }

  return through.obj(normalize);
}

module.exports = prepareRead;

'use strict';

// TODO: currently a copy-paste of prepareWrite but should be customized

var path = require('path');

var fs = require('graceful-fs');
var through = require('through2');

var options = require('../options');

function prepareSymlink() {

  function prepareFile(file, enc, cb) {
    var mode = options.get(file, 'mode');
    var flag = options.get(file, 'flag');
    var cwd = path.resolve(options.get(file, 'cwd'));

    var outFolderPath = options.get(file, 'outFolder');

    var basePath = path.resolve(cwd, outFolderPath);
    var writePath = path.resolve(basePath, file.relative);

    // Wire up new properties
    file.stat = (file.stat || new fs.Stats());
    file.stat.mode = mode;
    file.flag = flag;
    file.cwd = cwd;
    file.base = basePath;
    file.path = writePath;

    cb(null, file);
  }

  return through.obj(prepareFile);
}

module.exports = prepareSymlink;

'use strict';

var path = require('path');

var koalas = require('koalas');
var through = require('through2');
var valueOrFunction = require('value-or-function');

var number = valueOrFunction.number;
var string = valueOrFunction.string;
var boolean = valueOrFunction.boolean;
var stringOrBool = valueOrFunction.bind(null, ['string', 'boolean']);

function add(opt) {

  function addOptions(file, enc, callback) {
    // Never re-use opts
    // TODO: This is probably better to use Map or WeakMap(with the faux-shim)
    file._vfsOpts = {};

    file._vfsOpts.sourcemaps = koalas(stringOrBool(opt.sourcemaps, file), false);
    // TODO: Can this be put on file.stat?
    // TODO: default mode?
    file._vfsOpts.dirMode = number(opt.dirMode, file);

    // TODO: Take out of vinyl-prepare???
    var defaultMode = file.stat ? file.stat.mode : null;
    file._vfsOpts.mode = koalas(number(opt.mode, file), defaultMode);
    file._vfsOpts.flag = koalas(boolean(opt.overwrite, file), true) ? 'w' : 'wx';
    // TODO: maybe path.resolve in vinyl-prepare??
    file._vfsOpts.cwd = path.resolve(koalas(string(opt.cwd, file), process.cwd()));

    callback(null, file);
  }

  return through.obj(addOptions);
}

function remove() {

  function removeOptions(file, enc, callback) {
    // TODO: This is probably better to use Map or WeakMap(with the faux-shim)
    delete file._vfsOpts;

    callback(null, file);
  }

  return through.obj(removeOptions);
}

module.exports = {
  add: add,
  remove: remove,
};

'use strict';

var lead = require('lead');
var koalas = require('koalas');
var pumpify = require('pumpify');
var mkdirpStream = require('fs-mkdirp-stream');
var valueOrFunction = require('value-or-function');

var options = require('../options');

var prepare = require('./prepare');
var sourcemap = require('./sourcemap');
var writeContents = require('./write-contents');

var number = valueOrFunction.number;
var string = valueOrFunction.string;
var boolean = valueOrFunction.boolean;
var stringOrBool = valueOrFunction.bind(null, ['string', 'boolean']);

function dest(outFolder, opt) {
  if (!opt) {
    opt = {};
  }

  if (!outFolder) {
    throw new Error('Invalid output folder');
  }

  function dirpath(file, callback) {
    var dirMode = options.get(file, 'dirMode');

    callback(null, file.dirname, dirMode);
  }

  function resolveOptions(file) {
    // Never re-use opts
    var ourOpts = {};

    ourOpts.sourcemaps = koalas(stringOrBool(opt.sourcemaps, file), false);
    // TODO: default mode?
    ourOpts.dirMode = number(opt.dirMode, file);

    var defaultMode = file.stat ? file.stat.mode : null;
    ourOpts.mode = koalas(number(opt.mode, file), defaultMode);
    ourOpts.flag = koalas(boolean(opt.overwrite, file), true) ? 'w' : 'wx';
    ourOpts.cwd = koalas(string(opt.cwd, file), process.cwd());

    ourOpts.outFolder = string(outFolder, file);
    if (!ourOpts.outFolder) {
      return cb(new Error('Invalid output folder'));
    }

    return ourOpts;
  }

  var saveStream = pumpify.obj(
    options.attach(resolveOptions),
    prepare(),
    sourcemap(),
    mkdirpStream.obj(dirpath),
    writeContents(),
    options.unattach()
  );

  // Sink the output stream to start flowing
  return lead(saveStream);
}

module.exports = dest;

'use strict';

var lead = require('lead');
var pumpify = require('pumpify');
var prepare = require('vinyl-prepare');

var sourcemap = require('./sourcemap');
var makeDirs = require('./make-dirs');
var writeContents = require('./write-contents');
var resolveOptions = require('./resolve-options');

function dest(outFolder, opt) {
  if (!opt) {
    opt = {};
  }

  var saveStream = pumpify.obj(
    prepare.dest(outFolder, opt),
    resolveOptions.add(opt),
    sourcemap(),
    makeDirs(),
    writeContents(),
    resolveOptions.remove()
  );

  // Sink the output stream to start flowing
  return lead(saveStream);
}

module.exports = dest;

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (files) {

  if (files === undefined) {
    return '';
  }

  var toProcess = '';
  if (files instanceof Array) {
    files.forEach(function (f) {
      toProcess += '"' + f + '" ';
    });
    toProcess = toProcess.trim();
  } else {
    toProcess = '"' + files + '"';
  }
  return toProcess;
};
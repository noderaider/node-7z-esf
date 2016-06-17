'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (archive, files) {
  var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var exePath = _ref.exePath;

  var options = _objectWithoutProperties(_ref, ['exePath']);

  return _when2.default.promise(function (resolve, reject, progress) {
    // Convert array of files into a string if needed.
    files = u.files(files);

    // Create a string that can be parsed by `run`.
    var command = exePath ? exePath : /(rar)$/i.test(archive) ? '7z' : '7za';
    command += ' a "' + archive + '" ' + files;

    // Start the command
    u.run(command, options)

    // When a stdout is emitted, parse each line and search for a pattern. When
    // the pattern is found, extract the file (or directory) name from it and
    // pass it to an array. Finally returns this array in the progress function.
    .progress(function (data) {
      var entries = [];
      data.split('\n').forEach(function (line) {
        if (line.substr(0, 13) === 'Compressing  ') {
          entries.push(line.substr(13, line.length).replace(_path2.default.sep, '/'));
        }
      });
      return progress(entries);
    })

    // When all is done resolve the Promise.
    .then(function (args) {
      return resolve(args);
    })

    // Catch the error and pass it to the reject function of the Promise.
    .catch(function (err) {
      return reject(err);
    });
  });
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _when = require('when');

var _when2 = _interopRequireDefault(_when);

var _util = require('../util');

var u = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * Add content to an archive.
 * @promise Add
 * @param archive {string} Path to the archive.
 * @param files {string|array} Files to add.
 * @param options {Object} An object of acceptable options to 7za bin.
 * @resolve {array} Arguments passed to the child-process.
 * @progress {array} Listed files and directories.
 * @reject {Error} The error as issued by 7-Zip.
 */
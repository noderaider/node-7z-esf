'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (command, switches) {
  return _when2.default.promise(function (fulfill, reject, progress) {

    // Parse the command variable. If the command is not a string reject the
    // Promise. Otherwise transform the command into two variables: the command
    // name and the arguments.
    if (typeof command !== 'string') {
      return reject(new Error('Command must be a string'));
    }
    var cmd = command.split(' ')[0];
    var args = [command.split(' ')[1]];

    var exePath = process.env.ES_7Z;
    if (exePath) {
      console.info('using ES_7Z path at ' + exePath);
      cmd = _path2.default.resolve(exePath, cmd);
    }

    // Parse and add command (non-switches parameters) to `args`.
    var regexpCommands = /"((?:\\.|[^"\\])*)"/g;
    var commands = command.match(regexpCommands);
    if (commands) {
      commands.forEach(function (c) {
        c = c.replace(/\//, _path2.default.sep);
        c = c.replace(/\\/, _path2.default.sep);
        c = _path2.default.normalize(c);
        args.push(c);
      });
    }

    // Special treatment for the output switch because it is exposed as a
    // parameter in the API and not as a option. Plus wildcards can be passed.
    var regexpOutput = /-o"((?:\\.|[^"\\])*)"/g;
    var output = command.match(regexpOutput);
    if (output) {
      args.pop();
      var o = output[0];
      o = o.replace(/\//, _path2.default.sep);
      o = o.replace(/\\/, _path2.default.sep);
      o = o.replace(/"/g, '');
      o = _path2.default.normalize(o);
      args.push(o);
    }

    // Add switches to the `args` array.
    var switchesArray = (0, _switches2.default)(switches);
    switchesArray.forEach(function (s) {
      args.push(s);
    });

    // Remove now double quotes. If present in the spawned process 7-Zip will
    // read them as part of the paths (e.g.: create a `"archive.7z"` with
    // quotes in the file-name);
    args.forEach(function (e, i) {
      if (typeof e !== 'string') {
        return;
      }
      if (e.substr(0, 1) !== '-') {
        e = e.replace(/^"/, '');
        e = e.replace(/"$/, '');
        args[i] = e;
      }
    });

    // When an stdout is emitted, parse it. If an error is detected in the body
    // of the stdout create an new error with the 7-Zip error message as the
    // error's message. Otherwise progress with stdout message.
    var err;
    var reg = new RegExp('Error:' + _os2.default.EOL + '?(.*)', 'g');
    var res = {
      cmd: cmd,
      args: args,
      options: { stdio: 'pipe' }
    };
    // console.log('>>', res.cmd, res.args.join(' '));
    var run = (0, _winSpawn2.default)(res.cmd, res.args, res.options);
    run.stdout.on('data', function (data) {
      var res = reg.exec(data.toString());
      if (res) {
        err = new Error(res[1]);
      }
      return progress(data.toString());
    });
    run.on('close', function (code) {
      if (code === 0) {
        return fulfill(args);
      }
      return reject(err, code);
    });
  });
};

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _winSpawn = require('win-spawn');

var _winSpawn2 = _interopRequireDefault(_winSpawn);

var _when = require('when');

var _when2 = _interopRequireDefault(_when);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _switches = require('./switches');

var _switches2 = _interopRequireDefault(_switches);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
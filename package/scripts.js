'use strict';

Object.defineProperty(exports, "__esModule", {
                          value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

/**
 * repackage - https://github.com/noderaider/repackage
 * This script gets compiled by repackage and replaces the scripts node in the
 * package.json. Use linux style setting of environment variables, if on
 * Windows, the scripts will have the commands swapped for Windows versions.
 */

var GH_PAGES_ROOT = 'doc';
var clean = function clean() {
                          var targets = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
                          return 'rimraf ' + targets.map(function (x) {
                                                    return x.join(' ');
                          });
};
var babel = function babel() {
                          var targets = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
                          return targets.map(function (_ref) {
                                                    var _ref2 = _slicedToArray(_ref, 3);

                                                    var src = _ref2[0];
                                                    var dest = _ref2[1];
                                                    var _ref2$ = _ref2[2];
                                                    _ref2$ = _ref2$ === undefined ? {} : _ref2$;
                                                    var _ref2$$isDir = _ref2$.isDir;
                                                    var isDir = _ref2$$isDir === undefined ? true : _ref2$$isDir;
                                                    var _ref2$$watch = _ref2$.watch;
                                                    var watch = _ref2$$watch === undefined ? false : _ref2$$watch;
                                                    return 'babel ' + src + ' ' + (isDir ? '-d' : '-o') + ' ' + dest + (watch ? ' --watch' : '');
                          }).join(' && ');
};

/** START SCRIPT STARTS BUILD WITH WATCHING ENABLED (USEFUL WITH NPM LINK) */

exports.default = function (_ref3) {
                          _objectDestructuringEmpty(_ref3);

                          return { 'start': 'run-p -lnc build-watch test-watch'

                                                    /** CLEAN EVERYTHING PRE BUILD */
                                                    , 'clean': 'run-p clean-lib clean-doc clean-test',
                                                    'clean-lib': 'rimraf lib',
                                                    'clean-doc': 'rimraf doc',
                                                    'clean-test': 'rimraf coverage.lcov'

                                                    /** COMPILE */
                                                    , 'prebuild': 'npm run clean',
                                                    'build': 'babel src -d .',
                                                    'build-watch': 'npm run build -- --watch'

                                                    /** TEST */
                                                    , 'pretest-mocha': 'npm run build',
                                                    'test-mocha': 'mocha --harmony --es_staging --require test/require',
                                                    'test-mocha-md': 'mocha --harmony --es_staging --require test/require --reporter markdown | tee TEST.md',
                                                    'test': 'nyc npm run test-mocha',
                                                    'coverage': 'nyc report --reporter=text-lcov > coverage.lcov && codecov',
                                                    'test-watch': 'npm run test-mocha -- --watch'

                                                    /** MARKDOWN */
                                                    , 'md-create-readme': 'cat md/README.md > README.md',
                                                    'md-insert-spacer': 'cat md/SPACER.md >> README.md',
                                                    'md-insert-rule': 'cat md/RULE.md >> README.md',
                                                    'md-insert-code': 'cat md/CODE.md >> README.md',
                                                    'md-insert-test-header': 'cat md/HEADER_TEST.md >> README.md',
                                                    'md-insert-test-content': 'cat TEST.md >> README.md',
                                                    'md-insert-test': 'run-s md-insert-test-header md-insert-test-content',
                                                    'md-insert-coverage-header': 'cat md/HEADER_COVERAGE.md >> README.md',
                                                    'md-insert-coverage-content': 'cat COVERAGE.md >> README.md',
                                                    'md-insert-coverage': 'run-s md-insert-coverage-header md-insert-code md-insert-coverage-content md-insert-code',
                                                    'md-combine': 'run-s -ln test-mocha-md md-create-readme md-insert-rule md-insert-test'

                                                    /** RELEASE */
                                                    , 'preversion': 'run-s -ln build test',
                                                    'version': 'run-s -ln md-combine',
                                                    'release': 'npm version patch',
                                                    'release:minor': 'npm version minor',
                                                    'release:major': 'npm version major',
                                                    'postversion': 'npm publish',
                                                    'postpublish': 'run-s -ln git-push release-gh-pages'

                                                    /** GH-PAGES RELEASE */
                                                    , 'prerelease-gh-pages': 'npm run doc',
                                                    'release-gh-pages': 'run-s gh-pages-subtree gh-pages-push gh-pages-delete',
                                                    'postrelease-gh-pages': 'run-s -lnc clean-doc git-commit:doc && git push -u origin master --follow-tags'

                                                    /** ESDOC */
                                                    , 'predoc': 'rimraf ' + GH_PAGES_ROOT,
                                                    'doc': 'esdoc -c ./esdoc.json && ncp CNAME ' + GH_PAGES_ROOT + '/CNAME'

                                                    /** GIT COMMANDS */
                                                    , 'gh-pages-subtree': 'git subtree split --prefix ' + GH_PAGES_ROOT + ' -b gh-pages',
                                                    'gh-pages-push': 'git push -f origin gh-pages:gh-pages',
                                                    'gh-pages-delete': 'git branch -D gh-pages',
                                                    'git-add': 'git add -A',
                                                    'git-commit:doc': 'git commit -am doc',
                                                    'git-push': 'git push --follow-tags'

                                                    /** UPGRADE ALL DEPENDENCIES (REQUIRES npm-check-updates INSTALLED GLOBALLY) */
                                                    , 'upgrade': 'ncu -a && npm update'
                          };
};
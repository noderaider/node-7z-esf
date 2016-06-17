# es-7z

**Heavily reworked fork of node-7z by Quentin Rossetti that adds support for configurable 7zip path, much thanks to Quentin for doing all the hard work!**

[![Build Status](https://travis-ci.org/noderaider/es-7z.svg?branch=master)](https://travis-ci.org/noderaider/es-7z)
[![codecov](https://codecov.io/gh/noderaider/es-7z/branch/master/graph/badge.svg)](https://codecov.io/gh/noderaider/es-7z)

[![NPM](https://nodei.co/npm/es-7z.png?stars=true&downloads=true)](https://nodei.co/npm/es-7z/)


## Install

`npm i -S es-7z`

## Differences from [node-7z](https://npmjs.com/packages/node-7z)

* Library is all ES Module syntax, compiled with babel.
* Tests are ES module syntax, compiled on the fly and run by mocha.
* Every method export takes an optional `exePath` option which is expected to be a path to 7z.exe / 7za.exe. If omitted, the default in path will be attempted.


## Usage

```js
import { extractFull7z } from 'es-7z'
import path from 'path'

const exePath = path.resolve(__dirname, '..', 'bin', '7za.exe')

extractFull7z('myArchive.7z', 'destination', { exePath, p: 'myPassword' })

// Equivalent to `on('data', function (files) { // ... });`
.progress(function (files) {
  console.log('Some files are extracted: %s', files);
});

// When all is done
.then(function () {
  console.log('Extracting done!');
});

// On error
.catch(function (err) {
  console.error(err);
});
```

Installation
------------

You must have the `7za` executable available in your PATH or in the same
directory of your `package.json` file OR specify it as option exePath that is
handed into each method.

> On Debian an Ubuntu install the `p7zip-full` package.

> On Windows use the `7za.exe` ([link here](http://netcologne.dl.sourceforge.net/project/sevenzip/7-Zip/9.20/7za920.zip))
> binary.

> On Mac OSX use Homebrew `brew install p7zip`


API
---

> See the [7-Zip documentation](http://sevenzip.sourceforge.jp/chm/cmdline/index.htm)
> for the full list of usages and options (switches).

> The type of the list of files can be either *String* or *Array*.

### Add: `Zip.add`

**Arguments**
 * `archive` Path to the archive you want to create.
 * `files` The file list to add.
 * `options` An object of options (7-Zip switches).

**Progress**
 * `files` A array of all the extracted files *AND* directories. The `/`
   character is used as a path separator on every platform.

**Error**
 * `err` An Error object.


### Delete: `Zip.delete`

**Arguments**
 * `archive` Path to the archive you want to delete files from.
 * `files` The file list to delete.
 * `options` An object of options (7-Zip switches).

**Error**
 * `err` An Error object.


### Extract: `Zip.extract`

**Arguments**
 * `archive` The path to the archive you want to extract.
 * `dest` Where to extract the archive.
 * `options` An object of options.

**Progress**
 * `files` A array of all the extracted files *AND* directories. The `/`
   character is used as a path separator on every platform.

**Error**
 * `err` An Error object.


### Extract with full paths: `Zip.extractFull`

**Arguments**
 * `archive` The path to the archive you want to extract.
 * `dest` Where to extract the archive (creates folders for you).
 * `options` An object of options.

**Progress**
 * `files` A array of all the extracted files *AND* directories. The `/`
   character is used as a path separator on every platform.

**Error**
 * `err` An Error object.


### List contents of archive: `Zip.list`

**Arguments**
 * `archive` The path to the archive you want to analyse.
 * `options` An object of options.

**Progress**
 * `files` A array of objects of all the extracted files *AND* directories.
   The `/` character is used as a path separator on every platform. Object's
   properties are: `date`, `attr`, `size` and `name`.

**Fulfill**
 * `spec` An object of tech spec about the archive. Properties are: `path`,
   `type`, `method`, `physicalSize` and `headersSize` (Some of them may be
   missing with non-7z archives).

**Error**
 * `err` An Error object.


### Test integrity of archive: `Zip.test`

**Arguments**
 * `archive` The path to the archive you want to analyse.
 * `options` An object of options.

**Progress**
 * `files` A array of all the extracted files *AND* directories. The `/`
   character is used as a path separator on every platform.

**Error**
 * `err` An Error object.


### Update: `Zip.update`

**Arguments**
 * `archive` Path to the archive you want to update.
 * `files` The file list to update.
 * `options` An object of options (7-Zip switches).

**Progress**
 * `files` A array of all the extracted files *AND* directories. The `/`
   character is used as a path separator on every platform.

**Error**
 * `err` An Error object.


Advanced usage
--------------

### Compression method

With the `7za` binary compression is made like that:

```bat
# adds *.exe and *.dll files to solid archive archive.7z using LZMA method
# with 2 MB dictionary and BCJ filter.
7z a archive.7z *.exe -m0=BCJ -m1=LZMA:d=21
```

With **es-7z** you can translate it like that:

```js
import { add7z } from 'es-7z'
add7z('archive.7z', '*.exe', {
  m0: '=BCJ',
  m1: '=LZMA:d=21'
})
.then(function () {
  // Do stuff...
});
```

### Add, delete and update multiple files

When adding, deleting or updating archives you can pass either a string or an
array as second parameter (the `files` parameter).

```js
import { delete7z } from 'es-7z'
delete7z('bigArchive.7z', [ 'file1', 'file2' ])
.then(function () {
  // Do stuff...
});
```

### Wildcards

You can extract with wildcards to specify one or more file extensions. To do
this add a `wildcards` attribute to the `options` object. The `wildcard`
attribute takes an *Array* as value. In this array each item is a wildcard.

```js
import { extractFull7z } from 'es-7z'
extractFull7z('archive.zip', 'destination/', {
  wildcards: [ '*.txt', '*.md' ], // extract all text and Markdown files
  r: true // in each subfolder too
})
.progress(function (files) {
  // Do stuff with files...
})
.then(function () {
  // Do stuff...
});
```

Note that the `r` (for recursive) attribute is passed in this example.


***
With :heart: from [quentinrossetti](http://quentinrossetti.me/) and [Cole Chamberlain](https://github.com/cchamberlain)

[david-url]: https://david-dm.org/noderaider/es-7z
[david-image]: http://img.shields.io/david/noderaider/node-7z.svg
[travis-url]: https://travis-ci.org/noderaider/node-7z
[travis-image]: http://img.shields.io/travis/noderaider/node-7z.svg
[codeclimate-url]: https://codeclimate.com/github/noderaider/node-7z
[codeclimate-image]: http://img.shields.io/codeclimate/github/noderaider/node-7z.svg
[npm-url]: https://www.npmjs.org/package/es-7z
[npm-image]: http://img.shields.io/npm/v/es-7z.svg

---


## TEST

**Unit tests output for current release:**

# TOC
   - [add](#add)
   - [delete](#delete)
   - [extract](#extract)
   - [extractFull](#extractfull)
   - [list](#list)
   - [test](#test)
   - [update](#update)
   - [zip](#zip)
   - [Utility: `files`](#utility-files)
   - [Utility: `run`](#utility-run)
   - [Utility: `switches`](#utility-switches)
<a name=""></a>
 
<a name="add"></a>
# add
should return an error on 7z error.

```js
(0, _add2.default)('.tmp/test/addnot.7z', '.tmp/test/nothere', { '???': true }).catch(function (err) {
  (0, _chai.expect)(err).to.be.an.instanceof(Error);
  done();
});
```

should return entries on progress.

```js
(0, _add2.default)('.tmp/test/add.zip', '*.md').progress(function (entries) {
  (0, _chai.expect)(entries.length).to.be.at.least(1);
  done();
});
```

<a name="delete"></a>
# delete
should return an error on 7z error.

```js
(0, _delete2.default)('.tmp/test/addnot.7z', '.tmp/test/nothere', { '???': true }).catch(function (err) {
  (0, _chai.expect)(err).to.be.an.instanceof(Error);
  done();
});
```

should return on fulfillment.

```js
_fsExtra2.default.copySync('test/zip.7z', '.tmp/test/copy.7z');
(0, _delete2.default)('.tmp/test/copy.7z', '*.txt').then(function () {
  done();
});
```

should accept array as source.

```js
_fsExtra2.default.copySync('test/zip.7z', '.tmp/d.7z');
(0, _delete2.default)('.tmp/d.7z', ['zip/file0.txt', 'zip/file1.txt']).then(function () {
  (0, _extractFull2.default)('.tmp/d.7z', '.tmp/d').then(function () {
    var files = _fsExtra2.default.readdirSync('.tmp/d/zip');
    (0, _chai.expect)(files).not.to.contain('file0.txt');
    (0, _chai.expect)(files).not.to.contain('file1.txt');
    (0, _chai.expect)(files).to.contain('file2.txt');
    (0, _chai.expect)(files).to.contain('folder');
    done();
  });
});
```

<a name="extract"></a>
# extract
should return an error on 7z error.

```js
(0, _extract2.default)('test/nothere.7z', '.tmp/test').catch(function (err) {
  (0, _chai.expect)(err).to.be.an.instanceof(Error);
  done();
});
```

should return an error on output duplticate.

```js
(0, _extract2.default)('test/zip.7z', '.tmp/test', { o: '.tmp/test/duplicate' }).catch(function (err) {
  (0, _chai.expect)(err).to.be.an.instanceof(Error);
  done();
});
```

should return entries on progress.

```js
(0, _extract2.default)('test/zip.7z', '.tmp/test').progress(function (entries) {
  (0, _chai.expect)(entries.length).to.be.at.least(1);
  done();
});
```

should extract on the right path.

```js
(0, _extract2.default)('test/zip.7z', '.tmp/test').then(function () {
  (0, _chai.expect)(_fsExtra2.default.existsSync('.tmp/test/file0.txt')).to.be.eql(true);
  (0, _chai.expect)(_fsExtra2.default.existsSync('.tmp/test/file1.txt')).to.be.eql(true);
  (0, _chai.expect)(_fsExtra2.default.existsSync('.tmp/test/file2.txt')).to.be.eql(true);
  (0, _chai.expect)(_fsExtra2.default.existsSync('.tmp/test/file3.txt')).to.be.eql(true);
  done();
});
```

<a name="extractfull"></a>
# extractFull
should return an error on 7z error.

```js
(0, _extractFull2.default)('test/nothere.7z', '.tmp/test').catch(function (err) {
  (0, _chai.expect)(err).to.be.an.instanceof(Error);
  done();
});
```

should return an error on output duplicate.

```js
(0, _extractFull2.default)('test/zip.7z', '.tmp/test', { o: '.tmp/test/duplicate' }).catch(function (err) {
  (0, _chai.expect)(err).to.be.an.instanceof(Error);
  done();
});
```

should return entries on progress.

```js
(0, _extractFull2.default)('test/zip.7z', '.tmp/test').progress(function (entries) {
  (0, _chai.expect)(entries.length).to.be.at.least(1);
  done();
});
```

should extract on the right path.

```js
(0, _extractFull2.default)('test/zip.7z', '.tmp/test').then(function () {
  (0, _chai.expect)(_fsExtra2.default.existsSync('.tmp/test/zip')).to.be.eql(true);
  done();
});
```

should extract only given wilcards.

```js
(0, _extractFull2.default)('test/wildcards.zip', '.tmp/test/', { wildcards: ['*.txt'], r: true }).progress(function (files) {
  files.forEach(function (f) {
    (0, _chai.expect)(f).to.include('.txt');
  });
}).then(function () {
  done();
}).catch(function (err) {
  done(err);
});
```

should work with spaces in archive name.

```js
(0, _extractFull2.default)('test/zip spaces test.7z', '.tmp/test spaces one').then(function () {
  (0, _chai.expect)(_fsExtra2.default.existsSync('.tmp/test spaces one/zip')).to.be.eql(true);
  done();
});
```

should work with spaces in destination.

```js
(0, _extractFull2.default)('test/zip.7z', '.tmp/test spaces agai n').then(function () {
  (0, _chai.expect)(_fsExtra2.default.existsSync('.tmp/test spaces agai n/zip')).to.be.eql(true);
  done();
});
```

should work with spaces in both source and destination.

```js
/*jshint maxlen:false*/
_fsExtra2.default.copySync('test/zip.7z', '.tmp/test/Folder From/Folder A/Folder B/Folder C/zip file.7z');
(0, _extractFull2.default)('.tmp/test/Folder From/Folder A/Folder B/Folder C/zip file.7z', '.tmp/test/Folder To/Folder D/Folder E/Folder F').then(function () {
  (0, _chai.expect)(_fsExtra2.default.existsSync('.tmp/test/Folder To/Folder D/Folder E/Folder F/zip')).to.be.eql(true);
  done();
});
```

<a name="list"></a>
# list
should return an error on 7z error.

```js
(0, _list2.default)('test/nothere.7z').catch(function (err) {
  (0, _chai.expect)(err).to.be.an.instanceof(Error);
  done();
});
```

should return an tech spec on fulfill.

```js
(0, _list2.default)('test/zip.7z', { r: true }).then(function (spec) {
  (0, _chai.expect)(spec).to.have.property('path');
  (0, _chai.expect)(spec).to.have.property('type');
  (0, _chai.expect)(spec).to.have.property('method');
  (0, _chai.expect)(spec).to.have.property('physicalSize');
  (0, _chai.expect)(spec).to.have.property('headersSize');
  done();
});
```

should return valid entries on progress.

```js
(0, _list2.default)('test/zip.zip').progress(function (entries) {
  (0, _chai.expect)(entries.length).to.be.at.least(1);
  (0, _chai.expect)(entries[0].date).to.be.an.instanceof(Date);
  (0, _chai.expect)(entries[0].attr.length).to.eql(5);
  (0, _chai.expect)(entries[0].name).to.be.a('string');
  (0, _chai.expect)(entries[0].name).to.not.contain('\\');
  done();
});
```

<a name="test"></a>
# test
should return an error on 7z error.

```js
(0, _test2.default)('test/nothere.7z').catch(function (err) {
  (0, _chai.expect)(err).to.be.an.instanceof(Error);
  done();
});
```

should return entries on progress.

```js
(0, _test2.default)('test/zip.7z', { r: true }).progress(function (entries) {
  (0, _chai.expect)(entries.length).to.be.at.least(1);
  done();
});
```

<a name="update"></a>
# update
should return an error on 7z error.

```js
(0, _update2.default)('.tmp/test/addnot.7z', '.tmp/test/nothere', { '???': true }).catch(function (err) {
  (0, _chai.expect)(err).to.be.an.instanceof(Error);
  done();
});
```

should return entries on progress.

```js
_fsExtra2.default.copySync('test/zip.7z', '.tmp/test/update.7z');
(0, _update2.default)('.tmp/test/update.7z', '*.md', { w: 'test' }).progress(function (entries) {
  (0, _chai.expect)(entries.length).to.be.at.least(1);
  done();
});
```

should return on fulfillment.

```js
_fsExtra2.default.copySync('test/zip.7z', '.tmp/test/update.7z');
(0, _update2.default)('.tmp/test/update.7z', '*.txt').then(function () {
  done();
});
```

<a name="zip"></a>
# zip
should exist.

```js
return should.exist(zip);
```

should be an object.

```js
return zip.should.be.an('object');
```

should respond to 7-Zip commands as methods.

```js
zip.should.respondTo('add7z');
zip.should.respondTo('delete7z');
zip.should.respondTo('extract7z');
zip.should.respondTo('extractFull7z');
zip.should.respondTo('list7z');
zip.should.respondTo('test7z');
zip.should.respondTo('update7z');
```

<a name="utility-files"></a>
# Utility: `files`
should error on invalid files.

```js
var r = (0, _files2.default)();
expect(r).to.eql('');
```

should works with strings.

```js
var r = (0, _files2.default)('hello test');
expect(r).to.eql('"hello test"');
```

should works with arrays.

```js
var r = (0, _files2.default)(['hello test', 'hello world']);
expect(r).to.eql('"hello test" "hello world"');
```

<a name="utility-run"></a>
# Utility: `run`
should return an error with invalid command type.

```js
(0, _run2.default)(0).catch(function (err) {
  expect(err.message).to.eql('Command must be a string');
  done();
});
```

should return an error on when 7z gets one.

```js
(0, _run2.default)('7za "???"').catch(function (err) {
  expect(err.message).to.eql('Incorrect command line');
  done();
});
```

should return an stdout on progress.

```js
(0, _run2.default)('7za', { h: true }).progress(function (data) {
  expect(data).to.be.a('string');
}).then(function () {
  done();
});
```

should correctly parse complex commands.

```js
(0, _run2.default)('7za a ".tmp/test/archive.7z" "*.exe" "*.dll"', {
  m0: '=BCJ',
  m1: '=LZMA:d=21'
}).then(function (res) {
  expect(res).to.contain('a');
  expect(res).to.contain('.tmp' + sep + 'test' + sep + 'archive.7z');
  expect(res).to.contain('*.exe');
  expect(res).to.contain('*.dll');
  expect(res).to.contain('-m0=BCJ');
  expect(res).to.contain('-m1=LZMA:d=21');
  expect(res).to.contain('-ssc');
  expect(res).to.contain('-y');
  done();
});
```

should correctly parse complex commands with spaces.

```js
(0, _run2.default)('7za a ".tmp/Folder A/Folder B\\archive.7z" "*.exe" "*.dll"', {
  m0: '=BCJ',
  m1: '=LZMA:d=21',
  p: 'My mhjls/\\c $^é5°'
}).then(function (res) {
  expect(res).to.contain('a');
  /*jshint maxlen:false*/
  expect(res).to.contain('.tmp' + sep + 'Folder A' + sep + 'Folder B' + sep + 'archive.7z');
  expect(res).to.contain('*.exe');
  expect(res).to.contain('*.dll');
  expect(res).to.contain('-m0=BCJ');
  expect(res).to.contain('-m1=LZMA:d=21');
  expect(res).to.contain('-p"My mhjls/\\c $^é5°"');
  expect(res).to.contain('-ssc');
  expect(res).to.contain('-y');
  done();
});
```

<a name="utility-switches"></a>
# Utility: `switches`
should return deflaut flags with no args.

```js
expect((0, _switches2.default)({})).to.contain('-ssc');
expect((0, _switches2.default)({})).to.contain('-y');
```

should return -ssc with flag { ssc: true }.

```js
expect((0, _switches2.default)({ ssc: true })).to.contain('-ssc');
expect((0, _switches2.default)({ ssc: true })).to.contain('-y');
```

should return -ssc- with flag { ssc: false }.

```js
expect((0, _switches2.default)({ ssc: false })).to.contain('-ssc-');
```

should return non default booleans when specified.

```js
var r = (0, _switches2.default)({
  so: true,
  spl: true,
  ssw: true,
  y: false
});
expect(r).to.contain('-so');
expect(r).to.contain('-spl');
expect(r).to.contain('-ssc');
expect(r).to.contain('-ssw');
expect(r).not.to.contain('-y');
```

should return complex values when needed.

```js
var r = (0, _switches2.default)({
  ssc: true,
  ssw: true,
  mx0: true
});
expect(r).to.contain('-ssc');
expect(r).to.contain('-ssw');
expect(r).to.contain('-mx0');
expect(r).to.contain('-y');
```

should return complex values with spaces and quotes.

```js
var r = (0, _switches2.default)({
  ssc: true,
  ssw: true,
  m0: '=BCJ',
  m1: '=LZMA:d=21',
  p: 'My Super Pasw,àù£*'
});
expect(r).to.contain('-ssc');
expect(r).to.contain('-ssw');
expect(r).to.contain('-m0=BCJ');
expect(r).to.contain('-m1=LZMA:d=21');
expect(r).to.contain('-p"My Super Pasw,àù£*"');
expect(r).to.contain('-y');
```


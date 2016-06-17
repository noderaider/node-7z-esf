# es-7z

**Fork of node-7z, converted to ES modules and upgraded to support configurable path to 7-zip executable.**

[![Build Status](https://travis-ci.org/noderaider/es-7z.svg?branch=master)](https://travis-ci.org/noderaider/es-7z)
[![codecov](https://codecov.io/gh/noderaider/es-7z/branch/master/graph/badge.svg)](https://codecov.io/gh/noderaider/es-7z)

[![NPM](https://nodei.co/npm/es-7z.png?stars=true&downloads=true)](https://nodei.co/npm/es-7z/)


## Install

`npm i -s es-7z`


## node-7z original readme

[![Dependencies Status][david-image]][david-url] [![Build Status][travis-image]][travis-url] [![Code coverage][coveralls-image]][coveralls-url] [![Code quality][codeclimate-image]][codeclimate-url] [![Release][npm-image]][npm-url]

> A Node.js wrapper for 7-Zip, originally developed by @quentinrossetti and forked for the purpose of setting path to 7zip executable.

Copy of original [README](https://github.com/quentinrossetti/node-7z/blob/master/README.md):
Usage
-----

I chose to use *Promises* in this library. API is consistent with standard use:

```js
var Zip = require('node-7z'); // Name the class as you want!
var myTask = new Zip();
myTask.extractFull('myArchive.7z', 'destination', { p: 'myPassword' })

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
directory of your `package.json` file.

> On Debian an Ubuntu install the `p7zip-full` package.

> On Windows use the `7za.exe` ([link here](http://netcologne.dl.sourceforge.net/project/sevenzip/7-Zip/9.20/7za920.zip))
> binary.

> On Mac OSX use Homebrew `brew install p7zip`

```
npm install --save node-7z
```

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

With **node-7z** you can translate it like that:

```js
var archive = new Zip();
archive.add('archive.7z', '*.exe', {
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
var archive = new Zip();
archive.delete('bigArchive.7z', [ 'file1', 'file2' ])
.then(function () {
  // Do stuff...
});
```

### Wildcards

You can extract with wildcards to specify one or more file extensions. To do
this add a `wildcards` attribute to the `options` object. The `wildcard`
attribute takes an *Array* as value. In this array each item is a wildcard.

```js
var archive = new Zip();
archive.extractFull('archive.zip', 'destination/', {
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
With :heart: from [quentinrossetti](http://quentinrossetti.me/)

[david-url]: https://david-dm.org/quentinrossetti/node-7z
[david-image]: http://img.shields.io/david/quentinrossetti/node-7z.svg
[travis-url]: https://travis-ci.org/quentinrossetti/node-7z
[travis-image]: http://img.shields.io/travis/quentinrossetti/node-7z.svg
[codeclimate-url]: https://codeclimate.com/github/quentinrossetti/node-7z
[codeclimate-image]: http://img.shields.io/codeclimate/github/quentinrossetti/node-7z.svg
[coveralls-url]: https://coveralls.io/r/quentinrossetti/node-7z
[coveralls-image]: http://img.shields.io/coveralls/quentinrossetti/node-7z.svg
[npm-url]: https://www.npmjs.org/package/node-7z
[npm-image]: http://img.shields.io/npm/v/node-7z.svg

---


## TEST

**Unit tests output for current release:**

# TOC
   - [Method: `Zip.add`](#method-zipadd)
   - [Method: `Zip.delete`](#method-zipdelete)
   - [Method: `Zip.extract`](#method-zipextract)
   - [Method: `Zip.extractFull`](#method-zipextractfull)
   - [Method: `Zip.list`](#method-ziplist)
   - [Method: `Zip.test`](#method-ziptest)
   - [Method: `Zip.update`](#method-zipupdate)
   - [Class: `Zip`](#class-zip)
   - [Utility: `files`](#utility-files)
   - [Utility: `run`](#utility-run)
   - [Utility: `switches`](#utility-switches)
<a name=""></a>
 
<a name="method-zipadd"></a>
# Method: `Zip.add`
should return an error on 7z error.

```js
add('.tmp/test/addnot.7z', '.tmp/test/nothere', { '???': true }).catch(function (err) {
  expect(err).to.be.an.instanceof(Error);
  done();
});
```

should return entries on progress.

```js
add('.tmp/test/add.zip', '*.md').progress(function (entries) {
  expect(entries.length).to.be.at.least(1);
  done();
});
```

<a name="method-zipdelete"></a>
# Method: `Zip.delete`
should return an error on 7z error.

```js
del('.tmp/test/addnot.7z', '.tmp/test/nothere', { '???': true }).catch(function (err) {
  expect(err).to.be.an.instanceof(Error);
  done();
});
```

should return on fulfillment.

```js
fs.copySync('test/zip.7z', '.tmp/test/copy.7z');
del('.tmp/test/copy.7z', '*.txt').then(function () {
  done();
});
```

should accept array as source.

```js
fs.copySync('test/zip.7z', '.tmp/d.7z');
del('.tmp/d.7z', ['zip/file0.txt', 'zip/file1.txt']).then(function () {
  extract('.tmp/d.7z', '.tmp/d').then(function () {
    var files = fs.readdirSync('.tmp/d/zip');
    expect(files).not.to.contain('file0.txt');
    expect(files).not.to.contain('file1.txt');
    expect(files).to.contain('file2.txt');
    expect(files).to.contain('folder');
    done();
  });
});
```

<a name="method-zipextract"></a>
# Method: `Zip.extract`
should return an error on 7z error.

```js
extract('test/nothere.7z', '.tmp/test').catch(function (err) {
  expect(err).to.be.an.instanceof(Error);
  done();
});
```

should return an error on output duplticate.

```js
extract('test/zip.7z', '.tmp/test', { o: '.tmp/test/duplicate' }).catch(function (err) {
  expect(err).to.be.an.instanceof(Error);
  done();
});
```

should return entries on progress.

```js
extract('test/zip.7z', '.tmp/test').progress(function (entries) {
  expect(entries.length).to.be.at.least(1);
  done();
});
```

should extract on the right path.

```js
extract('test/zip.7z', '.tmp/test').then(function () {
  expect(fs.existsSync('.tmp/test/file0.txt')).to.be.eql(true);
  expect(fs.existsSync('.tmp/test/file1.txt')).to.be.eql(true);
  expect(fs.existsSync('.tmp/test/file2.txt')).to.be.eql(true);
  expect(fs.existsSync('.tmp/test/file3.txt')).to.be.eql(true);
  done();
});
```

<a name="method-zipextractfull"></a>
# Method: `Zip.extractFull`
should return an error on 7z error.

```js
extractFull('test/nothere.7z', '.tmp/test').catch(function (err) {
  expect(err).to.be.an.instanceof(Error);
  done();
});
```

should return an error on output duplicate.

```js
extractFull('test/zip.7z', '.tmp/test', { o: '.tmp/test/duplicate' }).catch(function (err) {
  expect(err).to.be.an.instanceof(Error);
  done();
});
```

should return entries on progress.

```js
extractFull('test/zip.7z', '.tmp/test').progress(function (entries) {
  expect(entries.length).to.be.at.least(1);
  done();
});
```

should extract on the right path.

```js
extractFull('test/zip.7z', '.tmp/test').then(function () {
  expect(fs.existsSync('.tmp/test/zip')).to.be.eql(true);
  done();
});
```

should extract only given wilcards.

```js
extractFull('test/wildcards.zip', '.tmp/test/', { wildcards: ['*.txt'], r: true }).progress(function (files) {
  files.forEach(function (f) {
    expect(f).to.include('.txt');
  });
}).then(function () {
  done();
}).catch(function (err) {
  done(err);
});
```

should work with spaces in archive name.

```js
extractFull('test/zip spaces test.7z', '.tmp/test spaces one').then(function () {
  expect(fs.existsSync('.tmp/test spaces one/zip')).to.be.eql(true);
  done();
});
```

should work with spaces in destination.

```js
extractFull('test/zip.7z', '.tmp/test spaces agai n').then(function () {
  expect(fs.existsSync('.tmp/test spaces agai n/zip')).to.be.eql(true);
  done();
});
```

should work with spaces in both source and destination.

```js
/*jshint maxlen:false*/
fs.copySync('test/zip.7z', '.tmp/test/Folder From/Folder A/Folder B/Folder C/zip file.7z');
extractFull('.tmp/test/Folder From/Folder A/Folder B/Folder C/zip file.7z', '.tmp/test/Folder To/Folder D/Folder E/Folder F').then(function () {
  expect(fs.existsSync('.tmp/test/Folder To/Folder D/Folder E/Folder F/zip')).to.be.eql(true);
  done();
});
```

<a name="method-ziplist"></a>
# Method: `Zip.list`
should return an error on 7z error.

```js
list('test/nothere.7z').catch(function (err) {
  expect(err).to.be.an.instanceof(Error);
  done();
});
```

should return an tech spec on fulfill.

```js
list('test/zip.7z', { r: true }).then(function (spec) {
  expect(spec).to.have.property('path');
  expect(spec).to.have.property('type');
  expect(spec).to.have.property('method');
  expect(spec).to.have.property('physicalSize');
  expect(spec).to.have.property('headersSize');
  done();
});
```

should return valid entries on progress.

```js
list('test/zip.zip').progress(function (entries) {
  expect(entries.length).to.be.at.least(1);
  expect(entries[0].date).to.be.an.instanceof(Date);
  expect(entries[0].attr.length).to.eql(5);
  expect(entries[0].name).to.be.a('string');
  expect(entries[0].name).to.not.contain('\\');
  done();
});
```

<a name="method-ziptest"></a>
# Method: `Zip.test`
should return an error on 7z error.

```js
test('test/nothere.7z').catch(function (err) {
  expect(err).to.be.an.instanceof(Error);
  done();
});
```

should return entries on progress.

```js
test('test/zip.7z', { r: true }).progress(function (entries) {
  expect(entries.length).to.be.at.least(1);
  done();
});
```

<a name="method-zipupdate"></a>
# Method: `Zip.update`
should return an error on 7z error.

```js
update('.tmp/test/addnot.7z', '.tmp/test/nothere', { '???': true }).catch(function (err) {
  expect(err).to.be.an.instanceof(Error);
  done();
});
```

should return entries on progress.

```js
fs.copySync('test/zip.7z', '.tmp/test/update.7z');
update('.tmp/test/update.7z', '*.md', { w: 'test' }).progress(function (entries) {
  expect(entries.length).to.be.at.least(1);
  done();
});
```

should return on fulfillment.

```js
fs.copySync('test/zip.7z', '.tmp/test/update.7z');
update('.tmp/test/update.7z', '*.txt').then(function () {
  done();
});
```

<a name="class-zip"></a>
# Class: `Zip`
should be a class.

```js
var zip = new Zip();
expect(zip).to.be.an.instanceof(Zip);
```

should respond to 7-Zip commands as methods.

```js
var zip = new Zip();
expect(zip).to.respondTo('add');
expect(zip).to.respondTo('delete');
expect(zip).to.respondTo('extract');
expect(zip).to.respondTo('extractFull');
expect(zip).to.respondTo('list');
expect(zip).to.respondTo('test');
expect(zip).to.respondTo('update');
```

<a name="utility-files"></a>
# Utility: `files`
should error on invalid files.

```js
var r = files();
expect(r).to.eql('');
```

should works with strings.

```js
var r = files('hello test');
expect(r).to.eql('"hello test"');
```

should works with arrays.

```js
var r = files(['hello test', 'hello world']);
expect(r).to.eql('"hello test" "hello world"');
```

<a name="utility-run"></a>
# Utility: `run`
should return an error with invalid command type.

```js
run(0).catch(function (err) {
  expect(err.message).to.eql('Command must be a string');
  done();
});
```

should return an error on when 7z gets one.

```js
run('7za "???"').catch(function (err) {
  expect(err.message).to.eql('Incorrect command line');
  done();
});
```

should return an stdout on progress.

```js
run('7za', { h: true }).progress(function (data) {
  expect(data).to.be.a('string');
}).then(function () {
  done();
});
```

should correctly parse complex commands.

```js
run('7za a ".tmp/test/archive.7z" "*.exe" "*.dll"', {
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
run('7za a ".tmp/Folder A/Folder B\\archive.7z" "*.exe" "*.dll"', {
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
expect(switches({})).to.contain('-ssc');
expect(switches({})).to.contain('-y');
```

should return -ssc with flag { ssc: true }.

```js
expect(switches({ ssc: true })).to.contain('-ssc');
expect(switches({ ssc: true })).to.contain('-y');
```

should return -ssc- with flag { ssc: false }.

```js
expect(switches({ ssc: false })).to.contain('-ssc-');
```

should return non default booleans when specified.

```js
var r = switches({
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
var r = switches({
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
var r = switches({
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


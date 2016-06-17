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

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


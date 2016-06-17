import * as zip from '../../lib'
const should = require('chai').should()

describe('zip', function () {
  it('should exist', () => should.exist(zip))
  it('should be an object', () => zip.should.be.an('object'))

  it('should respond to 7-Zip commands as methods', function () {
    zip.should.respondTo('add7z')
    zip.should.respondTo('delete7z')
    zip.should.respondTo('extract7z')
    zip.should.respondTo('extractFull7z')
    zip.should.respondTo('list7z')
    zip.should.respondTo('test7z')
    zip.should.respondTo('update7z')
  })
})

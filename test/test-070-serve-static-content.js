var utils = require('./utils');
var expect = require('chai').expect;
var trycatch = require('trycatch');
var supertest = require('supertest');
var fs = require('fs');
var path = require('path');

describe('The Express Server', function () {
  utils.server();

  var filename;
  beforeEach(function (done) {
    var randomNumber = Math.floor(Math.random() * 100);
    filename = 'test-file-' + randomNumber + '.html';
    var filePath = path.resolve(__dirname, '../public/', filename);
    fs.writeFile(filePath, 'Hello World!', done);
  });

  afterEach(function (done) {
    var filePath = path.resolve(__dirname, '../public/', filename);
    filename = null;
    fs.unlink(filePath, done);
  });

  it('serves the static content from /public', function (done) {
    trycatch(function () {
      supertest('http://localhost:8081')
        .get('/' + filename)
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .expect('Hello World!')
        .end(done)
    }, done);
  })
});




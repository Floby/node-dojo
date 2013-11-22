var App = require('../');
var expect = require('chai').expect;
var trycatch = require('trycatch');
var supertest = require('supertest');

describe('My app', function () {
  var server;
  before(function (done) {
    server = new App({
      port: 8081
    });
    server.start(done);
  });
  
  after(function (done) {
    server.stop(done);
    server = null;
  });

  it('sets a custom header', function (done) {
    trycatch(function () {
      supertest('http://localhost:8081')
        .get('/')
        .expect('X-Custom-Header', 'My own thing')
        .end(done)
    }, done)
  });
});




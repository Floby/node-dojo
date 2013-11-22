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

  it('is an express app', function (done) {
    trycatch(function () {
      supertest('http://localhost:8081/')
        .get('')
        .expect('X-Powered-By', 'Express')
        .end(done)
    }, done)
  });
});



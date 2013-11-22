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

  it('responds "hello world" on GET /greet', function (done) {
    trycatch(function () {
      supertest('http://localhost:8081/')
        .get('/greet')
        .expect(200)
        .expect('Content-Type', /text\/plain/)
        .expect(/Hello World!/i)
        .end(done)
    }, done)
  });
});

var utils = require('./utils');
var expect = require('chai').expect;
var trycatch = require('trycatch');
var supertest = require('supertest');

describe('My app', function () {
  utils.server();

  it('sets a custom header', function (done) {
    trycatch(function () {
      supertest('http://localhost:8081')
        .get('/')
        .expect('X-Custom-Header', 'My own thing')
        .end(done)
    }, done)
  });
});




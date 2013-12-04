var utils = require('./utils');
var expect = require('chai').expect;
var trycatch = require('trycatch');
var supertest = require('supertest');

describe('My app', function () {
  utils.server();

  it('is an express app', function (done) {
    trycatch(function () {
      supertest('http://localhost:8081/')
        .get('')
        .expect('X-Powered-By', 'Express')
        .end(done)
    }, done)
  });
});



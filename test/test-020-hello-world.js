var utils = require('./utils');
var expect = require('chai').expect;
var trycatch = require('trycatch');
var supertest = require('supertest');

describe('My app', function () {
  utils.server();
  it('responds with a 404 on GET /i-do-no-exist', function (done) {
    trycatch(function () {
      supertest('http://localhost:8081/')
        .get('i-do-no-exist')
        .expect(404)
        .end(done)
    }, done)
  });
});


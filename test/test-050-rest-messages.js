var utils = require('./utils');
var expect = require('chai').expect;
var trycatch = require('trycatch');
var supertest = require('supertest');

describe('The /messages endpoint', function () {
  utils.server();

  describe('When there are no messages yet', function () {
    it('returns an empty array', function (done) {
      supertest('http://localhost:8081')
        .get('/messages')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect([])
        .end(done)
    });
  });

  it('records new messages on POST', function (done) {
    trycatch(function () {
      supertest('http://localhost:8081')
        .post('/messages')
        .type('json')
        .send({author:'bobby', body: 'Hello World!'})
        .expect(201)
        .end(done)
    }, done);
  });

  describe('having been posted a new message', function () {
    beforeEach(function (done) {
      supertest('http://localhost:8081')
        .post('/messages')
        .type('json')
        .send({author:'bobby', body: 'Hello World!'})
        .expect(201)
        .end(done)
    });

    it('makes it available in the GET /messages list', function (done) {
      expected = [{author: 'bobby', body: 'Hello World!'}];
      supertest('http://localhost:8081')
        .get('/messages')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect(expected)
        .end(done)
    });
  });

});


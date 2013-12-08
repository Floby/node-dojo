var utils = require('./utils');
var expect = require('chai').expect;
var trycatch = require('trycatch');
var supertest = require('supertest');
var request = require('request');
var appendOnly = require('append-only');

describe('The synchronization system', function () {
  utils.server();

  it('should be a long-lived connection on endpoint /sync', function (done) {
    trycatch(function () {
      var syncStream = request.post('http://localhost:8081/sync');
      var list = appendOnly();
      syncStream.pipe(list.createStream()).pipe(syncStream);
      list.on('item', function(item) {
        expect(item).to.be.an('object');
        expect(item.author).to.equal('bobby');
        expect(item.body).to.equal('Hello');
        syncStream.end();
        done();
      });

      supertest('http://localhost:8081')
        .post('/messages')
        .send({author: 'bobby', body: 'Hello'})
        .end(function () {})

    }, done)
  })
});


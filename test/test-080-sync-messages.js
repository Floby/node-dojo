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
  });

  it('appends messages from sync to its /messages resource', function (done) {
    trycatch(function () {
      var syncStream = request.post('http://localhost:8081/sync');
      var list = appendOnly();
      syncStream.pipe(list.createStream()).pipe(syncStream);

      list.push({author:'bobby', body: 'bye'});

      setTimeout(function () {
        syncStream.end();
        supertest('http://localhost:8081')
          .get('/messages')
          .expect([{author:'bobby', body: 'bye'}])
          .end(done)
      }, 20);

    }, done)
  });
  
  it('notifies the client of the websocket stream of newly synced messages', function (done) {
    trycatch(function () {
      var ws = utils.sockjs('ws://localhost:8081/new-messages');
      ws.on('message', onMessage);

      var syncStream = request.post('http://localhost:8081/sync');
      var list = appendOnly();
      syncStream.pipe(list.createStream()).pipe(syncStream);

      list.push({author:'bobby', body: 'good morning'});

      function onMessage (message) {
        syncStream.end();
        message = JSON.parse(message);
        expect(message).to.be.an('object');
        expect(message.event).to.equal('newMessage');
        expect(message.author).to.equal('bobby');
        expect(message.body).to.equal('good morning');
        done();
      };
    }, done);
  });
});


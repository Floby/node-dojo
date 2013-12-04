var utils = require('./utils');
var expect = require('chai').expect;
var trycatch = require('trycatch');
var supertest = require('supertest');

describe('The SockJS endpoint', function () {
  utils.server();

  it('pushes each new message', function (done) {
    trycatch(function () {
      var ws = utils.sockjs('ws://localhost:8081/new-messages');
      ws.on('message', onMessage);

      supertest('http://localhost:8081')
        .post('/messages')
        .send({author: 'bobby', body: 'Hello World!'})
        .end(function () {});

      function onMessage (message) {
        message = JSON.parse(message);
        expect(message).to.be.an('object');
        expect(message.event).to.equal('newMessage');
        expect(message.author).to.equal('bobby');
        expect(message.body).to.equal('Hello World!');
        done();
      };
    }, done);
  })
});



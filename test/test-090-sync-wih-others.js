var utils = require('./utils');
var expect = require('chai').expect;
var trycatch = require('trycatch');
var supertest = require('supertest');

describe('Two app instances', function () {
  var s1 = utils.server({port: 8081});
  var s2 = utils.server({port: 8082});

  it('can synchronize together when calling startSync(port, host)', function (done) {
    trycatch(function () {
      s1.server.startSync(8082, 'localhost');
      supertest('http://localhost:8081')
        .post('/messages')
        .send({author: 'toto', body: 'A'})
        .end(function () {
          supertest('http://localhost:8082')
            .post('/messages')
            .send({author: 'tata', body: 'B'})
            .end(function () {
              setTimeout(checkMessages, 50)
            })
        });

      var expected = [
        {author: 'toto', body: 'A'},
        {author: 'tata', body: 'B'}
      ]
      function checkMessages () {
        supertest('http://localhost:8081')
          .get('/messages')
          .expect(expected)
          .end(function (err) {
            if(err) return done(err);
            supertest('http://localhost:8082')
              .get('/messages')
              .expect(expected)
              .end(done)
          })
      }
    }, done)
  });
})


var utils = require('./utils');
var expect = require('chai').expect;
var trycatch = require('trycatch');
var supertest = require('supertest');
var net = require('net');

describe('The synchronization system', function () {
  utils.server({
    syncPort: 8585
  });

  it('Should allow connections on specified port', function (done) {
    trycatch(function () {
      var socket = net.connect(8585, function () {
        socket.end(done);
      });
    }, done);
  });
});





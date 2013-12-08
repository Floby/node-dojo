var App = require('../');
var utils = require('./utils');
var expect = require('chai').expect;
var trycatch = require('trycatch');
var supertest = require('supertest');

describe('Two instances of the app', function () {
  it('find each other and start syncing', function (done) {
    var s1 = new App({port: 8899, localPeerDiscovery: true});
    var s2 = new App({port: 8888, localPeerDiscovery: true});
    trycatch(function () {
      s1.startSync = function (port, host) {
        expect(port).to.equal(8888);
        onEnd();
      }
      s2.startSync = function (port, host) {};
    }, onEnd);

    s1.start();
    s2.start();

    function onEnd (error) {
      s1.stop(function () {
        console.log('stopped s1')
        s2.stop(done(error));
      });
    }
  });
})

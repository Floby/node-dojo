var ws = require('ws');
var App = require('../');

module.exports = {
  server: function () {
    var server;
    before(function (done) {
      server = new App({
        port: 8081
      });
      server.start(done);
    });
    
    after(function (done) {
      server.stop(done);
      server = null;
    });

    beforeEach(function (done) {
      server.reset(done);
    });
    return server;
  },
  sockjs: function (uri) {
    uri = uri + '/websocket';
    return new ws(uri);
  }
}

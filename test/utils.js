var ws = require('ws');
var App = require('../');

module.exports = {
  server: function (options) {
    var server;
    options = options || {};
    options.port = options.port || 8081;
    before(function (done) {
      server = new App(options);
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

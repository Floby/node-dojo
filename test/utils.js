var ws = require('ws');
var App = require('../');

module.exports = {
  server: function (options) {
    var res = {};
    options = options || {};
    options.port = options.port || 8081;
    before(function (done) {
      res.server = new App(options);
      res.server.start(done);
    });
    
    after(function (done) {
      res.server.stop(done);
      res.server = null;
    });

    beforeEach(function (done) {
      res.server.reset(done);
    });
    return res;
  },
  sockjs: function (uri) {
    uri = uri + '/websocket';
    return new ws(uri);
  }
}

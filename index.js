var http = require('http');
var util = require('util');
var url = require('url');

function Application (options) {
  this.server = http.createServer(this._requestHandler.bind(this));
  this.port = options.port;
}

var m = Application.prototype;


m._requestHandler = function _requestHandler(req, res) {
  var path = url.parse(req.url).pathname;
  if (path === '/greet') {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello world!');
  }
  else {
    res.statusCode = 404;
    res.end();
  }
};

m.start = function start(callback) {
  this.server.listen(this.port, callback);
};

m.stop = function stop(callback) {
  this.server.close(callback);
};


module.exports = Application;

var http = require('http');
var util = require('util');
var express = require('express');

function Application (options) {
  this.port = options.port;
  this.app = express();
  this.app.use(function (req, res, next) {
    res.header('X-Custom-Header', 'My own thing');
    next();
  });
  this.app.get('/greet', function (req, res) {
    res.header('Content-Type', 'text/plain');
    res.end('Hello World!');
  });
  this.server = http.createServer(this.app);
}

var m = Application.prototype;
m.start = function start(callback) {
  this.server.listen(this.port, callback);
};

m.stop = function stop(callback) {
  this.server.close(callback);
};

module.exports = Application;

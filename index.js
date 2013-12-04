var http = require('http');
var util = require('util');
var express = require('express');

function Application (options) {
  this.port = options.port;
  this.app = express();
  var self = this;

  this.app.use(function (req, res, next) {
    res.header('X-Custom-Header', 'My own thing');
    next();
  });
  this.app.get('/greet', function (req, res) {
    res.header('Content-Type', 'text/plain');
    res.end('Hello World!');
  });
  this.app.get('/messages', function (req, res) {
    res.json(self._messages);
  });
  this.app.post('/messages', express.json(), function (req, res) {
    self._messages.push(req.body);
    res.send(201);
  });
  this.server = http.createServer(this.app);
  this._messages = [];
}

var m = Application.prototype;
m.start = function start(callback) {
  this.server.listen(this.port, callback);
};

m.stop = function stop(callback) {
  this.server.close(callback);
};

m.reset = function reset(callback) {
  this._messages = [];
  callback();
}

module.exports = Application;

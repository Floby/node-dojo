var sockjs = require('sockjs');
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

  this.app.use(express.static(__dirname + '/public'));

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

    // notify all currently connected clients
    var event = {event: 'newMessage', author: req.body.author, body: req.body.body};
    self._connectedClients.forEach(function (client) {
      client.write(JSON.stringify(event));
    });
  });
  this.server = http.createServer(this.app);
  this._messages = [];

  this._connectedClients = [];
  this._sockjsServer = sockjs.createServer();
  this._sockjsServer.on('connection', function (connection) {
    self._connectedClients.push(connection);
    connection.on('close', function() {
      var index = self._connectedClients.indexOf(connection);
      if(index === -1) return;
      self._connectedClients.splice(index, 1);
    });
  });
}

var m = Application.prototype;
m.start = function start(callback) {
  this._sockjsServer.installHandlers(this.server, {prefix: '/new-messages', log: function () {}});
  this.server.listen(this.port, callback);
};

m.stop = function stop(callback) {
  this._connectedClients.forEach(function (client) {
    client.close();
  })
  this.server.close(callback);
};

m.reset = function reset(callback) {
  this._messages = [];
  callback();
}

module.exports = Application;

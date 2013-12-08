var net = require('net');
var sockjs = require('sockjs');
var http = require('http');
var util = require('util');
var express = require('express');
var appendOnly = require('append-only');
var request = require('request');

function Application (options) {
  this.port = options.port;
  this.app = express();
  var self = this;

  this.app.use(function (req, res, next) {
    res.header('X-Custom-Header', 'My own thing');
    next();
  });

  this.app.use(express.static(__dirname + '/public'));

  this.app.post('/sync', function (req, res) {
    var syncStream = self._messages.createStream();
    req.pipe(syncStream).pipe(res);
  });

  this.app.get('/greet', function (req, res) {
    res.header('Content-Type', 'text/plain');
    res.end('Hello World!');
  });
  this.app.get('/messages', function (req, res) {
    res.json(self._messages.createArray());
  });
  this.app.post('/messages', express.json(), function (req, res) {
    self._messages.push(req.body);
    res.send(201);
  });
  this.server = http.createServer(this.app);

  this._messages = this._createAppendOnly();

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

  this._syncingWith = {};
}

var m = Application.prototype;
m.start = function start(callback) {
  this._sockjsServer.installHandlers(this.server, {prefix: '/new-messages', log: function () {}});
  this.server.listen(this.port, callback);
};

m.stop = function stop(callback) {
  var self = this;
  this._connectedClients.forEach(function (client) {
    client.close();
  });
  for(var uri in this._syncingWith) {
    this._syncingWith[uri].end();
  }
  this.server.close(callback);
};

m.reset = function reset(callback) {
  this._messages = this._createAppendOnly();
  this._syncingWith = {};
  callback();
}

m.startSync = function startSync(port, host) {
  port = Number(port);
  host = host || 'localhost';
  var uri = 'http://' + host + ':' + port + '/sync';
  var syncStream = request.post(uri);
  this._syncingWith[uri] = syncStream;
  syncStream.pipe(this._messages.createStream()).pipe(syncStream);
};

m._createAppendOnly = function () {
  var list = appendOnly();
  var self = this;
  list.on('item', this._notifyWebsocketClients.bind(this));
  return list;
}

m._notifyWebsocketClients = function (message) {
  var event = {event: 'newMessage', author: message.author, body: message.body};
  this._connectedClients.forEach(function (client) {
    client.write(JSON.stringify(event));
  });
}

module.exports = Application;

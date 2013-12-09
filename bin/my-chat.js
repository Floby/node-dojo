#!/usr/bin/env node

var optimist = require('optimist');
var Application = require('../');

var options = optimist
  .usage('Starts my chat server')
  .alias('h', 'help')
  .alias('p', 'port')
  .default('port', 8000)
  .describe('port', 'Port on which to start the server')
  .describe('local-peer-discovery', 'Discover peers on the same local network and sync with them')


argv = options.argv;

if(argv.help) {
  options.showHelp();
  process.exit(0);
}

var app = new Application({
  port: argv.port,
  localPeerDiscovery: argv['local-peer-discovery']
});
app.start(function () {
  console.log('server started at http://localhost:' + argv.port);
});

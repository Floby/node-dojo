var optimist = require('optimist');
var Application = require('../');

var options = optimist
  .usage('Starts my chat server')
  .alias('p', 'port')
  .default('port', 8000)
  .alias('h', 'help')

argv = options.argv;

if(argv.help) {
  options.showHelp();
  process.exit(0);
}

var app = new Application({
  port: argv.port
});
app.start(function () {
  console.log('server started at http://localhost:' + argv.port);
});

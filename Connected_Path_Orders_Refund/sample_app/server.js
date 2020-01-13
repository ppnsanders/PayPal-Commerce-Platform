'use strict';
//Include ppconfig.json
const paypalConfig = require('./config/ppconfig.json');

//register a global function to get ppconfig data.
global.ppConfig = () => {
    paypalConfig.file_location = __dirname + '/config/ppconfig.json';
	return paypalConfig;
}

var app = require('./index');
var http = require('http');


var server;

/*
 * Create and start HTTP server.
 */

server = http.createServer(app);
server.listen(process.env.PORT || 8000);
server.on('listening', function () {
    console.log('Server listening on http://localhost:%d', this.address().port);
});

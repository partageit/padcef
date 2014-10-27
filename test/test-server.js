'use strict';
var http = require('http');
/**
* Create a http server to serve font files
*
* request.url is:
* /<anything>/<file name>: a fake font file is returned
* /error/<file name>: status code is 404
*
* @api public
*/
module.exports = function () {
	var srv = http.createServer(function (request, response) {
		var url = request.url.split('/');
		var statusCode = 200;
		var body = '';

		if (url[1] === 'error') {
			statusCode = 404;
			body = 'Sorry, the requested file does not exist';
		} else {
			//var filename = url.pop();
			body = 'This is a fake font file';
		}

		response.writeHead(statusCode, {
			'Content-Length': body.length
		});
		response.write(body);
		response.end();

	});
	srv.port = 9001;
	srv.url = 'http://127.0.0.1:' + 9001;
	return srv;
};

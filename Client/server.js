var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('express-session');

	var app = express();
	
	var http = require('http').Server(app);
	app.use(bodyParser.urlencoded());
	app.use(bodyParser.json());
	app.use(cookieParser());
	app.use(session({secret: '1234567890QWERTY'}));
	
	app.use(express.static(path.resolve('./src')));
		
	http.listen(9000);
	console.log('Server running at http://localhost:9000/');
/*
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
*/
#!/usr/bin/env node

var express = require('express');
var http = require('http')
var path = require('path');
var utils = require('./utils');
var WebSocketServer = require('ws').Server;

var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('selvietestserver123456789987654321'));
	app.use(express.session());
	app.use(app.router);
	app.use(require('stylus').middleware(__dirname + '/public'));
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

var webserver = http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});

var wss = new WebSocketServer({server: webserver});

// Socket IO

wss.on('connection', function (ws) {
	console.log('socket connected');
	setTimeout(function () {
		console.log('sending ping');
		ws.send(JSON.stringify({message: "content_cancel",request_id: "rid"}));
	},5000);


	ws.on('message', function (message) {
		console.log('got pong from socket');
		console.log(message);
	});
});


app.get('/', function (req, res){
	res.render('index', { title: 'Hello World' });
});

// Director Endpoints:
app.post('/v1/content', function (req, res){
	console.log('got full content, awesome!', req.body);
	res.json({status: 200});
});

// UGC Endpoints:
app.post('/v1/sample', function (req, res){
	console.log('got sample', req.body);
	res.json({
		status: 200,
		response: {
			content_id: 'awesomeContentId'
		}
	});
});

app.post('/v1/sample/:content_id', function (req, res){
	console.log('got sample update with content_id:', req.params.content_id);
	res.json({status: 200});
});







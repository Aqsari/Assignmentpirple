/*
*Primari file for the APi
*
*
*/

// Dependencies

var http = require('http')
var https = require('https')
var url = require('url')
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs =  require('fs');

// initiatet http server
var httpServer =  http.createServer(function(req, res){
	unifiedServer(req,res);
});

// start the server

httpServer.listen(config.httpPort,function(){
	console.log("the server is listening on port "+ config.httpPort);
});

// instatiate the htttp sever
var httpsServerOptions = {
	'key' : fs.readFileSync('./https/key.pem'),
	'cert' : fs.readFileSync('./https/cert.pem'),
};
var httpsServer =  https.createServer(httpsServerOptions,function(req, res){
	unifiedServer(req,res);
});

// start https server
httpsServer.listen(config.httpsPort,function(){
	console.log("the server is listening on port "+ config.httpsPort);
});


// all the server logic for both for http dan https server
var unifiedServer = function(req, res){

	//get the URL and parse it
	var parseURL = url.parse(req.url, true);

	// get path
	var path = parseURL.pathname;
	var trimmedPath = path.replace(/^\/+|\/+$/g,'');

	// Get the query string as an object
	var queryStringObject  = parseURL.query;

	//Get the HTTP method
	var method = req.method.toLowerCase();

	// Get the headers as an object
	var headers = req.headers;

	// Get the payload, if any
	var decoder = new StringDecoder('utf-8');
	var buffer = '';
	req.on('data', function(data){
		buffer += decoder.write(data);
	});
	req.on('end',function(){
		buffer += decoder.end();

		// choose the handler this request should go to, if one is not use not found handler
		 var chosenHandler = typeof(router[trimmedPath]) != 'undefined' ? router[trimmedPath] : handlers.nonFound;

		 // Construct the data object to send to the handler
		 var data = {
		 	'trimmedPath' : trimmedPath,
		 	'queryStringObject' : queryStringObject,
		 	'method' : method,
		 	'headers' : headers,
		 	'payload' : buffer
		 };

		// Reouter the request to the handler specified in the router
		chosenHandler(data, function(statusCode, payload){

			// Use the status code returned from the handler, or set the defult status code to 200
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

			//Use the payload returned from handler, or set the default payload to an empty object
			payload = typeof(payload) == 'object' ? payload : {};

			//Convert the payload to a string
			var payloadString = JSON.stringify(payload);

			//return the respose
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);

			//log the request
			console.log('Retruning this respose : ', statusCode, payloadString);
		});
	});
};
// Define the handlers
var handlers = {};

// ping handler
handlers.ping = function(data, callback){
	callback(200);
};

// hello handler
handlers.hello = function(data,callback){
	callback(200,{'hello' : 'hello world!'});
}
// not found hanlders
handlers.nonFound = function(data, callback){
	callback(404);
};

// Define a request router
var router = {
	'ping' : handlers.ping,
	'hello': handlers.hello
};

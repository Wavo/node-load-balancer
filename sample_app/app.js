/**
 * Module dependencies.
 */

var connect = require('connect')
  , clientIdManager = require(__dirname + '/../lib/node-load-balancer/client-id-manager')
  , dispatcher = require(__dirname + '/../lib/node-load-balancer/dispatcher');

// Configuration
connect(
    connect.logger(),
    connect.cookieParser(),
    clientIdManager(),
    dispatcher({
      path: './config.json'
    })
).listen(3000);

var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('request successfully proxied to 9000: \nMethod: ' + req.method + '\nURL: ' + req.url + '\n' + req.url +'\n' + JSON.stringify(req.headers, true, 2));
  res.end();
}).listen(9000); 

http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('request successfully proxied to 9999: \nMethod: ' + req.method + '\nURL: ' + req.url + '\n' + req.url +'\n' + JSON.stringify(req.headers, true, 2));
  res.end();
}).listen(9999); 
console.log("server listening on port 3000");

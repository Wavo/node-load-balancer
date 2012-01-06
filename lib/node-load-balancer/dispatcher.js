/**
* Chooses an apropriate instance given a specific node client
* It will use http-proxy to proxy requests, more info at:
*
* @return {Function}
* @api public
*/

// Create a new instance of HttProxy to use in your server
var HttpProxy = require("http-proxy");
var proxy = new HttpProxy.RoutingProxy();

module.exports = function(options){
  return function(req, res, next){
  };
};


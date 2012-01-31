/**
* Chooses an apropriate instance given a specific node client
* It will use http-proxy to proxy requests, more info at:
*
* @return {Function}
* @api public
*/

var Router = require("./router");
var router = new Router();

module.exports = function(options){
  this.cookieDecoderError = 'You need to use cookieDecoder middleware to use dispatcher.';

  return function(req, res, next){
    // If we do not have cookieDecoder middleware we bail out
    if(!req.cookies) throw new Error(this.cookieDecoderError);
    router.readConfig(options.path);
    if(options.beforeRoute){
      options.beforeRoute(router);
    }
    return router.route(req, res);
  };
};


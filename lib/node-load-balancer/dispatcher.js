/**
* Chooses an apropriate instance given a specific node client
* It will use http-proxy to proxy requests
* It also registers/deregisters clients based on special control requests
*
* @return {Function}
* @api public
*/

var Router = require("./router");
var router = new Router();

module.exports = function(options){
  this.cookieDecoderError = 'You need to use cookieDecoder middleware to use dispatcher.';

  router.readConfig(options.path);
  return function(req, res, next){
    // If we do not have cookieDecoder middleware we bail out
    if(!req.cookies) throw new Error(this.cookieDecoderError);

    // If we have a beforeRoute callback, we call it passing the router
    if(options.beforeRoute){
      options.beforeRoute(router);
    }
    return router.route(req, res);
  };
};
module.exports.router = router;

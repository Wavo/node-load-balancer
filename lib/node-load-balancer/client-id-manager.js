/**
* Assigns a client-id to the new connection and stores it in a cookie
*
* @return {Function}
* @api public
*/

var generate = require("./id-generator");

module.exports = function(options){
  this.cookieDecoderError = 'You need to use cookieDecoder middleware to use client-id-manager.';
  return function(req, res, next){

    // If we do not have cookieDecoder middleware we bail out
    if(!req.cookies) throw new Error(this.cookieDecoderError);
    if(!req.cookies['nlbclientid']){
      res.on('header', function(){
        generate(function(arg1, id){
          res.setHeader('Set-Cookie', 'NLBClientID=' + id + ';');
        });
      });
    }
    next();
  };
};

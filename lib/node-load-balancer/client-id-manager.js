/**
* Assigns a client-id to the new connection and stores it in a cookie
*
* @return {Function}
* @api public
*/

module.exports = function(options){
  this.cookieDecoderError = 'You need to use cookieDecoder middleware to use client-id-manager.';
  return function(req, res, next){

    // If we do not have cookieDecoder middleware we bail out
    if(!req.cookies) throw new Error(this.cookieDecoderError);

    next();
  };
};

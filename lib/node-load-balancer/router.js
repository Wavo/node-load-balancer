/**
* Object responsible for routing requests between clients and instances.
* This is the core component of the dispatcher middleware
* It can use several algorithms to make the routing base on the 
* configuration and LLB-Clients registered.
*
* @return {Router}
* @api public
*/

var Router = module.exports = function(options){
  // Some private variables
  var configReader, options;
  options = (options ? options : { path: './config.json' });
  configReader = require("./configuration-reader");
  this.config = null;

  Router.prototype.readConfig = function(){
    this.config = configReader('./spec/fixtures/config.json');
  };
};


/**
* Object responsible for routing requests between clients and instances.
* This is the core component of the dispatcher middleware
* It can use several algorithms to make the routing base on the 
* configuration and LLB-Clients registered.
*
* @return {Router}
* @api public
*/

var _ = require("underscore");
var HttpProxy = require("http-proxy");

var Router = module.exports = function(options){
  // Some private variables
  var configReader, options, that;
  that = this;
  options = (options ? options : { path: './config.json' });
  configReader = require("./configuration-reader");
  this.config = null;

  // Create a new instance of HttProxy to use in your server
  this.proxy = new HttpProxy.RoutingProxy();

  Router.prototype.readConfig = function(){
    this.config = configReader('./spec/fixtures/config.json');
  };

  Router.prototype.mapId = function(id, imageSet){
    if(arguments.length == 1){
      return that.mapId(id, that.config.classes);
    }
    else{
      var i, selectedClass, instanceType;
      instanceType = [];
      i = (id % (1/that.config.precision)) * that.config.precision
 
      function selectInstance(imageSet){
        var acc = 0;
        return _.find(imageSet, function(image, key){
          acc += image.weight;
          if(i < acc){
            instanceType.push(key);
            return true;
          }
        });
      }
      // Select class
      selectedClass = selectInstance(imageSet);
      selectInstance(selectedClass.versions);

      return instanceType;
    }
  };
};


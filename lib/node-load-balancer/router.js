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

var Router = module.exports = function(options){
  // Some private variables
  var configReader, options, that;
  that = this;
  options = (options ? options : { path: './config.json' });
  configReader = require("./configuration-reader");
  this.config = null;

  Router.prototype.readConfig = function(){
    this.config = configReader('./spec/fixtures/config.json');
  };

  Router.prototype.mapId = function(id, imageSet){
    if(arguments.length == 1){
      return that.mapId(id, that.config.classes);
    }
    else{
      var i, acc, selectedClass, instanceType;
      instanceType = [];
      i = (id % (1/that.config.precision)) * that.config.precision
 
      // Select class
      acc = 0;
      selectedClass = _.find(imageSet, function(image, key){
        acc += image.weight;
        if(i < acc){
          instanceType.push(key);
          return true;
        }
      });

      // Select version
      acc = 0;
      _.find(selectedClass.versions, function(weight, key){
        acc += weight;
        if(i < acc){
          instanceType.push(key);
          return true;
        }
      });

      return instanceType;
    }
  };
};


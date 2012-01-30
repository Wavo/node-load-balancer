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

  Router.prototype.leastConnections = function(instances){
    var sortedList = _.sortBy(instances, function(instance){
      return instance.connections;
    });
    return sortedList[0];
  };

  Router.prototype.chooseInstance = function(id){
    var instanceType = that.mapId(id);
    var instances = that.routingTable[instanceType[0]][instanceType[1]];
    return that[that.config.routingAlgorithm](instances);
  };

  Router.prototype.addInstance = function(instance){
    var instances = that.routingTable[instance.class][instance.version];
    var existing = _.find(instances, function(i){
      return i.host == instance.host && i.port == instance.port;
    });
    if(!existing){
      instances.push({host: instance.host, port: instance.port, connections: 0});
    }
    return that;
  };

  Router.prototype.readConfig = function(){
    that.config = configReader('./spec/fixtures/config.json');
    that.routingTable = {};
    _.each(that.config.classes, function(val, className){
      that.routingTable[className] = {};
      _.each(val.versions, function(val, version){
        that.routingTable[className][version] = [];
      });
    });
  };

  Router.prototype.mapId = function(id, imageSet){
    if(!imageSet){
      imageSet = that.config.classes;
    }

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
  };
};


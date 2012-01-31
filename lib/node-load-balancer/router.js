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
  var configReader, options, that, roundRobinCounters;
  that = this;
  options = (options ? options : { path: './config.json' });
  configReader = require("./configuration-reader");
  this.config = null;

  // Create a new instance of HttProxy to use in your server
  this.proxy = new HttpProxy.RoutingProxy();

  Router.prototype.routing = {
    roundRobin : function(instances, className, version){
      var selected = instances[roundRobinCounters[className][version] % instances.length];
      roundRobinCounters[className][version] += 1;
      return selected;
    },

    leastConnections : function(instances){
      var sortedList = _.sortBy(instances, function(instance){
        return instance.connections;
      });
      return sortedList[0];
    }
  };

  Router.prototype.route = function(req, res){
    var instance = that.chooseInstance(req.cookies['nlbclientid']);
    return that.proxy.proxyRequest(req, res, { host: instance.host, port: instance.port} );
  };

  Router.prototype.chooseInstance = function(id){
    var instanceType = that.mapId(id);
    var instances = that.routingTable[instanceType[0]][instanceType[1]];
    return that.routing[that.config.routingAlgorithm](instances, instanceType[0], instanceType[1]);
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

  Router.prototype.readConfig = function(path){
    that.config = configReader(path);
    that.routingTable = {};
    roundRobinCounters = {};
    _.each(that.config.classes, function(val, className){
      that.routingTable[className] = {};
      roundRobinCounters[className] = {};
      _.each(val.versions, function(val, version){
        that.routingTable[className][version] = [];
        _.each(val.instances, function(instance){
          that.addInstance(_.extend({}, instance, { class: className, version: version }));
        });
        roundRobinCounters[className][version] = 0;
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


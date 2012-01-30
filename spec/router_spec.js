var Router = require("../lib/node-load-balancer/router");

describe("Router", function(){
  var router = new Router();

  it("should build a Router object", function(){
    expect(router).toEqual(jasmine.any(Router));
  });

  describe("#readConfig", function(){
    var configReader = require("../lib/node-load-balancer/configuration-reader");
    var config = configReader('./spec/fixtures/config.json');

    beforeEach(function(){
      router.readConfig();
    });

    it("should read config file from fixtures into configuration attribute", function(){
      expect(router.config).toEqual(config);
    });

    it("should populate the routing table", function(){
      var table = {
        "ClassA" : {
          "0.0.1" : []
          , "0.2.3" : []
          , "0.2.4Alpha" : []
        }
        , "ClassB" : { 
          "0.1" : []
        } 
      };
      expect(router.routingTable).toEqual(table);
    });
  });

  describe("#addInstance", function(){
    var table = {
      ClassA : { 
        "0.0.1" : [ { host : '127.0.0.1', port : 9000 } ], 
        "0.2.3" : [  ], 
        "0.2.4Alpha" : [  ] 
      }, 
      ClassB : { 
        "0.1" : [  ] 
      } 
    };
    var instance = {
      class: 'ClassA',
      version: '0.0.1',
      host: '127.0.0.1',
      port: 9000
    };

    beforeEach(function(){
      router.readConfig();
    });
    // Is this necessary? we could populate the config dynamicaly
    it("should throw an execption if the instance class and version are not in the config", function(){
    });

    it("should return the router instance", function(){
      expect(router.addInstance(instance)).toEqual(router);
    });

    it("should add instance to intances inside the right class/version array", function(){
      expect(router.addInstance(instance).routingTable).toEqual(table);
    });

    it("should not add two instaces with same host/port pair", function(){
      router.addInstance(instance)
      expect(router.addInstance(instance).routingTable).toEqual(table);
    });

    it("should add instance more than one intance inside the array", function(){
      var table = { 
        ClassA : { 
          "0.0.1" : [ { host : '127.0.0.1', port : 9000 }, { host : '127.0.0.1', port : 9001 } ], 
          "0.2.3" : [  ], 
          "0.2.4Alpha" : [  ] 
        }, 
        ClassB : { 
          "0.1" : [  ] 
        } 
      };
      router.addInstance(instance);
      expect(router.addInstance({class: 'ClassA', version: '0.0.1', host: '127.0.0.1', port: 9001}).routingTable).toEqual(table);
    });
  });

  describe("#mapId", function(){
    var expected = [];

    it("should return the instance type list based on clientId", function(){
      expect(router.mapId(3220264594410000)).toEqual([ 'ClassA', '0.0.1' ]);
      expect(router.mapId(3220264594410700)).toEqual([ 'ClassA', '0.2.3' ]);
      expect(router.mapId(3220264594410745)).toEqual([ 'ClassA', '0.2.4Alpha' ]);
      expect(router.mapId(3220519812119999)).toEqual([ 'ClassB', '0.1' ]);
    });
  });
});


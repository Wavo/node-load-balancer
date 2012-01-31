var Router = require("../lib/node-load-balancer/router");

describe("Router", function(){
  var router = new Router();
  var instance = {
    class: 'ClassA',
    version: '0.0.1',
    host: '127.0.0.1',
    port: 9000
  };

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
        "0.0.1" : [ { host : '127.0.0.1', port : 9000, connections: 0 } ], 
        "0.2.3" : [  ], 
        "0.2.4Alpha" : [  ] 
      }, 
      ClassB : { 
        "0.1" : [  ] 
      } 
    };

    beforeEach(function(){
      router.readConfig();
    });

    it("should return the router instance", function(){
      expect(router.addInstance(instance)).toEqual(router);
    });

    it("should add instance to intances inside the right class/version array", function(){
      expect(router.addInstance(instance).routingTable).toEqual(table);
    });

    it("should not add two instaces with same host/port pair", function(){
      router.addInstance(instance);
      expect(router.addInstance(instance).routingTable).toEqual(table);
    });

    it("should add instance more than one intance inside the array", function(){
      var table = { 
        ClassA : { 
          "0.0.1" : [ { host : '127.0.0.1', port : 9000, connections: 0 }, { host : '127.0.0.1', port : 9001, connections: 0 } ], 
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

  describe("#route", function(){
    var res = {};
    var req = {cookies: {nlbclientid: '3220264594410000'}};

    beforeEach(function(){
      spyOn(router.proxy, "proxyRequest");
    });

    it("should route using client-id from req.cookies", function(){
      router.route(req, res);
      expect(router.proxy.proxyRequest).toHaveBeenCalledWith(req, res, {host: '127.0.0.1', port: 9000});
    });
  });

  describe("#chooseInstance", function(){
    beforeEach(function(){
      router.readConfig();
      router.addInstance(instance)
      router.addInstance({class: 'ClassA', version: '0.0.1', host: '127.0.0.1', port: 9001});
    });

    it("should return null if there is no available instance", function(){
      expect(router.chooseInstance(3220264594410700)).toEqual(null);
    });

    describe("when routing algorithm is roundRobin", function(){
      beforeEach(function(){
        router.config.routingAlgorithm = "roundRobin";
      });


      it("should choose the next instance available", function(){
        expect(router.chooseInstance(3220264594410000)).toEqual({ host: '127.0.0.1', port: 9000, connections: 0 });
        expect(router.chooseInstance(3220264594410000)).toEqual({ host: '127.0.0.1', port: 9001, connections: 0 });
        expect(router.chooseInstance(3220264594410000)).toEqual({ host: '127.0.0.1', port: 9000, connections: 0 });
      });

      afterEach(function(){
        router.config.routingAlgorithm = "leastConnections";
      });
    });

    describe("when routing algorithm is leastConnections", function(){
      it("should choose the first instance when all of them have the same connection count", function(){
        expect(router.chooseInstance(3220264594410000)).toEqual({ host: '127.0.0.1', port: 9000, connections: 0 });
      });

      it("should choose the instance with least connections available", function(){
        router.routingTable['ClassA']['0.0.1'][0].connections = 1;
        expect(router.chooseInstance(3220264594410000)).toEqual({ host: '127.0.0.1', port: 9001, connections: 0 });
        router.routingTable['ClassA']['0.0.1'][1].connections = 1;
        expect(router.chooseInstance(3220264594410000)).toEqual({ host: '127.0.0.1', port: 9000, connections: 1 });
        router.routingTable['ClassA']['0.0.1'][0].connections = 2;
        expect(router.chooseInstance(3220264594410000)).toEqual({ host: '127.0.0.1', port: 9001, connections: 1 });
        router.routingTable['ClassA']['0.0.1'][0].connections = 0;
        router.routingTable['ClassA']['0.0.1'][1].connections = 0;
      });
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


var Router = require("../lib/node-load-balancer/router");

describe("Router", function(){
  var router = new Router();

  it("should build a Router object", function(){
    expect(router).toEqual(jasmine.any(Router));
  });

  describe("#readConfig", function(){
    var configReader = require("../lib/node-load-balancer/configuration-reader");
    var config = configReader('./spec/fixtures/config.json');
    it("should read config file from fixtures into configuration attribute", function(){
      router.readConfig();
      expect(router.config).toEqual(config);
    });
  });

  describe("#addInstance", function(){
    var instance = {
      class: 'ClassA',
      version: '0.0.1',
      host: '127.0.0.1',
      port: 9000
    };
    // Is this necessary? we could populate the config dynamicaly
    it("should throw an execption if the instance class and version are not in the config", function(){
    });

    it("should return the router instance", function(){
      expect(router.addInstance(instance)).toEqual(router);
    });

    it("should add instance to intances inside the right class/version array", function(){
      //test code
      expect(router.mapId(3220264594410000)).toEqual([ 'ClassA', '0.0.1' ]);
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


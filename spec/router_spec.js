var Router = require("../lib/node-load-balancer/router");

describe("router", function(){
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

  describe("#mapId", function(){
    var expected = [];

    it("should return ...", function(){
      expect(router.mapId(3220264594410000)).toEqual([ 'ClassA', '0.0.1' ]);
      expect(router.mapId(3220264594410700)).toEqual([ 'ClassA', '0.2.3' ]);
      expect(router.mapId(3220264594410745)).toEqual([ 'ClassA', '0.2.4Alpha' ]);
      expect(router.mapId(3220519812119999)).toEqual([ 'ClassB', '0.1' ]);
    });
  });
});


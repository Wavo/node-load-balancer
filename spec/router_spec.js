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
});


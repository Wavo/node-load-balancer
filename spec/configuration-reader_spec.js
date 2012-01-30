var configurationReader = require("../lib/node-load-balancer/configuration-reader");

describe("configuration-reader", function(){
  describe("when we have a valid config file", function(){
    var config = configurationReader("./spec/fixtures/config.json");
    it("it should read and load the json in given path", function(){
      expect(config.routingAlgorithm).toEqual('LeastConnections');
      expect(config.precision).toEqual(0.001);
    });
  });
});

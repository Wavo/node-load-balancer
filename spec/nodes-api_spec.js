var NodesAPI = require("../lib/node-load-balancer/nodes-api");
var Router = require("../lib/node-load-balancer/router");

describe("NodesAPI", function(){
  var router = new Router();
  var api = new NodesAPI(router);
  var instance = {
    class: 'ClassA',
    version: '0.0.1',
    host: '127.0.0.1',
    port: 9000
  };
  var req = {
    on: function(){}
  };

  describe("DELETE /router/instance", function(){
    beforeEach(function(){
      spyOn(router, "addInstance");
      spyOn(req, "on").andCallFake(function(event, callback){ callback(JSON.stringify(instance)); });
      api["POST /router/instance"](req, {});
    });

    it("should add instance from POST body", function(){
      expect(router.addInstance).toHaveBeenCalledWith(instance);
    });
  });

  describe("POST /router/instance", function(){
    beforeEach(function(){
      spyOn(router, "addInstance");
      spyOn(req, "on").andCallFake(function(event, callback){ callback(JSON.stringify(instance)); });
      api["POST /router/instance"](req, {});
    });

    it("should add instance from POST body", function(){
      expect(router.addInstance).toHaveBeenCalledWith(instance);
    });
  });
});

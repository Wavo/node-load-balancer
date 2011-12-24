var clientIdManager = require("../lib/node-load-balancer/client-id-manager");

describe("client-id-manager", function(){
  it("should return a function", function(){
    expect(clientIdManager()).toEqual(jasmine.any(Function));
  });

});


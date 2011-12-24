var clientIdManager = require("../lib/node-load-balancer/client-id-manager");

describe("client-id-manager", function(){
  it("should return a function", function(){
    expect(clientIdManager()).toEqual(jasmine.any(Function));
  });

  it("should throw exception from returned function when req does not have cookies", function(){
    var middleware = clientIdManager();
    expect(function(){ middleware({}, {}, function(){}); }).toThrow(middleware.cookieDecoderError);
  });

});


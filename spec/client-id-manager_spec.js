var clientIdManager = require("../lib/node-load-balancer/client-id-manager");

describe("client-id-manager", function(){
  var middleware = clientIdManager();

  it("should return a function", function(){
    expect(middleware).toEqual(jasmine.any(Function));
  });

  it("should throw exception from returned function when req does not have cookies", function(){
    expect(function(){ middleware({}, {}, function(){}); }).toThrow(middleware.cookieDecoderError);
  });

  it("should call next if we have the cookies object on req", function(){
    var next = jasmine.createSpy('next');
    middleware({cookies: {}}, {}, next);
    expect(next).toHaveBeenCalled();
  });

});


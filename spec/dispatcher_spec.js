var dispatcher = require("../lib/node-load-balancer/dispatcher");

describe("dispatcher", function(){
  var middleware = dispatcher();
  var next = jasmine.createSpy('next');
  var res = {
    on: function(event, callback){
      callback();
    },
    setHeader: function(){}
  };
  var req = {cookies: {}};

  beforeEach(function(){
    spyOn(res, "on").andCallThrough();
  });

  it("should return a function", function(){
    expect(middleware).toEqual(jasmine.any(Function));
  });

  it("should throw exception from returned function when req does not have cookies", function(){
    expect(function(){ middleware({}, {}, function(){}); }).toThrow(middleware.cookieDecoderError);
  });

  it("should call next", function(){
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});

var dispatcher = require("../lib/node-load-balancer/dispatcher");

describe("dispatcher", function(){
  var middleware = dispatcher({
    path: './spec/fixtures/config_with_fixed_data.json', 
    beforeRoute: function(router){
      spyOn(router, "route");
    } 
  });

  var next = jasmine.createSpy('next');
  var res = {
    on: function(event, callback){
      callback();
    },
    setHeader: function(){}
  };
  var req = {
    cookies: {nlbclientid: '3220264594410000'}
  };

  beforeEach(function(){
    spyOn(res, "on").andCallThrough();
  });

  it("should return a function", function(){
    expect(middleware).toEqual(jasmine.any(Function));
  });

  it("should throw exception from returned function when req does not have cookies", function(){
    expect(function(){ middleware({}, {}, function(){}); }).toThrow(middleware.cookieDecoderError);
  });

  it("should not call next", function(){
    middleware(req, res, next);
    expect(next).wasNotCalled();
  });
});

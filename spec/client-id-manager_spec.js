var clientIdManager = require("../lib/node-load-balancer/client-id-manager");

describe("client-id-manager", function(){
  var middleware = clientIdManager();
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

  it("should call next if we have the cookies object on req", function(){
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("should call setHeader inside head event callback if there is no NLBClientID in cookies", function(){
    spyOn(res, "setHeader").andCallFake(function(header, value){
      expect(value).toMatch(/^NLBClientID=\d+;$/);
    });
    middleware(req, res, next);
    expect(res.on).toHaveBeenCalledWith('header', jasmine.any(Function));
    expect(res.setHeader).toHaveBeenCalledWith('Set-Cookie', jasmine.any(String));
  });

  it("should not call anything in head event callback if there is NLBClientID already in cookies", function(){
    // The cookie parser always put names in lowercase
    req.cookies = {'nlbclientid': '1'};
    middleware(req, res, next);
    expect(res.on).wasNotCalled();
  });

});


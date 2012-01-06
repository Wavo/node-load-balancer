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

  it("should return a function", function(){
    expect(middleware).toEqual(jasmine.any(Function));
  });
});

var generate = require("../lib/node-load-balancer/id-generator");

describe("id-generator", function(){
  var callback = jasmine.createSpy('callback');
  var ids = null;

  beforeEach(function(){
    ids = [];
    callback.andCallFake(function(arg1, id){
      ids.push(id);
    });
    generate(callback);
  });

  it("should generate a string", function(){
    expect(callback).toHaveBeenCalledWith(null, jasmine.any(String));
  });

  it("should generate different strings in consecutive calls", function(){
    generate(callback);
    ids[0]
    expect(ids[0]).toNotEqual(ids[1]);
  });

  it("should generate the id with length passed in as options", function(){
    generate({length: 32}, callback);
    expect(ids[1].length).toEqual(32);
  });
});

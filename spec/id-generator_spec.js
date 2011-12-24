var generate = require("../lib/node-load-balancer/id-generator").generate;

describe("id-generator", function(){
  describe("generate", function(){
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
  });
});

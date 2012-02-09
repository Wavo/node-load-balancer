/**
* Object responsible for handling router control requests.
* It should be able to identify a control request and manipulate its router properly.
*
* @return {NodesAPI}
* @api public
*/

var NodesAPI = module.exports = function(router){
  NodesAPI.prototype["POST /router/instance"] = function(req, res){
    req.on('data', function(chunk){
      router.addInstance(JSON.parse(chunk));
    });
  };
};


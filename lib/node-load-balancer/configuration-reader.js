/**
* Load synchronously and return a .json file if it is a valid configuration file for LLB
*
* @return {Object}
* @api public
*/
var fs = require('fs');

module.exports = function(path){
  return JSON.parse(fs.readFileSync(path, 'utf8'));
};


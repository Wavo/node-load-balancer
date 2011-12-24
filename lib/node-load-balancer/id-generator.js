
var config          = require('../../config')
  , DEFAULT_ID_TYPE = config.DEFAULT_ID_TYPE
  , INSTANCE_ID     = config.INSTANCE_ID 
  ;

var MAX_COUNTER     = Math.pow(10, 4) - 1
  
  , DAY0_TIMESTAMP  =  Date.UTC(2011, 0, 1)
  ;


var start_counter   = Math.pow(10 , 1 + Math.floor(Math.log(MAX_COUNTER)/Math.log(10)))
  
  , cache           = { _store: {} }
  ;

cache.get = function(type) {
  
  if (!this._store[type]) {
    this._store[type] = { counter: start_counter, last_timestamp: undefined };
  }
  
  return this._store[type];
  
}

function padId(id, length) {
  
  var padding_length  = length - id.length
    , padding         = ''
    ;
  
  for (var i = 0; i < padding_length; i++) {
    padding += '0';
  }
    
  return padding + id;
}

function generate_id(callback) {
  
  var args        = Array.prototype.slice.call(arguments)
    
    , callback    = args.pop()
    
    , options     = args.shift() || {}
    
    , timestamp   = Date.now() - DAY0_TIMESTAMP
    , nextTick    = false
    , id
    ;
  
  options.type || (options.type = DEFAULT_ID_TYPE);
  
  if (cache.get(options.type).last_timestamp === timestamp) {
    
    if (cache.get(options.type).counter - start_counter === MAX_COUNTER) {
      
      process.nextTick(arguments.callee(callback));
      nextTick = true;
      
      console.log('WARNING ---> ' + options.type + ' ID ROLLOVER');
      console.log('   counter           = ', cache.get(options.type).counter);
      console.log('   MAX_COUNTER       = ', MAX_COUNTER);
      console.log('   start_counter     = ', cache.get(options.type).start_counter);
      
      console.log('   last ID           = ', [timestamp, INSTANCE_ID, counter.toString().substr(1)]);
      
    } else {
      
      cache.get(options.type).counter++;
    
    }
    
  } else {
    
    cache.get(options.type).counter = start_counter;
    cache.get(options.type).last_timestamp = timestamp;
    
  }
  
  if ( !nextTick ) {
    
    id = [timestamp, INSTANCE_ID, cache.get(options.type).counter.toString().substr(1)].join('');
    
    if (options.length) {
      id = padId(id, options.length);
    }
    
    callback(null, id);
    
  }
  
}

module.exports = generate_id;

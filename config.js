function Config() {
  
  this.CLIENT_ID_TYPE   = 'CLIENT_ID';
  
  this.DEFAULT_ID_TYPE  = this.CLIENT_ID_TYPE;
  
  this.INSTANCE_ID      = process.env['INSTANCE_ID'] || 1;

}

module.exports = new Config();

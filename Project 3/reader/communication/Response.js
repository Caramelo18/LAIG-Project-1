function Response(info){
  this.info = info;
}

Response.prototype.constructor=Response;

Response.prototype.getInfo = function() {
    return this.info;
}

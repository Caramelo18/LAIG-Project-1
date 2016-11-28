function Client(){
  this.port = 8081;
}

Client.prototype.constructor=Client;

Client.prototype.getPlRequest = function(command){
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:' + this.port + '/' + commmand, true);
    request.send();
}


Client.defaultPort = 8081

Client.defaultErrorHandler = function(){
  console.log("error waiting for response " );
}

Client.defaultSuccessHandler = function(data){
  console.log(data.target.response);
}


function Client(port){
  this.port = port || Clien.defaultPort;
}

Client.prototype.constructor=Client;

Client.prototype.getPrologRequest = function(command, onSuccess, onError){
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:' + this.port + '/' + command, true);

    //A JavaScript function object that gets invoked when the operation is successfully completed.
    request.onload = onSuccess|| Client.defaultSuccessHandler;

    //A JavaScript function object that gets invoked if the operation fails to complete due to an error.
    request.onerror = onError||Client.defaultErrorHandler;

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}


Client.prototype.getPort = function(){
  return this.port;
}

Client.prototype.setPort = function(port){
  if(typeof port == 'undefiened' || port == NULL){
    console.warn('you tried to set Port with a non permitted value');
    return;
  }
  else{
      this.port = port;
  }
}

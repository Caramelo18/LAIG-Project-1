function Player(){
  this.score = 0;

}

Player.prototype.constructor = Player;

Player.prototype.getScore = function(){
  return this.score;
}

Player.prototype.updateScore = function(){
  this.score++;
}

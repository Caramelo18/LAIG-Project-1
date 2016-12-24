var mode={
    HUMAN_VS_HUMAN : 1,
    HUMAN_VS_COMPUTER : 2,
    COMPUTER_VS_COMPUTER : 3,
};

var difficulty = {
    EASY : 1,
    HARD : 2,
};


function Game(scene, mode, difficulty){

  this.scene = scene;
  this.mode = mode;
  this.difficulty = difficulty;
  this.prologBoard = null;

  this.players = [];
  this.currentPlayer = 0;
  this.board = null;


}

Game.prototype.constructor = Game;

Game.prototype.setPlayers = function (number) {

  for (var i = 0; i < number; i++) {
    this.players.push(new Player());
  }

};

Game.prototype.setBoard = function (board) {
    this.board = board;
};

Game.prototype.setCurrentPlayer = function (player) {
  this.currentPlayer = player;
};

Game.prototype.changePlayer = function () {
    if(this.currentPlayer == (this.players.length - 1)){
      this.setCurrentPlayer(0);
    }
    else{
      this.setCurrentPlayer(this.currentPlayer++);
    }
};

Game.prototype.display = function(){

}

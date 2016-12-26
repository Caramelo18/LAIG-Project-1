var mode={
    HUMAN_VS_HUMAN : 1,
    HUMAN_VS_COMPUTER : 2,
    COMPUTER_VS_COMPUTER : 3,
};

var difficulty = {
    EASY : 1,
    HARD : 2,
};

var states = {
    P1START : 0,
    P2START : 1,
    P1: 2,
    P2: 3,
    END: 4,
};


function Game(board, mode){
    this.board = board;
    this.scene = this.board.scene;
    this.mode = mode;

    this.state = 0;

    this.tilesPlaced = 0;

    this.selectedTile = {};
    this.target = {};

}

Game.prototype.constructor = Game;


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

Game.prototype.setTarget = function(line, col) {
    this.target["line"] = line;
    this.target["col"] = col;
    this.placeTile();
}

Game.prototype.setSelectedTile = function(line, col) {
    this.selectedTile["line"] = line;
    this.selectedTile["col"] = col;
    console.log("HEY");
    this.board.setPickableMatrix(true);
}

Game.prototype.placeTile = function() {
    switch (this.state) {
        case 0:
            var command = 'playerAplaceStart(' + this.board.board + ',' + this.target["line"] + ',' + this.target["col"] + ')';
            this.scene.client.getPrologRequest(command, this.scene.readBoard, 1, this.scene);
            this.tilesPlaced++;
            if(this.tilesPlaced == 2)
                this.state++;
            break;
        case 1:
            var command = 'playerBplaceStart(' + this.board.board + ',' + this.target["line"] + ',' + this.target["col"] + ')';
            this.scene.client.getPrologRequest(command, this.scene.readBoard, 1, this.scene);
            this.tilesPlaced++;
            this.state++;
            break;
        case 2:
            console.log("State 2");
            this.setP1Turn();
            this.state++;
            break;
        case 3:
            this.setP2Turn();
            console.log("State 3");
            this.state--;
            break;
    }
}

Game.prototype.setP1Turn = function() {
    //this.board.scene.changePlayerView();
    this.board.setPickableMatrix(false);
    this.board.setPickableP1Tiles(true);
    this.board.setPickableP2Tiles(false);
}

Game.prototype.setP2Turn = function() {
    //this.board.scene.changePlayerView();
    this.board.setPickableMatrix(false);
    this.board.setPickableP1Tiles(false);
    this.board.setPickableP2Tiles(true);
}

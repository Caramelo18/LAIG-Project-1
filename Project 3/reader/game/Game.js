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

    this.state = 2;

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

Game.prototype.setSelectedTile = function(ID) {
    var index = ID % 10;
    var prevSel = this.selectedTile;
    var player;
    if(Math.trunc(ID / 10) == 5){
        this.selectedTile = this.board.p1Tiles[index];
        player = 1;
    }
    else {
        this.selectedTile = this.board.p2Tiles[index];
        player = 2;
    }
    if(this.selectedTile == prevSel){
        this.selectedTile.rotate();
        this.updateHand(player, index);
    }

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
            this.setP1Turn();
            break;
        case 2:
            console.log("State 2");
            this.state++;
            this.setP2Turn();
            break;
        case 3:
            console.log("State 3");
            this.state--;
            this.setP1Turn();
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

Game.prototype.updateHand = function(player, index){
    if(player == 1){
        var hand = this.board.p1Hand;
        var tile = this.board.p1Tiles[index];
        var type = this.board.p1Tiles[index].constructor.name;
        type = type[type.length - 1];

        var direction = this.board.readDirection(tile.direction, "t" + type);
        var newTile = "tile(A,t" + type + "," + direction + ")";
        this.board.p1Hand = replaceSpecificIndex(hand, index, newTile);
    }
    else if (player == 2){
        var hand = this.board.p2Hand;
        var tile = this.board.p2Tiles[index];
        var type = this.board.p2Tiles[index].constructor.name;
        type = type[type.length - 1];

        var direction = this.board.readDirection(tile.direction, "t" + type);
        var newTile = "tile(B,t" + type + "," + direction + ")";
        this.board.p2Hand = replaceSpecificIndex(hand, index, newTile);

    }
}

function replaceSpecificIndex(hand, index, tileToReplace){
    var newHand = "";
    var j = 0;
    for(var i = 0; i < hand.length; i++){
        if(hand.substring(i, i+5) == "tile("){
            index--;
        }
        if(index == -1){
            newHand += tileToReplace[j];
            j++;
            if(j == tileToReplace.length)
                index = -2;
        }
        else {
            newHand += hand[i];
        }
    }
    return newHand;
}

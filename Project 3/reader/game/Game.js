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

    this.scoreA = 0;
    this.scoreB = 0;

    this.selectedTile = {};
    this.target = {};


    this.boardStack = [];
}

Game.prototype.constructor = Game;

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
    var actualBoard = Object.assign(new Board(this.board.scene), this.board);
    this.boardStack.push(actualBoard);

    console.log(this.tilesPlaced);
    console.log(this.state);
    if(this.mode == 1){
        this.botGame();
        return;
    }

    switch (this.state) {
        case 0:
            var command = 'playerAplaceStart(' + this.board.board + ',' + this.target["line"] + ',' + this.target["col"] + ')';
            this.scene.client.getPrologRequest(command, this.scene.readBoard, 1, this.scene);
            this.tilesPlaced++;
            if(this.tilesPlaced == 2){
                this.state++;
                this.scene.turnView = true;
            }
            break;
        case 1:
            var command = 'playerBplaceStart(' + this.board.board + ',' + this.target["line"] + ',' + this.target["col"] + ')';
            this.scene.client.getPrologRequest(command, this.scene.readBoard, 1, this.scene);
            this.tilesPlaced++;
            this.state++;
            this.scene.turnView = true;
            this.setP1Turn();
            break;
        case 2:
            this.player1Move();
            break;
        case 3:
            this.player2Move();
            break;
    }
}

Game.prototype.botGame = function(){
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
            this.player1Move();
            break;
    }
}

Game.prototype.setP1Turn = function() {
    console.log("p1turn");
    this.board.setPickableMatrix(false);
    this.board.setPickableP1Tiles(true);
    this.board.setPickableP2Tiles(false);
}

Game.prototype.setP2Turn = function() {
    console.log("p2turn");
    this.board.setPickableMatrix(false);
    this.board.setPickableP1Tiles(false);
    this.board.setPickableP2Tiles(true);
}

Game.prototype.passTurn = function() {
    if(this.mode == 1){
        this.botPassTurn();
        return;
    }
    switch (this.state) {
        case 2:
            this.removeTilePlayer1Hand();
            this.addTilePlayer1Hand();
            this.state++;
            this.setP2Turn();
            this.scene.turnView = true;
            break;
        case 3:
            this.removeTilePlayer2Hand();
            this.addTilePlayer2Hand();
            this.state--;
            this.setP1Turn();
            this.scene.turnView = true;
            break;
    }
    this.tilesPlaced++;
    this.updateStatus();
}

Game.prototype.botPassTurn = function(){
    console.log("bot pass turn!");
    this.removeTilePlayer1Hand();
    this.addTilePlayer1Hand();

    //botTurn(Board, PlayerHand, TilePool, PoolSize)
    var command = 'botTurn(' + this.board.board + ',' + this.board.p2Hand + ',' + this.pool + ',' + this.poolSize + ')';
    this.board.scene.client.getPrologRequest(command, this.handleBotPlay, 1, this);
    this.tilesPlaced += 2;
}

Game.prototype.handleBotPlay = function(data) {
    var response = data.target.response;
    response = response.split("],");
    response[0] = response[0].substring(1);
    response[6] = response[6] + "]";
    response[7] = response[7].substring(0, response[7].length - 1);

    var board = "";
    for(var i = 0; i < 5; i++)
        board += response[i] + "],";
    board += response[5] + "]";

    var tiles = response[6];
    var tilePool = response[7];

    this.scene.poolSize--;
    this.scene.pool = tilePool;
    this.scene.board.updateBoard(board, true);
    this.scene.board.p2Hand = tiles;

    tiles = tiles.substring(1);
    tiles = tiles.split("),");
    this.scene.board.loadPlayerTiles([], tiles);

    this.scene.setP1Turn();
    this.scene.updateStatus();
}

Game.prototype.updateHand = function(player, index){
    if(player == 1){
        var hand = this.board.p1Hand;
        var tile = this.board.p1Tiles[index];
        var type = this.board.p1Tiles[index].constructor.name;
        type = type[type.length - 1];

        var direction = this.board.readDirection(tile.direction, "t" + type);
        var newTile = "tile(a,t" + type + "," + direction + ")";
        this.board.p1Hand = replaceSpecificIndex(hand, index, newTile);
    }
    else if (player == 2){
        var hand = this.board.p2Hand;
        var tile = this.board.p2Tiles[index];
        var type = this.board.p2Tiles[index].constructor.name;
        type = type[type.length - 1];

        var direction = this.board.readDirection(tile.direction, "t" + type);
        var newTile = "tile(b,t" + type + "," + direction + ")";
        this.board.p2Hand = replaceSpecificIndex(hand, index, newTile);

    }
}

Game.prototype.removeTilePlayer1Hand = function(){
    var P1Hand = this.board.p1Hand;
    var index = this.selectedTile.col;

    var newHand = replaceSpecificIndex(P1Hand, index, "tile(x,xx,x)");
    newHand = newHand.replace("tile(x,xx,x),", "");
    this.board.p1Hand = newHand;

    newHand = newHand.substring(1);
    newHand = newHand.split("),");
    this.board.loadPlayerTiles(newHand, []);
}

Game.prototype.removeTilePlayer2Hand = function(){
    var P2Hand = this.board.p2Hand;
    var index = this.selectedTile.col;

    var newHand = replaceSpecificIndex(P2Hand, index, "tile(x,xx,x)");
    newHand = newHand.replace("tile(x,xx,x),", "");
    this.board.p2Hand = newHand;

    newHand = newHand.substring(1);
    newHand = newHand.split("),");
    this.board.loadPlayerTiles([], newHand);

}

Game.prototype.addTilePlayer1Hand = function() {
    var P1Hand = this.board.p1Hand;
    var pool = this.pool;
    var poolSize = this.poolSize;

    var command = 'addPlayerTile(' + pool + ',' + poolSize + ',a,' + P1Hand +')';
    this.board.scene.client.getPrologRequest(command, this.updatePool1Hand, 1, this);
}

Game.prototype.addTilePlayer2Hand = function() {
    var P2Hand = this.board.p2Hand;
    var pool = this.pool;
    var poolSize = this.poolSize;

    var command = 'addPlayerTile(' + pool + ',' + poolSize + ',b,' + P2Hand +')';
    this.board.scene.client.getPrologRequest(command, this.updatePool2Hand, 1, this);
}

Game.prototype.player1Move = function(){
    var line = this.target["line"];
    var col = this.target["col"];
    var type = this.selectedTile.constructor.name;
    type = type.substring(type.length - 1);
    var direction = this.board.readDirection(this.selectedTile.direction, "t" + type);
    var tile = 'tile(a,t' + type + ',' + direction + ')';

    var command = 'playerTurn(' + this.board.board + ',' + this.board.p1Hand + ',a,' + line + ',' + col + ',' + tile + ')';
    this.board.scene.client.getPrologRequest(command, this.board.updateBoard, 1, this);
}

Game.prototype.player2Move = function(){
    var line = this.target["line"];
    var col = this.target["col"];
    var type = this.selectedTile.constructor.name;
    type = type.substring(type.length - 1);
    var direction = this.board.readDirection(this.selectedTile.direction, "t" + type);
    var tile = 'tile(b,t' + type + ',' + direction + ')';

    var command = 'playerTurn(' + this.board.board + ',' + this.board.p1Hand + ',b,' + line + ',' + col + ',' + tile + ')';
    this.board.scene.client.getPrologRequest(command, this.board.updateBoard, 1, this);
}


Game.prototype.updatePool1Hand = function(data) {
    var response = data.target.response;
    response = response.split("],");
    var pool = response[0];
    pool = pool.substring(1);
    pool += "]";
    var newHand = response[1];
    newHand = newHand.substring(0, newHand.length - 1);

    this.scene.pool = pool;
    this.scene.poolSize--;
    this.scene.board.p1Hand = newHand;

    newHand = newHand.substring(1);
    newHand = newHand.split("),");
    this.scene.board.loadPlayerTiles(newHand, []);
    console.log(this.scene.board.p1Tiles);
}

Game.prototype.updatePool2Hand = function(data) {
    var response = data.target.response;
    response = response.split("],");
    var pool = response[0];
    pool = pool.substring(1);
    pool += "]";
    var newHand = response[1];
    newHand = newHand.substring(0, newHand.length - 1);

    this.scene.pool = pool;
    this.scene.poolSize--;
    this.scene.board.p2Hand = newHand;

    newHand = newHand.substring(1);
    newHand = newHand.split("),");
    this.scene.board.loadPlayerTiles([], newHand);
    this.scene.updateStatus();
}

Game.prototype.updateStatus = function(data){
    if(data == null){
        var command = 'gameEnded(' + this.board.board + ')';
        this.board.scene.client.getPrologRequest(command, this.updateStatus, 1, this);
    }
    else {
        var response = data.target.response;
        if(this.response == "true")
            this.scene.state = 4;

        var command = 'getScore(' + this.scene.board.board + ')';
        this.scene.board.scene.client.getPrologRequest(command, this.scene.updateScore, 1, this.scene);
    }

}

Game.prototype.updateScore = function(data) {
    var response = data.target.response;

    response = response.split(",");
    response[0] = response[0].substring(1);
    response[1] = response[1].substring(0, response[1].length - 1);
    this.scene.scoreA = parseInt(response[0]);
    this.scene.scoreB = parseInt(response[1]);
}

Game.prototype.undoMove = function(){
    if(this.boardStack.length > 0){
        this.board = this.boardStack.pop();
        this.scene.board = this.board;
        this.tilesPlaced--;
        if(this.mode == 1 && this.tilesPlaced > 3)
            this.tilesPlaced--;
        this.updateState();
    }
}

Game.prototype.updateState = function(){
    if (this.tilesPlaced == 0 || this.tilesPlaced == 1) {
        this.state = 0;
        this.board.setPickableMatrix(true);
        this.board.setPickableP1Tiles(false);
        this.board.setPickableP2Tiles(false);
    }
    else if (this.tilesPlaced == 2) {
        this.state = 1;
        this.board.setPickableMatrix(true);
        this.board.setPickableP1Tiles(false);
        this.board.setPickableP2Tiles(false);
    }
    else if (this.tilesPlaced % 2 == 0) {
        this.state = 3;
        this.board.setPickableMatrix(false);
        this.board.setPickableP1Tiles(false);
        this.board.setPickableP2Tiles(true);
    }
    else {
        this.state = 2;
        this.board.setPickableMatrix(false);
        this.board.setPickableP1Tiles(true);
        this.board.setPickableP2Tiles(false);
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

/**
 * Board
 * @constructor
 */

function Board(scene) {
    CGFobject.call(this, scene);


    this.matrix = new Array(6);
    this.inc = 1.67 / 2;
    for (var i = 0; i < this.matrix.length; i++) {
        this.matrix[i] = new Array(6);
    }

    for (var i = 0; i < this.matrix.length; i++) {
        for (var j = 0; j < this.matrix.length; j++) {
            this.matrix[i][j] = new Piece(scene, 1 + i*this.matrix.length + j);
        }
    }

	this.p1Tiles = new Array(3);
	this.p2Tiles = new Array(3);
    this.tiles = [];
    this.board = [];
    this.p1Hand = [];
    this.p2Hand = [];

    this.setPickableMatrix(true);

};

Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor = Board;

Board.prototype.display = function() {
    this.scene.pushMatrix();
    this.scene.scale(0.4,1,0.4);
    this.scene.rotate(-Math.PI/2,1,0,0);
    this.scene.translate(7.5, -11.67, 1.15); // esta ok
    for (var i = 0; i < this.matrix.length; i++) {
        for (var j = 0; j < this.matrix.length; j++) {

            this.scene.pushMatrix();
            this.scene.translate(this.inc * j, this.inc * i, 0);
            this.matrix[i][j].display();
            this.scene.popMatrix();
        }
    }

    this.scene.popMatrix();

    this.scene.pushMatrix();

    this.scene.scale(0.4,0.4,0.4);
    this.scene.rotate(-Math.PI/2, 1, 0, 0);
    this.scene.translate(7.5,-7.24,2.86);

    this.scene.pushMatrix();
    this.scene.translate(0,-0.26,0);
    for(var i = 0; i < this.tiles.length; i++){
        this.tiles[i].display();
    }
    this.scene.popMatrix();

    for(var i = 0; i < this.p1Tiles.length; i++){
        this.p1Tiles[i].display();
    }
    for(var i = 0; i < this.p2Tiles.length; i++){
        this.p2Tiles[i].display();
    }

    this.scene.popMatrix();
};

Board.prototype.getBoard = function() {
    return this.matrix;
}

Board.prototype.setBoard = function(matrix) {
    this.matrix = matrix;
}

Board.prototype.setPickableMatrix = function(pickable){
	for (var i = 0; i < this.matrix.length; i++)
        for (var j = 0; j < this.matrix.length; j++)
            this.matrix[i][j].piece.selectable = pickable;
}

Board.prototype.setPickableP1Tiles = function(pickable){
    for(var i = 0; i < this.p1Tiles.length; i++){
        this.p1Tiles[i].selectable = pickable;
    }
}

Board.prototype.setPickableP2Tiles = function(pickable){
    for(var i = 0; i < this.p2Tiles.length; i++){
        this.p2Tiles[i].selectable = pickable;
    }
}

Board.prototype.loadPlayerTiles = function(playerATiles, playerBTiles){
    if(playerATiles.length > 0)
        this.p1Tiles = [];
    if(playerBTiles.length > 0)
        this.p2Tiles = [];

    for(var i = 0; i < playerATiles.length; i++){
        var player = playerATiles[i].substring(5,6);
        var type = playerATiles[i].substring(7, 9);
        var tile = this.createTile(type, this.scene, 50 + i, player);
        tile.line = -1;
        tile.col = i;
        tile.selectable = false;
        this.p1Tiles[i] = tile;
    }

    for(var i = 0; i < playerBTiles.length; i++){
        var player = playerBTiles[i].substring(5,6);
        var type = playerBTiles[i].substring(7, 9);
        var tile = this.createTile(type, this.scene, 60 + i, player);
        tile.line = -2;
        tile.col = i;
        tile.selectable = false;
        this.p2Tiles[i] = tile;
    }
}

Board.prototype.createTile = function(type, scene, id, player){
    switch (type) {
        case "t1":
            return new Tile1(scene, id, player);
            break;
        case "t2":
            return new Tile2(scene, id, player);
            break;
        case "t3":
            return new Tile3(scene, id, player);
            break;
        case "t4":
            return new Tile4(scene, id, player);
            break;
        case "t8":
            return new Tile8(scene, id, player);
            break;
        case "t10":
            return new Tile10(scene, id, player);
            break;
        default:
            return new Tile0(scene, id);

    }
}

Board.prototype.loadTiles = function(board){
    this.tiles = [];
    for (var i = 0; i < board.length; i++){
        for (var j = 0; j < board[i].length; j++){
            var player = board[i][j].split(",")[0];
            var type = board[i][j].split(",")[1];
            var direction = board[i][j].split(",")[2].substring(0,1);
            direction = this.readDirection(direction, type);
            if (type != "e") {
                var tile = this.createTile(type, this.scene ,i*6 + j+100, player);
                tile.line = i;
                tile.col = j;
                tile.direction = direction;
                this.tiles.push(tile);
            }
        }
    }
}

Board.prototype.readDirection = function(direction, type){
    if(type == "t2"){
        if(direction == "r")
            return 1;
        else if (direction == 1)
            return "r";
        else if (direction == 0)
            return "l";
        return 0;
    }
    switch (direction) {
        case "u":
            return 2;
            break;
        case "d":
            return 0;
            break;
        case "l":
            return 3;
            break;
        case "r":
            return 1;
            break;
        case 0:
            return "d";
            break;
        case 1:
            return "r";
            break;
        case 2:
            return "u";
            break;
        case 3:
            return "l";
            break;
        default:
            return 0;
            break;
    }
}


Board.prototype.updateBoard = function(data){
    var response = data.target.response;

    if(response == this.scene.board.board)
        return;

    this.scene.board.board = response;

    response = response.split("],");
    response[0] = response[0].substring(1);
    response[5] = response[5].substring(0, response[5].length - 2);
    for(var i = 0; i < response.length; i++)
    {
        response[i] = response[i].substring(1);
        response[i] = response[i].split("),");
        for(var j = 0; j < response[i].length; j++)
            response[i][j] = response[i][j].substring(5);
    }

    this.scene.board.loadTiles(response);

    this.scene.passTurn();
}

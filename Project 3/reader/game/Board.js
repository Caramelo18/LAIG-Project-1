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
            this.matrix[i][j] = new Piece(scene, i*this.matrix.length + j);

        }
    }

	this.setPickableMatrix(false);

	this.p1Tiles = new Array(3);
	this.p2Tiles = new Array(3);

};

Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor = Board;

Board.prototype.display = function() {
    this.scene.pushMatrix();
    this.scene.translate(0, -4.17, 0); // esta ok
    for (var i = 0; i < this.matrix.length; i++) {
        for (var j = 0; j < this.matrix.length; j++) {

            this.scene.pushMatrix();
            this.scene.translate(this.inc * j, this.inc * i, 0);
            this.matrix[i][j].display();
            this.scene.popMatrix();
        }
    }

    this.scene.popMatrix();

    //console.log(this.p1Tiles.length);
    for(var i = 0; i < this.p1Tiles.length; i++){
        this.p1Tiles[i].display();
        this.p2Tiles[i].display();
    }

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

Board.prototype.loadPlayerTiles = function(playerATiles, playerBTiles){
    for(var i = 0; i < playerATiles.length; i++){
        var type = playerATiles[i].substring(7, 9);
        var tile = this.createTile(type, this.scene, 50 + i);
        tile.line = -1;
        tile.col = i;
        this.p1Tiles[i] = tile;
    }

    for(var i = 0; i < playerBTiles.length; i++){
        var type = playerBTiles[i].substring(7, 9);
        var tile = this.createTile(type, this.scene, 60 + i);
        tile.line = -2;
        tile.col = i;
        this.p2Tiles[i] = tile;
    }
}

Board.prototype.createTile = function(type, scene, id){
    switch (type) {
        case "t1":
            return new Tile1(scene, id);
            break;
        case "t2":
            return new Tile2(scene, id);
            break;
        case "t3":
            return new Tile3(scene, id);
            break;
        case "t4":
            return new Tile4(scene, id);
            break;
        case "t8":
            return new Tile8(scene, id);
            break;
        default:
            return new Tile0(scene, id);

    }
}

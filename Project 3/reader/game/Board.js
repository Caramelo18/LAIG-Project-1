/**
* Board
* @constructor
*/

function Board(scene) {
	CGFobject.call(this,scene);


  this.matrix=new Array(6);
	this.inc = 1.67 /2;
  for (var i = 0; i < this.matrix.length; i++) {
    this.matrix[i]=new Array(6);
  }

	var id=0;
  for (var i = 0; i < this.matrix.length; i++) {
    for (var j = 0; j < this.matrix.length; j++) {
      this.matrix[j][i] = new  Tile1(scene);

    }
  }

};

Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor = Board;

Board.prototype.display = function () {
	this.scene.pushMatrix();
	this.scene.translate(0,-4.2,0); // esta ok
		for (var i = 0; i < this.matrix.length; i++) {
			for (var j= 0; j < this.matrix.length; j++) {

				this.scene.pushMatrix();
					this.scene.translate(this.inc * i ,this.inc * j ,0);
					this.matrix[i][j].display();
				this.scene.popMatrix();
		}
	}

	this.scene.popMatrix();

};

Board.prototype.getBoard = function (){
	return this.matrix;
}

Board.prototype.setBoard = function (matrix){
	this.matrix = matrix;
}

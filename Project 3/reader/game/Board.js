/**
* Board
* @constructor
*/

function Board(scene) {
	CGFobject.call(this,scene);


  this.matrix=new Array(6);

  for (var i = 0; i < this.elements.length; i++) {
    this.matrix[i]=new Array(6);
  }

	var id=0;
  for (var i = 0; i < this.elements.length; i++) {
    for (var j = 0; j < this.elements.length; j++) {
      this.matrix[j][i] = new  Element(scene,id++);

    }
  }

};

Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor = Board;

Board.prototype.display = function () {

};

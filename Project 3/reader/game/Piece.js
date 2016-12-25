/**
* Piece
* @constructor
*/

function Piece(scene, id) {
	CGFobject.call(this,scene);

	this.selectable = true;
  	this.selected = false;
  	this.visible = false;
	this.piece = new Tile0(scene, id);
	this.id = id;

};

Piece.prototype = Object.create(CGFobject.prototype);
Piece.prototype.constructor = Piece;

Piece.prototype.display = function () {
		this.scene.pushMatrix();

			if(this.selectable)
				this.scene.registerForPick(this.id,this);

			this.piece.display();

			if(this.selectable)
				this.scene.clearPickRegistration();

		this.scene.popMatrix();

};

Piece.prototype.setSelected = function (selected) {
  this.selected = selected;
};

Piece.prototype.setVisible = function (visible) {
  this.visible = visible;
};

Piece.prototype.setPiece = function (piece) {
  this.piece = piece;
};

Piece.prototype.getPiece = function () {
  return this.piece;
};

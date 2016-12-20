/**
* Piece
* @constructor
*/

function Piece(scene) {
	CGFobject.call(this,scene);

  this.selected = false;
  this.visible = true;
  this.piece = null;


};

Piece.prototype = Object.create(CGFobject.prototype);
Piece.prototype.constructor = Piece;

Piece.prototype.display = function () {

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

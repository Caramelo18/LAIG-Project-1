function  ChessBoard(scene, du, dv, textureRef, su, sv, controlPoints, c1, c2, cs){
 CGFobject.call(this,scene);

 this.du = du;
 this.dv = dv;
 this.textureRef = textureRef;
 this.su = su;
 this.sv = sv;
 this.c1 = c1;
 this.c2 = c2;
 this.cs = cs;

 var dimension = 1.0;

 this.chessShader = new CGFShader(this.gl,"Shaders/chess.vert", "Shaders/chess.frag");
 this.plane = new Plane(this.scene, dimension, dimension, this.du, this.dv);

};

ChessBoard.prototype = Object.create(CGFobject.prototype);
ChessBoard.prototype.constructor = ChessBoard;

ChessBoard.prototype.display = function(){
    this.scene.pushMatrix();

      this.setActiveShader(this.chessShader);
      this.plane.display();

    this.scene.popMatrix();
}

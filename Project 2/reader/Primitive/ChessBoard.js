function  ChessBoard(scene, du, dv, texture, su, sv, controlPoints, c1, c2, cs){
 CGFobject.call(this,scene);

 this.du = du;
 this.dv = dv;
 this.texture = texture;
 this.su = su;
 this.sv = sv;
 this.c1 = c1;
 this.c2 = c2;
 this.cs = cs;

 // se alguma casa tiver selecionada (0,5), se nao (-1,-1)

 var dimension = 1.0;
 var offX = dimension/this.du;
 var offY = dimension/this.dv;


 this.chessShader = new CGFshader(this.scene.gl,"Shaders/chess.vert", "Shaders/chess.frag");


 this.chessShader.setUniformsValues({uSampler: 1})
 this.chessShader.setUnifomrsValues({c1:this.c1});
 this.chessShader.setUnifomrsValues({c2:this.c2});
 this.chessShader.setUnifomrsValues({cs:this.cs});
 this.chessShader.setUnifomrsValues({offSetX:offX});
 this.chessShader.setUnifomrsValues({offSetY:offY});

 this.plane = new Plane(this.scene, dimension, dimension, this.du, this.dv);

};

ChessBoard.prototype = Object.create(CGFobject.prototype);
ChessBoard.prototype.constructor = ChessBoard;

ChessBoard.prototype.display = function(){

    this.scene.pushMatrix();
      this.texture.bind(1);
      this.setActiveShader(this.chessShader);
      this.plane.display();

    this.scene.popMatrix();
}

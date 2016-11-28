function  ChessBoard(scene, du, dv, texture, su, sv, c1, c2, cs){
 CGFobject.call(this,scene);
 this.initBuffers();

 this.du = du;
 this.dv = dv;
 this.texture = texture;
 this.su = su;
 this.sv = sv;
 this.c1 = c1;
 this.c2 = c2;
 this.cs = cs;

 // se alguma casa tiver selecionada (0,5), se nao (-1,-1)

 var dimension = 5;
 var offX = dimension/this.du;
 var offY = dimension/this.dv;


 this.chessShader = new CGFshader(this.scene.gl,"Shaders/chess.vert", "Shaders/chess.frag");

 this.chessShader.setUniformsValues({uSampler: 1});

 this.chessShader.setUniformsValues({c1: [this.c1[0], this.c1[1], this.c1[2], this.c1[3]]});
 this.chessShader.setUniformsValues({c2: [this.c2[0], this.c2[1], this.c2[2], this.c2[3]]});
 this.chessShader.setUniformsValues({cs: [this.cs[0], this.cs[1], this.cs[2], this.cs[3]]});
 this.chessShader.setUniformsValues({distX: offX});
 this.chessShader.setUniformsValues({distY: offY});
 this.chessShader.setUniformsValues({su: this.su});
 this.chessShader.setUniformsValues({sv: this.sv});
 this.chessShader.setUniformsValues({du: this.du});
 this.chessShader.setUniformsValues({dv: this.dv});

 this.plane = new Plane(this.scene, dimension, dimension, this.du * 10 , this.dv * 10);

};

ChessBoard.prototype = Object.create(CGFobject.prototype);
ChessBoard.prototype.constructor = ChessBoard;

ChessBoard.prototype.display = function(){

      this.texture.bind(0);
      this.scene.setActiveShader(this.chessShader);
      this.plane.display();
      this.scene.setActiveShader(this.scene.defaultShader);
}

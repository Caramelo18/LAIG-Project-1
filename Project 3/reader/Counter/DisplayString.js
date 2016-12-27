function DisplayString(scene, word) {

	CGFobject.call(this,scene);
	this.scene = scene;

  this.word = word
	this.width = 0.7;
	this.height = 0.4;

	this.rectangle1 = new Rectangle(scene,-this.width/2,this.width/2,- this.height/2,this.height/2);

	this.font = new Font(scene);

};

DisplayString.prototype = Object.create(CGFobject.prototype);
DisplayString.prototype.constructor = DisplayString;


DisplayString.prototype.setWord = function(){
  this.word = number;
}


DisplayString.prototype.display = function() {


	var text = this.font.getAppearance();

	this.scene.setActiveShaderSimple(this.font.getShader());
	text.apply();

  for (var i = 0; i < this.word.length; i++) {
    this.scene.pushMatrix();
      this.scene.activeShader.setUniformsValues({'charCoords': this.font.getCharCoords(this.word[i])});
      this.scene.translate(this.width * i,0,0);
      this.rectangle1.display();
    this.scene.popMatrix();
  }
}

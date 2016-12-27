function DisplayNumber(scene, value) {

	CGFobject.call(this,scene);
	this.scene = scene;

	this.lastCurrTime = -1;

	this.number = value;
	this.width = 0.7;
	this.height = 0.4;

	this.rectangle1 = new Rectangle(scene,-this.width/2,this.width/2,- this.height/2,this.height/2);
	this.rectangle2 = new Rectangle(scene,-this.width/2,this.width/2,- this.height/2,this.height/2);


	this.leftNumber = null;
	this.rightNumber = null;

	this.parseNumber();
	this.font = new Font(scene);

};

DisplayNumber.prototype = Object.create(CGFobject.prototype);
DisplayNumber.prototype.constructor = DisplayNumber;


DisplayNumber.prototype.setNumber = function(number){
  this.number = number;
}

DisplayNumber.prototype.parseNumber = function(){

	var left = this.number / 10;
	var right = this.number % 10;
	this.leftNumber = left.toString();
	this.rightNumber = right.toString();
}

DisplayNumber.prototype.update = function(currTime) {
		var delta;


		if (this.lastCurrTime == -1) {
      delta = 0;
			this.lastCurrTime = 0;
    }
    else {
      delta = (currTime - this.lastCurrTime) ;
    }

    this.lastCurrTime = currTime;

		console.log(this.number);
    this.number -= delta;

		this.parseNumber();

};


DisplayNumber.prototype.display = function() {


	var text = this.font.getAppearance();

	this.scene.setActiveShaderSimple(this.font.getShader());
	text.apply();

	if(this.leftNumber != "0"){
		this.scene.pushMatrix();
			this.scene.activeShader.setUniformsValues({'charCoords': this.font.getCharCoords(this.leftNumber)});
			this.rectangle1.display();
		this.scene.popMatrix();
	}

	this.scene.pushMatrix();
		this.scene.activeShader.setUniformsValues({'charCoords': this.font.getCharCoords(this.rightNumber)});
		this.scene.translate(this.width,0,0);
		this.rectangle2.display();
	this.scene.popMatrix();
}

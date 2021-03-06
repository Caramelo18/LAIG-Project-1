function Placard(scene) {

	CGFobject.call(this,scene);
	this.scene = scene;

	this.cube = new Cube(scene, -0.5,0.5, -0.5,0.5);
  	this.timer = new DisplayNumber(scene,45);
  	this.score1 = new DisplayNumber(scene, 0);
  	this.score2 = new DisplayNumber(scene, 0);
	this.timerWord = new DisplayString(scene, "TIMER");
	this.scoreWord = new DisplayString(scene, "SCORE");

	this.backgroundAppearance =  new CGFappearance(scene);
	this.backgroundAppearance.setAmbient(0, 0, 0, 1);
	this.backgroundAppearance.setDiffuse(0.0, 0.0, 0.0, 1);
	this.backgroundAppearance.setSpecular(0.0, 0.0, 0.0, 1);
	this.backgroundAppearance.setShininess(120);



};

Placard.prototype = Object.create(CGFobject.prototype);
Placard.prototype.constructor = Placard;

Placard.prototype.display = function(){

	for (var i = 0; i < 2; i++) {
		this.scene.pushMatrix();
			this.scene.scale(0.5,0.5,0.5);
			this.scene.translate(1.6,1.8,6);
			if(i == 0){
				this.scene.translate(1.2,1.15,0);
				this.scene.rotate(Math.PI/6,0,1,0);
			}
			else{
				this.scene.translate(7.7,1.15,0);
				this.scene.rotate(Math.PI/6 + Math.PI,0,1,0);
			}
			this.backgroundAppearance.apply();

			this.scene.pushMatrix();
				this.scene.scale(2.0,1.3,0.1);
		    this.cube.display();
		  this.scene.popMatrix();

		  this.scene.pushMatrix();
				this.scene.translate(-0.3,0.3,0.06);
		    this.timer.display();
		  this.scene.popMatrix();

		  this.scene.pushMatrix();
				this.scene.translate(-0.6,-0.3,0.06);
				this.scene.scale(0.5,0.5,1);
		    this.score1.display();
		  this.scene.popMatrix();

		  this.scene.pushMatrix();
				this.scene.translate(0.3,-0.3,0.06);
				this.scene.scale(0.5,0.5,1);
		    this.score2.display();
		  this.scene.popMatrix();

			this.scene.pushMatrix();
				this.scene.translate(-0.45,0.55,0.06);
				this.scene.scale(0.3,0.3,1);
				this.timerWord.display();
			this.scene.popMatrix();

			this.scene.pushMatrix();
				this.scene.translate(-0.45,-0.05,0.06);
				this.scene.scale(0.3,0.3,1);
				this.scoreWord.display();
			this.scene.popMatrix();

		this.scene.popMatrix();
	}
}

Placard.prototype.resetTimer = function() {
	this.timer.setNumber(45);
}

Placard.prototype.update= function(currTime){
		this.timer.update(currTime);
}

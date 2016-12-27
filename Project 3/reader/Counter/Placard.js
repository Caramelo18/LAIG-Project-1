function Placard(scene, value) {

	CGFobject.call(this,scene);
	this.scene = scene;

  this.timer = new DisplayNumber(scene,20);
  this.score1 = new DisplayNumber(scene, 0);
  this.score2 = new DisplayNumber(scene, 0);

};

Placard.prototype = Object.create(CGFobject.prototype);
Placard.prototype.constructor = Placard;

Placard.prototype.display(){

  this.scene.pushMatrix();
    this.timer.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.score1.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.score2.display();
  this.scene.popMatrix();


}

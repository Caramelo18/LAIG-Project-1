function Timer(scene, maxTime) {

	CGFobject.call(this,scene);
	this.scene = scene;
  this.maxTime = 20;
  this.time = 10;
  this.radius = 0.3;
  this.cylinder = new Cylinder(scene, this.radius ,this.radius,0.1,15,1);
  this.pointer = new Cylinder(scene, 0.01 ,0.01,this.radius,15,1);


  this.materialPointer = new CGFappearance(this.scene);
  this.materialPointer.setAmbient(0.3,0.3,0.3,1);
  this.materialPointer.setDiffuse(0, 0, 0,1);
  this.materialPointer.setSpecular(0.1,0.1,0.1,1);
  this.materialPointer.setShininess(120);
};

Timer.prototype = Object.create(CGFobject.prototype);
Timer.prototype.constructor = Timer;


Timer.prototype.setMaxTime = function(max){
  this.maxTime = max;
}

Timer.prototype.setTime = function(time){
  this.time = time;
}

Timer.prototype.display = function(){

  this.scene.pushMatrix();
    this.cylinder.display();

    this.scene.pushMatrix();
      this.scene.rotate(-Math.PI/2,1,0,0);
    //  this.scene.rotate(-Math.PI*2* this.time/this.maxTime, 1,0,0);
      this.materialPointer.apply();
      this.pointer.display();
    this.scene.popMatrix();

  this.scene.popMatrix();

}

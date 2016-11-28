/**
* vehicle
* @constructor
*/

function Vehicle(scene) {
 CGFobject.call(this,scene);

var controlPoints = [
[-0.048,	-0.491,	-0.000,1],
[-0.048,	-0.491,	-0.000,1],
[-0.048,	-0.491,	0.000,1],
[-0.048,	-0.491,	-0.000,1],
[-0.048,	-0.491,	-0.000,1],
[-0.048,	-0.491,	-0.000,1],

[0.000,	-1.000,	0.400,1],
[-1.000,	1.000,	0.400,1],
[-1.000,	-1.000,	0.400,1],
[1.000,	1.000,	0.400,1],
[1.000,	-1.000,	0.400,1],
[0.000,	-1.000,	0.400,1],

[0.000,	-1.000,	0.800,1],
[-1.000,	-1.000,	0.800,1],
[1.000,	1.000,	0.800,1],
[-1.000,	1.000,	0.800,1],
[1.000,	-1.000,	0.800,1],
[0.000,	-1.000,	0.800,1],

[0.000,	-1.000,	1.200,1],
[-1.000,	1.000,	1.200,1],
[-1.000, -1.000,	1.200,1],
[1.000,	1.000,	1.200,1],
[1.000,	-1.000,	1.200,1],
[0.000,	-1.000,	1.200,1],

[0.000,	-1.000,	1.600,1],
[-1.000,	-1.000,	1.600,1],
[-1.000, 1.000,	1.600,1],
[1.000,	1.000,	1.600,1],
[1.000,	-1.000,	1.600,1],
[0.000,	-1.000,	1.600,1],

[0.000,	-1.000,	2.000,1],
[-1.000,	-1.000,	2.000,1],
[-1.000	,1.000,	2.000,1],
[1.000,	1.000,	2.000,1],
[1.000,	-1.000,	2.000,1],
[0.000,	-1.000,	2.000,1]];


 var partsU = 20;
 var partsV = 20;


 this.patch1 = new Patch(this.scene, 5, 5, partsU, partsV,controlPoints);

 this.patchAppereance = new CGFappearance(this.scene);
 this.patchAppereance.loadTexture("../textures/airPlane.jpg");

 this.torus = new Torus(scene, 0.4, 1, 30, 30);

 this.base = new VTriangle(scene, 0, 0, 0, 0, 0.9, 0, 0, 0, 2);
};

Vehicle.prototype = Object.create(CGFobject.prototype);
Vehicle.prototype.constructor = Vehicle;

Vehicle.prototype.display = function () {

  this.scene.pushMatrix();
    this.scene.translate(0, 0, 1);
    this.torus.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.base.display();
    this.scene.rotate(Math.PI/2, 0,0,1);
    this.base.display();
    this.scene.rotate(Math.PI/2, 0,0,1);
    this.base.display();
    this.scene.rotate(Math.PI/2, 0,0,1);
    this.base.display();
  this.scene.popMatrix();


  this.scene.pushMatrix();
    this.patchAppereance.apply();
    this.scene.translate(0,0,4);
    this.scene.rotate(Math.PI,0,1,0);
    this.scene.translate(0,0.5,0);
    this.patch1.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.patchAppereance.apply();
    this.scene.translate(0,0.5,0);
    this.patch1.display();
  this.scene.popMatrix();


};

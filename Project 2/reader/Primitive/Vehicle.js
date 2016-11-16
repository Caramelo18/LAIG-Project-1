/**
* vehicle
* @constructor
*/

function Vehicle(scene) {
 CGFobject.call(this,scene);

var controlPoints = [
  [ -1.0, -1.0, 0.0, 1 ],
  [ -1.0,  1.0, 0.0, 1 ],
  [ 0, -1.0, 1.8, 1 ],
  [ 0,  1.0, 1.8, 1 ]	,
  [ 1.0, -1.0, 0.0, 1 ],
  [ 1.0,  1.0, 0.0, 1 ]
];

var partsU = 4;
var partsV = 4;

 this.patch1 = new Patch(this.scene, 2 , 1, partsU, partsV,controlPoints);
 this.plane = new Plane(this.scene, 2, 2, partsU, partsV);
 this.triangle = new Triangle(this.scene ,1 ,0, 0 , -1, 0, 0, 0,1,0);
};

Vehicle.prototype = Object.create(CGFobject.prototype);
Vehicle.prototype.constructor = Vehicle;

Vehicle.prototype.display = function () {

  this.scene.pushMatrix() ;
    this.patch1.display();
  this.scene.popMatrix();

  this.scene.pushMatrix() ;
    this.scene.rotate(Math.PI, 1 ,0, 0);
    this.plane.display();
  this.scene.popMatrix();

  this.scene.pushMatrix() ;
    this.scene.translate(0,1,0);
    this.triangle.display();
  this.scene.popMatrix();

};

/**
* vehicle
* @constructor
*/

function Vehicle(scene) {
 CGFobject.call(this,scene);
/*
var controlPoints = [
  [ -1.0, -1.0, 0.0, 1 ],
  [ -1.0,  1.0, 0.0, 1 ],
  [ 0, -1.0, 1.8, 1 ],
  [ 0,  1.0, 1.8, 1 ]	,
  [ 1.0, -1.0, 0.0, 1 ],
  [ 1.0,  1.0, 0.0, 1 ]
];
*/

var controlPoints =[[-1.275	,	-1.496	,-1.289,1],
                    [-1.895,	1.458,	-0.823,1],
                    [-1.159	,0.617,	-0.336,1],
                    [-1.206,	1.680,	0.530,1],
                    [-0.500,	-1.500,-1.000,1],
                    [-0.592,	1.157,	0.238,1],
                    [0.011,	1.436	,-0.843,1],
                    [-0.779	,1.695,	0.050,1]];

 var partsU = 20;
 var partsV = 20;
 var slices = 18;
 var stacks = 10;
 this.patch1 = new Patch(this.scene, 1 , 3, partsU, partsV,controlPoints);
 this.circle  = new Circle(this.scene, 1,slices);
 this.cylinder = new CylinderSide(this.scene, 1 , 1 , 3 ,slices,stacks);
 this.head = new Cylinder(this.scene, 1,0,2,slices,stacks);
 this.torus = new Torus(this.scene,0.5,1,slices,stacks);
};

Vehicle.prototype = Object.create(CGFobject.prototype);
Vehicle.prototype.constructor = Vehicle;

Vehicle.prototype.display = function () {

  this.scene.pushMatrix();
    this.scene.rotate(Math.PI , 0,1,0);
    this.circle.display();
  this.scene.popMatrix();

  this.scene.pushMatrix() ;
    this.cylinder.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.scene.translate(0,0,3);
    this.head.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.scene.translate(0,0,-0.6);
    this.torus.display();
  this.scene.popMatrix();

/*
  this.scene.pushMatrix();
    this.scene.rotate(Math.PI / 2, 1,1,1);
    this.scene.rotate(Math.PI / 4,1,1,0);
    this.patch1.display();
  this.scene.popMatrix();
*/

};

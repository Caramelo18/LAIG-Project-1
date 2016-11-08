function Plane(scene, dimX, dimY, partsX, partsY){
  CGFobject.call(this,scene);

  this.dimX = dimX;
  this.dimY = dimY;
  this.partsX = partsX;
  this.partsY = partsY;
  this.order = 1;

  var controlPoints = [
                        [0,0,0],
                        [this.dimX,0,0],
                        [0, this.dimY,0],
                        [this.dimX, this.dimY,0]
                      ];

  this.plane = new Patch(this.scene, this.order, this.order, this.partsX, this.partsY, controlPoints);
}

Plane.prototype = Object.create(CGFobject.prototype);
Plane.prototype.constructor = Plane;


Plane.prototype.display = function () {
  this.plane.display();
};

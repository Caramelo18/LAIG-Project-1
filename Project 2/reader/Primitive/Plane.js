function Plane(scene, dimX, dimY, partsX, partsY){
  CGFobject.call(this,scene);

  this.dimX = dimX;
  this.dimY = dimY;
  this.partsX = partsX;
  this.partsY = partsY;
}

Plane.prototype = Object.create(CGFobject.prototype);
Plane.prototype.constructor = Plane;

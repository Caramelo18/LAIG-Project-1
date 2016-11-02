function Patch(scene, orderU, orderV, partsU, partsV, contPoints) {
 CGFobject.call(this,scene);

 this.orderU = orderU;
 this.orderV = orderV;
 this.partsU = partsU;
 this.partsV = partsV;
 this.controlPoints = contPoints;
};

Patch.prototype = Object.create(CGFobject.prototype);
Patch.prototype.constructor = Patch;

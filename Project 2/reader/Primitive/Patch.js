function Patch(scene, orderU, orderV, partsU, partsV, controlPoints) {
 CGFobject.call(this,scene);

 this.orderU = orderU;
 this.orderV = orderV;
 this.partsU = partsU;
 this.partsV = partsV;
 //this.controlPoints = controlPoints;
this.controlPoints = [[[-2.0, -2.0, 0.0, 1 ],
							 [-2.0,  2.0, 0.0, 1 ]],[[ 2.0, -2.0, 0.0, 1 ],
							 [ 2.0,  2.0, 0.0, 1 ]]];

 this.surface = this.makeSurface(orderU, orderV);
};

Patch.prototype = Object.create(CGFobject.prototype);
Patch.prototype.constructor = Patch;


Patch.prototype.getKnotsVector = function(order) {

	var v = [];
  var numberOfPoints = this.getNumberOfKnotPoints(order);
 console.log("points= " + numberOfPoints);
	for (var i=0; i<=numberOfPoints; i++) {
		v.push(Math.round(i/numberOfPoints));
	}

	return v;
}
//guilhermevpinto@gmail.com
Patch.prototype.makeSurface = function (degree1, degree2) {
  var knots1 = this.getKnotsVector(degree1);
  var knots2 = this.getKnotsVector(degree2);
  console.log(this.controlPoints);
  var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, this.controlPoints);

  console.log(nurbsSurface);
  getSurfacePoint = function(u, v) {
    return nurbsSurface.getPoint(u, v);
  };

  return new CGFnurbsObject(this.scene, getSurfacePoint, this.partsU, this.partsV );
};

Patch.prototype.display = function () {
  this.surface.display();
};

Patch.prototype.getNumberOfKnotPoints = function (order) {
  return order*2;
};

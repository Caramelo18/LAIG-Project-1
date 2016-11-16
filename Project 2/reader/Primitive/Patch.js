/**
* Patch
* @constructor
*/

function Patch(scene, orderU, orderV, partsU, partsV, controlPoints) {
 CGFobject.call(this,scene);

 this.orderU = orderU;
 this.orderV = orderV;
 this.partsU = partsU;
 this.partsV = partsV;
 this.controlPoints = controlPoints;
 this.controlVertexes = this.getControlVertexs();

 this.surface = this.makeSurface(orderU, orderV);
};

Patch.prototype = Object.create(CGFobject.prototype);
Patch.prototype.constructor = Patch;

Patch.prototype.getControlVertexs = function () {
  var arr = [];
  var counter = 0;

  for(var i = 0; i <= this.orderU; i++){
    var tmp = [];
    for(var j = 0; j <= this.orderV; j++){
      tmp.push(this.controlPoints[counter]);
      counter++;
    }
    arr.push(tmp);
  }

  return arr;
};
Patch.prototype.getKnotsVector = function(order) {

	var v = [];
  var numberOfPoints = (order + 1)*2;

//  console.log("points= " + numberOfPoints);

	for (var i=0; i<numberOfPoints; i++) {
		v.push(Math.round(i/numberOfPoints));
	}

	return v;
}
//guilhermevpinto@gmail.com
Patch.prototype.makeSurface = function (degree1, degree2) {
  var knots1 = this.getKnotsVector(degree1);
  var knots2 = this.getKnotsVector(degree2);

//  console.log(this.controlVertexes);

  var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, this.controlVertexes);

 // console.log(nurbsSurface);
  getSurfacePoint = function(u, v) {
    return nurbsSurface.getPoint(u, v);
  };

  return new CGFnurbsObject(this.scene, getSurfacePoint, this.partsU, this.partsV );
};

Patch.prototype.display = function () {
  this.surface.display();
};

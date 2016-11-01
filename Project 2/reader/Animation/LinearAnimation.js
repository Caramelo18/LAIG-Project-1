function LinearAnimation(id, controlPoints, time){
  this.init(id);
  this.controlPoints = controlPoints;
  this.time = time;
  this.totalDistance = 0;
  this.velocity = 0;
  setVariables();
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.setVariables = function () {
    calculateDistance();
    calculateVelocity();
};

LinearAnimation.prototype.calculateDistance = function () {

  this.totalDistance = 0;

  for (var i = 1; i < this.controlPoints.length; i++) {
      this.totalDistance += Math.sqrt(Math.pow(this.controlPoints[i][0] - this.controlPoints[i - 1][0], 2)+
                                      Math.pow(this.controlPoints[i][1] - this.controlPoints[i - 1][1], 2)+
                                      Math.pow(this.controlPoints[i][2] - this.controlPoints[i - 1][2], 2));
  }
};

LinearAnimation.prototype.calculateVelocity = function () {

  this.velocity = this.totalDistance/this.time;

};


LinearAnimation.prototype.calculateRotation = function(point1, point2){
  // rotation on y
  return Math.atan2(point2[0]- point1[0], point2[2] - point1[2]);

};

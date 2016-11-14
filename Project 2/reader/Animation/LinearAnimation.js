function LinearAnimation(id, controlPoints, time, scene){
  this.init(id);
  this.controlPoints = controlPoints;
  this.time = time;
//  this.totalDistance = this.calculateDistance();
//  this.velocity = this.calculateVelocity();
  this.currentControlPoint = 0;
  this.intermediatePoint = 0;
  this.currentPoint = this.controlPoints[0];
  this.scene = scene;

  this.calculateVectors();
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.calculateVectors = function() {
    this.vectors = [];

    for(var i = 1; i < this.controlPoints.length; i++){
        var vect = [];
        vect[0] = this.controlPoints[i][0] - this.controlPoints[i - 1][0];
        vect[1] = this.controlPoints[i][1] - this.controlPoints[i - 1][1];
        vect[2] = this.controlPoints[i][2] - this.controlPoints[i - 1][2];
        this.vectors.push(vect);
    }

    this.increments = [];
    var time = this.time /(this.controlPoints.length - 1);

    for(var i = 0; i < this.vectors.length; i++){
        this.increments[i] = this.calculateIncrement(this.vectors[i], time);
    }
    console.log(this.increments);
}

LinearAnimation.prototype.calculateIncrement = function (vector, time) {
    var inc = [];
    inc[0] = vector[0]/(60 * time); // TODO: change 30 - number of fps
    inc[1] = vector[1]/(60 * time);
    inc[2] = vector[2]/(60 * time);

    return inc;
};

LinearAnimation.prototype.animate = function() {
    if(this.currentControlPoint >= this.controlPoints.length - 1)
    {
        this.scene.translate(this.currentPoint[0],this.currentPoint[1], this.currentPoint[2]);
        return this.currentPoint;
    }

    this.currentPoint[0] += this.increments[this.currentControlPoint][0] ;
    this.currentPoint[1] += this.increments[this.currentControlPoint][1] ;
    this.currentPoint[2] += this.increments[this.currentControlPoint][2] ;

    //this.scene.translate(this.currentPoint[0],this.currentPoint[1], this.currentPoint[2]);
    var matrix = this.getTranslationMatrix(this.currentPoint[0], this.currentPoint[1], this.currentPoint[2]);

    this.scene.multMatrix(matrix);
    this.intermediatePoint++;

    if(this.currentPoint[this.currentControlPoint] > this.controlPoints[this.currentControlPoint + 1][0]) // TODO - not even close
    {
        this.currentControlPoint++;
        this.intermediatePoint = 0;
    }



    return this.currentPoint;
}
/*
LinearAnimation.prototype.calculateVelocity = function () {

  var vel = this.totalDistance/this.time;

  return vel;
};

LinearAnimation.prototype.calculateRotation = function(point1, point2){
  // rotation on y
  return Math.atan2(point2[0]- point1[0], point2[2] - point1[2]);

};

LinearAnimation.prototype.getTransformationMatrix = function(currentTime){
  var m = mat4.create();

  var dist = currentTime * this.velocity;
  var vec = [];
  vec[0] = this.controlPoints[this.currentPoint + 1][0] - this.controlPoints[this.currentPoint][0];
  vec[1] = this.controlPoints[this.currentPoint + 1][1] - this.controlPoints[this.currentPoint][1];
  vec[2] = this.controlPoints[this.currentPoint + 1][2] - this.controlPoints[this.currentPoint][2];


  mat4.translate(m,m,vec);
  mat4.rotate(m,m,this.calculateRotation(this.controlPoints[this.currentPoint], this.controlPoints[this.currentPoint+1]));
  this.currentPoint++;
  return m;
};*/

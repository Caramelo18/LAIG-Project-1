/*
    ArchAnimation constructor
*/
function ArchAnimation(tile, startingPoint, endPoint, scene){
  this.time = 2;
  this.elapsedTime = 0;
  this.scene = scene;

  this.height = 3;

  this.tile = tile;

  this.startingID = startingPoint;
  this.endID = endPoint;

  this.startPoint = [];
  this.endPoint = [];


  this.getCoordinates();
}

ArchAnimation.prototype = Object.create(Animation.prototype);
ArchAnimation.prototype.constructor = ArchAnimation;

ArchAnimation.prototype.getCoordinates = function() {
    this.endPoint = [-2.5, 1.666, 0];
    this.startPoint = [-2.5, 1.9, 0];

    this.endPoint[0] += this.tile.size * this.tile.col;
    this.endPoint[1] += (-this.tile.size) * this.tile.line;


    var col = this.startingID % 10;
    this.startPoint[0] += 1.26 + col *this.tile.size;
    if(Math.trunc(this.startingID / 10) == 5)
        this.startPoint[1] += -5.59;
    else if (Math.trunc(this.startingID / 10) == 6) {
        this.startPoint[1] += 0.91;
    }
    this.startPoint[2] = 0;

    this.devX = (this.endPoint[0] - this.startPoint[0]);
    this.devY = (this.endPoint[1] - this.startPoint[1]);

    this.startTime = this.scene.currTime;
    this.prevTime = this.startTime;

}

ArchAnimation.prototype.animate = function() {
    //this.scene.translate(this.endPoint[0], this.endPoint[1], this.endPoint[2]);
    var delta = this.scene.currTime - this.prevTime;
    this.prevTime = this.scene.currTime;
    this.elapsedTime = this.elapsedTime + delta;


    var currentX = this.startPoint[0] + this.devX * (this.elapsedTime / (this.time * 1000));
    var currentY = this.startPoint[1] + this.devY * (this.elapsedTime / (this.time * 1000));
    
    var x = (this.elapsedTime/1000) - 1;
    // (-x^2+1)*altura
    var currentZ = (-(x*x) + 1) * this.height;

    if(this.elapsedTime < this.time * 1000)
        this.scene.translate(currentX, currentY, currentZ);
    else {
        this.tile.animation = null;
    }

}
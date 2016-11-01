

function CircularAnimation(id,time, center, radius, startang, rotang){
  this.init(id);
  this.time = time;
  this.center = center;
  this.radius = radius;
  this.startang = startang;
  this.rotang = rotang;
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;



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

CircularAnimation.prototype.getTransformationMatrix = function(t){

  var m = mt4.create();

  mt4.tranlate(m,m,this.center);
  //mt4.rotate(m,m) E necessario passar os angulos em graus
  mt4.translate(m,m,[0,this.radius,0]);

  return m;
}

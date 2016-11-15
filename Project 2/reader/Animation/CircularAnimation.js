

function CircularAnimation(id,time, center, radius, startang, rotang, scene){
  this.init(id);
  this.time = time;
  this.center = center;
  this.radius = radius;
  this.startang = startang;
  this.rotang = rotang;
  this.scene = scene;

  this.calculateValues();
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.calculateValues = function()
{
    var deg2Rad = Math.PI / 180;
    this.incangle = (this.rotang * deg2Rad) / (60 * this.time);
    this.angle = this.startang *deg2Rad;
    this.rotang = this.rotang * deg2Rad;
    this.startang = this.startang * deg2Rad;
}
/*
CircularAnimation.prototype.getTransformationMatrix = function(t){

  var m = mt4.create();

  mt4.tranlate(m,m,this.center);
  //mt4.rotate(m,m) E necessario passar os angulos em graus
  mt4.translate(m,m,[0,this.radius,0]);

  return m;
}*/

CircularAnimation.prototype.animate = function(){
    /*    console.log("angle: "+ this.angle);
    console.log("start: "+ this.startang);
    console.log("rot: " + this.rotang);*/

/*    console.log(Math.cos(this.angle)*this.radius);
    console.log(Math.sin(this.angle) * this.radius);
    console.log(Math.sqrt( (Math.cos(this.angle)*this.radius * Math.cos(this.angle)*this.radius) +  (Math.sin(this.angle) * this.radius * Math.sin(this.angle) * this.radius)  ));
*/

    var mat1 = this.getTranslationMatrix(Math.sin(this.angle) * this.radius, 0 , Math.cos(this.angle)*this.radius);
    this.scene.multMatrix(mat1);
    var mat2 = this.getRotationMatrix("y", this.angle);
    this.scene.multMatrix(mat2);
    var mat3 = this.getTranslationMatrix(this.center[0], this.center[1], this.center[2]);
    this.scene.multMatrix(mat3);
/*
    var deg2Rad = Math.PI / 180;
    console.log(this.angle/deg2Rad);*/

    //this.scene.rotate(this.angle, 0,1,0);
    //this.scene.translate(Math.cos(this.angle)*this.radius, 0 , Math.sin(this.angle) * this.radius);
    //this.scene.translate(this.center[0], this.center[1], this.center[2]);
    if(this.angle > this.startang + this.rotang)
        return;

    this.angle += this.incangle;
}

/**
* Tile10
* @constructor
*/

function Tile10(scene, id, player) {
    CGFobject.call(this,scene);

    this.base = new Rectangle(scene, 0, 0.70, 0, 0.70);
    this.cylinder = new Cylinder(scene, 0.2, 0.2, 0.1, 20, 20);

    this.player = player;
    this.line = 0;
    this.col = 0;

    this.opacity = 1;

    this.baseApp = new CGFappearance(scene);
    this.baseApp.setDiffuse(0.3,0.3,0.3,this.opacity);

    this.cylApp = new CGFappearance(scene);
    if(this.player == "a")
        this.cylApp.loadTexture('../textures/pA.jpg');
    else
        this.cylApp.loadTexture('../textures/pB.jpeg');
    this.cylApp.setDiffuse(1,1,1,this.opacity);

    this.selectable = true;
    this.selected = false;
    this.visible = false;
    this.id = id;
    this.size = 5/6;


    this.firstTime = 0;
    this.stop = false;
};

Tile10.prototype = Object.create(CGFobject.prototype);
Tile10.prototype.constructor = Tile10;

Tile10.prototype.display = function () {
    if(this.selectable)
        this.scene.registerForPick(this.id,this);

    this.scene.pushMatrix();

    if(this.animation == null)
    {
        this.scene.translate(-2.5,1.666, 0); // place tile on 0,0

        if(this.line >= 0)
            this.scene.translate(this.size * this.col, -this.size * this.line, 0);
        else if (this.line == -1){
            this.scene.translate(1.26 + this.col * this.size, -5.59, 0);
        }
        else if (this.line == -2){
            this.scene.translate(1.26 + this.col * this.size, 0.91, 0);
        }
    }
    else
        this.animation.animate();

        this.scene.pushMatrix();

            this.scene.translate(0,0,0.02); //translation to avoid overlapping
            this.scene.translate(0.065, 0.065, 0); // center tile
            this.baseApp.apply();
            this.base.display();

            this.scene.translate(0.35,0.35,0);
            this.cylApp.apply();
            this.cylinder.display();

        this.scene.popMatrix();

    this.scene.popMatrix();

    if(this.selectable)
        this.scene.clearPickRegistration();
};

Tile10.prototype.update = function (time) {
  if(!this.stop){
    var delta;

    if(this.firstTime == 0){
      this.firstTime = time;
      delta = 0;
    }else{
      delta = (time - this.firstTime)/1000;
    }

    var duration = 1.5;

    if(delta < duration ){

      var perc = delta/duration;

    this.baseApp.setDiffuse(0.3,0.3,0.3,this.opacity * perc);
    this.cylApp.setDiffuse(1,1,1,this.opacity * perc);
  }
}
}

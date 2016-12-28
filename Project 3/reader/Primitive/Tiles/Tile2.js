/**
* Tile2
* @constructor
*/

function Tile2(scene, id, player) {
    CGFobject.call(this,scene);

    this.base = new Rectangle(scene, 0, 0.70, 0, 0.70);
    this.cylinder = new Cylinder(scene, 0.2, 0.2, 0.1, 20, 20);

    this.arrow = new Cylinder(scene, 0.05, 0.001, 0.2, 20, 20);

    this.direction = 0;

    this.line = 0;
    this.col = 0;

    this.player = player;

    this.baseApp = new CGFappearance(scene);
    this.baseApp.setDiffuse(0.3,0.3,0.3,1);

    this.cylApp = new CGFappearance(scene);
    if (player == "a")
        this.cylApp.setDiffuse(0.5,0,0,1);
    else
        this.cylApp.setDiffuse(0,0.5,0,1);

    this.arrowApp = new CGFappearance(scene);
    this.arrowApp.setDiffuse(1,1,1,1);

    this.selectable = true;
    this.selected = false;
    this.visible = false;
    this.id = id;
    this.size = 5/6;
};

Tile2.prototype = Object.create(CGFobject.prototype);
Tile2.prototype.constructor = Tile2;

Tile2.prototype.display = function () {
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

    this.scene.pushMatrix();
        this.scene.translate(0.42,0.42,0.05); //down left
        this.scene.rotate(Math.PI/2*this.direction - Math.PI/4, 0, 0, 1);
        this.scene.translate(0,-0.2,0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.arrowApp.apply();
        this.arrow.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0.4,0.4,0.05); //up right
        this.scene.rotate(Math.PI/2*(this.direction+2) - Math.PI/4, 0, 0, 1);
        this.scene.translate(0,-0.2,0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.arrowApp.apply();
        this.arrow.display();
    this.scene.popMatrix();

    this.scene.popMatrix();

    if(this.selectable)
        this.scene.clearPickRegistration();

};

Tile2.prototype.rotate = function(){
    this.direction++;
    if(this.direction > 1)
        this.direction = 0;
}

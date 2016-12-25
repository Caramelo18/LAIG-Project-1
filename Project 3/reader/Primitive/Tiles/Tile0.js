/**
* Tile1
* @constructor
*/

function Tile0(scene, id) {
    CGFobject.call(this,scene);

    this.base = new Rectangle(scene, 0, 0.70, 0, 0.70);
    this.direction = 0;


    this.baseApp = new CGFappearance(scene);
    this.baseApp.setDiffuse(0,0.3,0,0);
    this.baseApp.setSpecular(0.3,0.3,0.3,0);
    this.baseApp.setAmbient(0.2,0.2,0.2,0);



    this.selectable = true;
    this.selected = false;
    this.id = id;
    this.size = 5/6;
};

Tile0.prototype = Object.create(CGFobject.prototype);
Tile0.prototype.constructor = Tile0;

Tile0.prototype.display = function () {

    if(!this.selectable)
        return;

    this.scene.registerForPick(this.id, this);

    this.scene.pushMatrix();

    this.scene.translate(-2.5,1.666, 0); // place tile on 0,0

    this.scene.pushMatrix();

        this.scene.translate(0,0,0.001); //translation to avoid overlapping
        this.scene.translate(0.065, 0.065, 0); // center tile
        this.baseApp.apply();
        this.base.display();

    this.scene.popMatrix();
    this.scene.popMatrix();

    this.scene.clearPickRegistration();
};

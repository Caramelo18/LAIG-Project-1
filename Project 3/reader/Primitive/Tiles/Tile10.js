/**
* Tile10
* @constructor
*/

function Tile10(scene) {
    CGFobject.call(this,scene);

    this.base = new Rectangle(scene, 0, 0.70, 0, 0.70);
    this.cylinder = new Cylinder(scene, 0.2, 0.2, 0.1, 20, 20);


    this.line = 0;
    this.col = 0;


    this.baseApp = new CGFappearance(scene);
    this.baseApp.setDiffuse(0.3,0.3,0.3,1);

    this.cylApp = new CGFappearance(scene);
    this.cylApp.loadTexture('../textures/camo.jpg');

};

Tile10.prototype = Object.create(CGFobject.prototype);
Tile10.prototype.constructor = Tile10;

Tile10.prototype.display = function () {

    this.scene.translate(-2.5,1.666, 0); // place tile on 0,0
    this.scene.pushMatrix();

        this.scene.translate(0,0,0.01); //translation to avoid overlapping
        this.scene.translate(0.065, 0.065, 0); // center tile
        this.baseApp.apply();
        this.base.display();

        this.scene.translate(0.35,0.35,0);
        this.cylApp.apply();
        this.cylinder.display();

    this.scene.popMatrix();

};

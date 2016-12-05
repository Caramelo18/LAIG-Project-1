/**
* Tile1
* @constructor
*/

function Tile1(scene) {
    CGFobject.call(this,scene);

    this.base = new Rectangle(scene, 0, 0.70, 0, 0.70);
    this.cylinder = new Cylinder(scene, 0.2, 0.2, 0.1, 20, 20);

    this.arrow = new Cylinder(scene, 0.05, 0.001, 0.2, 20, 20);

    this.direction = 0;

    this.line = 0;
    this.col = 0;


    this.baseApp = new CGFappearance(scene);
    this.baseApp.setDiffuse(0.3,0.3,0.3,1);

    this.cylApp = new CGFappearance(scene);
    this.cylApp.setDiffuse(0.5,0,0,1);

    this.arrowApp = new CGFappearance(scene);
    this.arrowApp.setDiffuse(1,1,1,1);
};

Tile1.prototype = Object.create(CGFobject.prototype);
Tile1.prototype.constructor = Tile1;

Tile1.prototype.display = function () {
    this.scene.pushMatrix();

    this.scene.translate(-2.5,1.666, 0); // place tile on 0,0
    this.scene.translate(0,0,0.01); //translation to avoid overlapping
    this.scene.translate(0.065, 0.065, 0); // center tile
    this.baseApp.apply();
    this.base.display();

    this.scene.translate(0.35,0.35,0);
    this.cylApp.apply();
    this.cylinder.display();

    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(-2.22,2.22, 0); // place tile on 0,0
    this.scene.translate(0.0,-0.15,0.05);
    this.scene.rotate(Math.PI/2, 1,0,0);
    this.scene.rotate(Math.PI/2*this.direction, 0,1,0);
    this.arrowApp.apply();
    this.arrow.display();
    this.scene.popMatrix();
};

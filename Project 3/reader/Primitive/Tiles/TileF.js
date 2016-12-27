/**
* TileF
* @constructor
*/

function TileF(scene, id, player) {
    CGFobject.call(this,scene);

    this.base = new Rectangle(scene, 0, 0.70, 0, 0.70);
    this.cylinder = new Cylinder(scene, 0.2, 0.2, 0.1, 20, 20);

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

    this.id = id;
    this.size = 5/6;
};

TileF.prototype = Object.create(CGFobject.prototype);
TileF.prototype.constructor = TileF;

TileF.prototype.display = function () {


    this.scene.pushMatrix();

        this.scene.translate(-2.5,1.666, 0); // place tile on 0,0

        if(this.line >= 0)
            this.scene.translate(this.size * this.col, -this.size * this.line, 0);
        else if (this.line == -1){
            this.scene.translate(1.26 + this.col * this.size, -5.59, 0);
        }
        else if (this.line == -2){
            this.scene.translate(1.26 + this.col * this.size, 0.91, 0);
        }

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

};

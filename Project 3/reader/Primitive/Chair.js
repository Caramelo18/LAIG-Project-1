
function Chair(scene) {
	CGFobject.call(this,scene);

	this.cube=new Cube(this.scene, -0.5, 0.5, -0.5, 0.5);

	this.materialCadeira = new CGFappearance(this.scene);
	this.materialCadeira.setAmbient(0.3,0.3,0.3,1);
	this.materialCadeira.setDiffuse(0.290, 0.196, 0.050,1);
	this.materialCadeira.setSpecular(0.5,0.5,0.5,1);
	this.materialCadeira.setShininess(12);

	this.materialAssento = new CGFappearance(this.scene);
	this.materialAssento.setAmbient(0.3,0.3,0.3,1);
	this.materialAssento.setDiffuse(0.956, 0.898, 0.623,1);
	this.materialAssento.setSpecular(0.5,0.5,0.5,1);
	this.materialAssento.setShininess(12);


};

Chair.prototype = Object.create(CGFobject.prototype);
Chair.prototype.constructor=Chair;

Chair.prototype.display = function () {
	this.scene.pushMatrix();

    this.materialAssento.apply();

    //assento
    this.scene.pushMatrix();
    	this.scene.translate(0,2.1,0);
    	this.scene.scale(1.8,0.2,1.8);
    	this.cube.display();
    this.scene.popMatrix();

    this.materialCadeira.apply();

    //encosto
    this.scene.pushMatrix();
	    this.scene.pushMatrix();
	    	this.scene.translate(0,(2.5/2)+2.0+0.2,-(1.8-0.2)/2);
	    	this.scene.scale(1.8,2.5,0.2);
	    	this.cube.display();
	    this.scene.popMatrix();
    this.scene.popMatrix();

     //perna tras esquerda
    this.scene.pushMatrix();
    	this.scene.translate(-(1.8-0.2)/2,1.0,-(1.8-0.2)/2);
    	this.scene.scale(0.2,2.0,0.2);
    	this.cube.display();
    this.scene.popMatrix();


    //perna tras direita
    this.scene.pushMatrix();
    	this.scene.translate((1.8-0.2)/2,1.0,-(1.8-0.2)/2);
    	this.scene.scale(0.2,2.0,0.2);
    	this.cube.display();
    this.scene.popMatrix();

   //perna frente esquerda
    this.scene.pushMatrix();
    	this.scene.translate(-(1.8-0.2)/2,1.0,(1.8-0.2)/2);
    	this.scene.scale(0.2,2.0,0.2);
    	this.cube.display();
    this.scene.popMatrix();

    //perna frente direita
    this.scene.pushMatrix();
    	this.scene.translate((1.8-0.2)/2,1.0,(1.8-0.2)/2);
    	this.scene.scale(0.2,2.0,0.2);
    	this.cube.display();
    this.scene.popMatrix();


	this.scene.popMatrix();
}

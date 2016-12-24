
function Table(scene) {
	CGFobject.call(this,scene);

	this.cube=new Rectangle(this.scene,0,1,0,1);

/*
	this.materialTampo = new CGFappearance(this.scene);
	this.materialTampo.setAmbient(0.3,0.3,0.3,1);
	this.materialTampo.setDiffuse(0.4,0.3,0.0,1);
	this.materialTampo.setSpecular(0,0,0,1);
	this.materialTampo.setShininess(120);
	this.materialTampo.loadTexture("/resources/images/table.png");


	this.materialPerna = new CGFappearance(this.scene);
	this.materialPerna.setAmbient(0.3,0.3,0.3,1);
	this.materialPerna.setDiffuse(0.529, 0.529, 0.529,1);
	this.materialPerna.setSpecular(1,1,1,1);
	this.materialPerna.setShininess(120);
*/
};

Table.prototype = Object.create(CGFobject.prototype);
Table.prototype.constructor=Table;

Table.prototype.display = function () {
	this.scene.pushMatrix();

  	this.scene.translate(-2.35,1.75,-1.35);// translação para centrar a mesa na origem
   		this.scene.pushMatrix();
				//this.materialPerna.apply();//material para as pernas
 				this.scene.scale(0.3,3.5,0.3);
  			this.cube.display();
			this.scene.popMatrix();

		this.scene.translate(4.7,0,0);

		this.scene.pushMatrix();
				this.scene.scale(0.3,3.5,0.3);
	    	this.cube.display();
	  this.scene.popMatrix();

		this.scene.translate(0,0,2.7);

		this.scene.pushMatrix();
			this.scene.scale(0.3,3.5,0.3);
	    this.cube.display();
	  this.scene.popMatrix();

		this.scene.translate(-4.7,0,0);

		this.scene.pushMatrix();
			this.scene.scale(0.3,3.5,0.3);
	    this.cube.display();
		this.scene.popMatrix();

		this.scene.translate(2.35,1.9,-1.35);
		this.scene.pushMatrix();
	    this.scene.scale(5,0.3,3);
	    //this.materialTampo.apply();//material para o tampo
	    this.cube.display();
		this.scene.popMatrix();

	this.scene.popMatrix();
}

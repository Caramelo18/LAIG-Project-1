/**
 * cylinder
 * @constructor
 */
 function Cylinder(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.cover = new Circle(this.scene, slices);
	this.side = new CylinderSide(this.scene, slices , stacks);
	this.slices = slices;

 };

 Cylinder.prototype = Object.create(CGFobject.prototype);
 Cylinder.prototype.constructor = Cylinder;

 Cylinder.prototype.display = function() {


	this.side.display();
	

	this.scene.pushMatrix();
		this.scene.translate(0,0,1);
		this.cover.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.rotate(Math.PI * this.slices, 0,0,1);
		this.scene.rotate(Math.PI, 0 ,1, 0);
		this.cover.display();
	this.scene.popMatrix();
	


 };

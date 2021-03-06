/**
 * cylinder
 * @constructor
 */
 function Cylinder(scene, base, top, height, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.coverBase = new Circle(this.scene, base, slices);
	this.coverTop = new Circle(this.scene, top , slices);
	this.side = new CylinderSide(this.scene, base, top , height ,slices , stacks);
	
	this.slices = slices;
	this.height = height;
 };

 Cylinder.prototype = Object.create(CGFobject.prototype);
 Cylinder.prototype.constructor = Cylinder;

 Cylinder.prototype.display = function() {


	this.side.display();
	

	this.scene.pushMatrix();
		this.scene.translate(0,0,this.height);
		this.coverTop.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.rotate(Math.PI * this.slices, 0,0,1);
		this.scene.rotate(Math.PI, 0 ,1, 0);
		this.coverBase.display();
	this.scene.popMatrix();
	


 };

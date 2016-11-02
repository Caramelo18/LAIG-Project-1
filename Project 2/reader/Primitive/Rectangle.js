
function Rectangle(scene,x1,x2,y1,y2) {
	CGFobject.call(this,scene);
	this.x1 = x1;
	this.x2 = x2;
	this.y1 = y1;
	this.y2 = y2;

	this.diffX = this.x2 - this.x1;
	this.diffY = this.y2 - this.y1;
	this.initBuffers();
};

Rectangle.prototype = Object.create(CGFobject.prototype);
Rectangle.prototype.constructor=Rectangle;

Rectangle.prototype.initBuffers = function () {
	this.vertices = [
            this.x1, this.y1, 0,
            this.x2, this.y1, 0,
            this.x1, this.y2, 0,
			this.x2, this.y2, 0
			];

	this.indices = [
      0, 1, 2,
	  3, 2, 1
    ];

	this.normals = [
		0,0,1,
		0,0,1,
		0,0,1,
		0,0,1,
	]

	this.maxS = 1;
	this.maxT = 1;
	this.minS = 0;
	this.minT = 0;

		 this.texCoords = [
			this.minS, this.maxT,
			 this.maxS, this.maxT,
			 this.minS, this.minT,
			 this.maxS, this.minT
			];

	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

Rectangle.prototype.updateTexCoords = function (ampS, ampT) {
	this.texCoords = [
			this.diffX/ampS, this.diffY/ampT,
			0.0, this.diffY/ampT,
			this.diffX/ampS, 0.0,
			0.0,  0.0
    ];

		 this.updateTexCoordsGLBuffers();
 }

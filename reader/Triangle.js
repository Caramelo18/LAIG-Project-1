function Triangle(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
	CGFobject.call(this,scene);
	this.x1 = x1;
	this.y1 = y1;
	this.z1 = z1;
	this.x2 = x2;
	this.y2 = y2;
	this.z2 = z2;
	this.x3 = x3;
	this.y3 = y3;
	this.z3 = z3;

	this.initBuffers();
};

Triangle.prototype = Object.create(CGFobject.prototype);
Triangle.prototype.constructor=Triangle;

Triangle.prototype.initBuffers = function () {
	this.vertices = [
            this.x1, this.y1, this.z1,
            this.x2, this.y2, this.z2,
            this.x3, this.y3, this.z3,
			];

	this.indices = [
            2,1,0,
            0,1,2,
        ];

				var AB = vec3.create();
				var AC = vec3.create();
				var BC = vec3.create();
				var N = vec3.create();

				AB.x = this.x2 - this.x1;
				AB.y = this.y2 - this.y1;
				AB.z = this.z2 - this.z1;

				AC.x = this.x3 - this.x1;
				AC.y = this.y3 - this.y1;
				AC.z = this.z3 - this.z1;

				BC.x = this.x3 - this.x2;
				BC.y = this.y3 - this.y2;
				BC.z = this.z3 - this.z2;

				N.copy(AB);
				// cross product

				N.cross(BC);
				N.normalize();


		this.normals = [
           N.x,N.y,N.z,
           N.x,N.y,N.z,
           N.x,N.y,N.z
    ];

		distanceAB = AB.length();
		distanceBC = BC.length();
		distanceAC = AC.length();

		this.alfa = Math.acos((Math.pow(distanceBC, 2) - Math.pow(distanceAC, 2)  + Math.pow(distanceAB, 2)) / (2 * distanceBC * distanceAB));
		this.comp = distanceAB;
		this.texelX = distanceAB - distanceBC * Math.cos(alfa);
		this.texelY  = distanceBC* Math.sin(alfa);

		this.texCoords = [
			0.0, 0.0,
			this.comp, 1.0,
			this.texelX, 1- this.texelY
	];


	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};


Triangle.prototype.updateTexCoords = function (ampS, ampT) {
		this.texCoords = [
			0.0, 0.0,
			this.comp/ampS, 1.0,
			this.texelX/ ampS, 1- this.texelY/ampT
		];
			 this.updateTexCoordsGLBuffers();
}

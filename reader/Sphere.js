 function Sphere(scene, radius, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;
	this.radius = radius;
	
 	this.initBuffers();
 };

 Sphere.prototype = Object.create(CGFobject.prototype);
 Sphere.prototype.constructor = Sphere;

 Sphere.prototype.initBuffers = function() {


	this.angulo = (Math.PI*2)/this.slices;
	this.angulo2= (Math.PI/2)/this.stacks;
	
 	this.vertices = [];
 	this.indices = [];
 	this.normals = [];
	this.texCoords = [];

	var ang=0;
	var ang2=0;
	var x,y;
	
	
	for(k = 0; k <= this.stacks; k++){
		this.vertices.push(Math.cos(ang2), 0, Math.sin(ang2));
		this.normals.push(Math.cos(ang2), 0, Math.sin(ang2));
		this.texCoords.push(0,Math.sin(ang2));
		ang=0;
		
		for(i = 0; i < this.slices; i++){
				
				if(i!=(this.slices-1)){
					ang+=this.angulo;
					x = Math.cos(ang) * this.radius;
					y = Math.sin(ang) * this.radius;
					this.vertices.push(x * Math.cos(ang2), y * Math.cos(ang2), Math.sin(ang2));
					this.normals.push(x * Math.cos(ang2), y * Math.cos(ang2), Math.sin(ang2));
					this.texCoords.push((i+1)/this.slices,Math.sin(ang2));
				}

			if(k > 0){
				if(i==(this.slices-1)){
           			this.indices.push(((k-1)*this.slices)+i,((k-1)*this.slices),(k*this.slices)+i);
					this.indices.push((k*this.slices)+i,((k-1)*this.slices),(k*this.slices));
		  		}else{
					this.indices.push(((k-1)*this.slices)+i,((k-1)*this.slices)+1+i,(k*this.slices)+i);
					this.indices.push((k*this.slices)+i,((k-1)*this.slices)+1+i,(k*this.slices)+1+i);
		  			}
			}
		}
		if(k == (this.stacks/2 - 1) ){
			ang2+=this.angulo2;
		}
		else{
			ang2-=this.angulo2;
		}
	}
	
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

/**
 * cylinder
 * @constructor
 */
 function CylinderSide(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;

 	this.initBuffers();
 };

 CylinderSide.prototype = Object.create(CGFobject.prototype);
 CylinderSide.prototype.constructor = CylinderSide;

 CylinderSide.prototype.initBuffers = function() {

	this.angulo = (Math.PI*2)/this.slices;

 	this.vertices = [];
 	this.indices = [];
 	this.normals = [];
	this.texCoords = [];

	var ang=0;
	var x,y;
	var z=0;
	
	for(k = 0; k <= this.stacks; k++){
		this.vertices.push(1, 0, z);
		this.normals.push(1, 0, 0);
		this.texCoords.push(0,k/this.stacks);
		
		ang=0;

		for(i = 0; i < this.slices; i++){
				
				if(i!=(this.slices-1)){
					ang+=this.angulo;
					x = Math.cos(ang);
					y = Math.sin(ang);
					this.vertices.push(x, y, z);
					this.normals.push(x, y, 0);
					this.texCoords.push((i+1)/this.slices,k/this.stacks);
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

		z += 1/this.stacks;
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

/**
 * Cirle
 * @constructor
 */
 function Circle(scene, slices) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;

 	this.initBuffers();
 };

 Circle.prototype = Object.create(CGFobject.prototype);
 Circle.prototype.constructor = Circle;

 Circle.prototype.initBuffers = function() {

 	this.vertices = [];
 	this.indices = [];
 	this.normals = [];
	this.texCoords = [];
    
    var ang=Math.PI*2/this.slices;
	var angAux=0;
    var x,y;

	this.vertices.push(0,0,0);
	this.normals.push(0,0,1);
	this.texCoords.push(0.5,0.5);
	
	for(j = 0; j <= this.slices; j++){
	 
        if(j == this.slices){
	       this.indices.push(0, j, 1);
	   }else{	
	       x=Math.cos(angAux);
	       y=Math.sin(angAux);

	       this.vertices.push(x,y,0);
	       this.normals.push(0,0,1);
		   this.texCoords.push((x/2)+0.5,-(y/2)+0.5);
		
	       if(j>0){
            this.indices.push(0, j, j+1);
	       } 
	   }
       
       angAux+=ang;
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

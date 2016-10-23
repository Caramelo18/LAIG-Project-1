function Torus(scene, inner, outer, slices, loops) {
 CGFobject.call(this,scene);
 this.inner = inner;
 this.outer = outer;
 this.slices = slices;
 this.loops = loops;

 this.initBuffers();
};

Torus.prototype = Object.create(CGFobject.prototype);
Torus.prototype.constructor = Torus;

Torus.prototype.initBuffers = function() {

 this.radius = (this.outer - this.inner)/2;
 this.radiusCenter = this.inner + this.radius;

/*
radius - raio do tubo
radiusCenter - raio ao centro do objeto
*/

 this.sigma = (Math.PI * 2)/this.slices;
 this.theta = (Math.PI * 2)/this.loops;

 this.vertices = [];
 this.indices = [];
 this.normals = [];
 this.texCoords = [];
/*
    x = (R + r*cos(v))*cos(u)
    y = (R + r*cos(v))*sin(u)
    z = r*sin(v)

*/

 for(var i = 0 ; i <= this.loops ; i++){
   for(var j = 0 ; j <= this.slices; j++){

     var x = (this.radiusCenter + this.radius * Math.cos(i * this.theta)) * Math.cos(j * this.sigma);
     var y = (this.radiusCenter + this.radius * Math.cos(i * this.theta)) * Math.sin(j * this.sigma);
     var z = this.radius * Math.sin(i * this.theta);

     this.vertices.push(x,y,z);
     this.normals.push(x,y,z);
     this.texCoords.push(1- i/this.loops, 1 - j/this.slices);

   }
 }


 for(var loop = 0 ; loop < this.loops ; ++loop){
   for(var slice = 0; slice < this.slices ; ++slice){
     this.indices.push(loop * (this.slices + 1) + slice, (loop + 1) * (this.slices + 1) + slice, (loop + 1) * (this.slices + 1) + slice + 1);
     this.indices.push(loop * (this.slices + 1) + slice, (loop + 1) * (this.slices + 1) + slice + 1, loop * (this.slices + 1) + slice + 1);
   }
 }

for (var stack = 0; stack < this.loops; stack++) {
    for (var slice = 0; slice < this.slices; slice++) {
        var first = (stack * (this.slices + 1)) + slice;
        var second = first + this.slices + 1;

        this.indices.push(first, second + 1, second);
        this.indices.push(first, first + 1, second + 1);
    }
}


 this.primitiveType = this.scene.gl.TRIANGLES;
 this.initGLBuffers();
};

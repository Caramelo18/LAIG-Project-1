function  Terrain(scene, texture, heightmap){
 CGFobject.call(this,scene);

 this.texture = texture;
 this.heightmap = heightmap

};

Terrain.prototype = Object.create(CGFobject.prototype);
Terrain.prototype.constructor = Terrain;

function Component(scene, materialID, transformationsID, transformations, texture, primitivesRefs, componentRefs){
  this.materialID = materialID;
  this.transformationsID = transformationsID;
  this.transformations = transformations;
  this.texture = texture;
  this.primitivesRefs = primitivesRefs;
  this.componentRefs = componentRefs;
  this.textureIndex = 0;
}

function Component(scene, materialID, transformationsID, textures, primitivesRefs, componentRefs, childrenIDs){
  this.materialID = materialID;
  this.transformationsID = transformationsID;
  this.textures = textures;
  this.primitivesRefs = primitivesRefs;
  this.componentRefs = componentRefs;
  this.childrenIDs = childrenIDs;
  this.textureIndex = 0;
}

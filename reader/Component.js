function Component(scene, materialListIDs, transformationsID, transformations, texture, primitivesRefs, componentRefs){
  this.materialListIDs = materialListIDs;
  this.materialIndex = 0;
  this.materialID = this.materialListIDs[this.materialIndex];
  this.transformationsID = transformationsID;
  this.transformations = transformations;
  this.texture = texture;
  this.primitivesRefs = primitivesRefs;
  this.componentRefs = componentRefs;
}


Component.prototype.changeMaterial = function () {
    if(this.materialIndex < this.materialID.length - 1)
        this.materialIndex++;
    else
        this.materialIndex = 0;

    this.materialID = this.materialListIDs[this.materialIndex];
};

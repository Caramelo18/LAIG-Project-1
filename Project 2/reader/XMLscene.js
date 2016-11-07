
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

/**
initialization of variables Scene
*/
XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.gl.clearColor(0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    // creates a default camera and axis that are going to be replaced later
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    this.axis = new CGFaxis(this);

	this.currentCamera = 0;
	this.cameras = {};
    this.camerasIDs = [];

	this.materialsList = {};
    this.materialsIDs = []

    this.texturesList = {};
	this.texturesID = [];

    this.transformationsList = {};
    this.transformationsIDs = [];

    this.componentsList = {};
    this.componentsIDs = [];

    this.lightsStatus =[];
    this.lightsNames = [];

    this.animationsList = {};
    this.animationsIDs = [];

};
/*
  defines the interface of the scene
*/

XMLscene.prototype.setInterface = function (interface) {
    this.interface = interface;
}

/*
  defines the default appearance of the scene
*/
XMLscene.prototype.setDefaultAppearance = function () {
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
};

// Handler called when the graph is finally loaded.
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function ()
{
    this.axis = new CGFaxis(this, this.graph.axis_length);

	this.initCameras();
	this.initIllumination();
	this.initPrimitives();
	this.initMaterials();
    this.initTextures();
    this.initTransformations();
    this.initComponents();
    this.initAnimations();

    this.interface.initLightsButtons();
};


/**
initialization of the cameras
*/
XMLscene.prototype.initCameras = function()
{
	for(var i = 0; i < this.graph.cameras.length / 6; i++){
        this.camerasIDs[i] = this.graph.cameras[i * 6];
        this.cameras[this.camerasIDs[i]] = new CGFcamera(0.4, this.graph.cameras[i * 6 + 1], this.graph.cameras[i * 6 + 2], this.graph.cameras[i * 6 + 4], this.graph.cameras[5]);
    }

	this.camera = this.cameras[this.graph.defaultCamera];
  this.interface.setActiveCamera(this.camera);
}

/**
initialization of the illumination
*/
XMLscene.prototype.initIllumination = function()
{
	this.gl.clearColor(this.graph.backgroundR,this.graph.backgroundG,this.graph.backgroundB,this.graph.backgroundA);
  this.setAmbient(this.graph.ambientR, this.graph.ambientG, this.graph.ambientB, this.graph.ambientA);
}

/**
initialization of the primitives of the Scene
*/
XMLscene.prototype.initPrimitives = function () {
    this.primitives = this.graph.primitivesList;
    this.primitivesIDs = this.graph.primitivesIDs;
};

/**
initialization of the materials of the Scene
*/
XMLscene.prototype.initMaterials = function()
{
    this.materialsList = this.graph.materialsList;
    this.materialsIDs = this.graph.materialsIDs;
}

/**
initialization of the textures of the Scene
*/
XMLscene.prototype.initTextures = function ()
{
    this.texturesList = this.graph.texturesList;
    this.texturesID = this.graph.texturesID;

    if(this.texturesID.length > 0)
        this.enableTextures(true);

}

/**
initialization of the transformations of the Scene
*/
XMLscene.prototype.initTransformations = function()
{
    this.transformationsList = this.graph.transformationList;
    this.transformationsIDs = this.graph.transformationIDs;
}

/**
initialization of the components of the Scene
*/
XMLscene.prototype.initComponents = function()
{
    this.componentsList = this.graph.componentsList;
    this.componentsIDs = this.graph.componentsIDs;
}

XMLscene.prototype.initAnimations = function(){
    this.animationsList = this.graph.animationsList;
    this.animationsIDs = this.graph.animationsIDs;
}

/**
  update the lights (enable/disable)
*/
XMLscene.prototype.updateLights = function()
{
    for(var i = 0; i < this.lightsStatus.length; i++)
    {
        if(this.lightsStatus[i])
            this.lights[i].enable();
        else
            this.lights[i].disable();
    }

    for(var i = 0; i < this.lights.length; i++)
        this.lights[i].update();
}


XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup

	// Clear image and depth buffer everytime we update the scene
  this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
  this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
	this.axis.display();

	this.setDefaultAppearance();

	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it

	if (this.graph.loadedOk)
	{
        this.updateLights();
        this.displayGraph(this.graph.root, null, null);
	};
};

/**
change the current Camera when you press "v"
*/
XMLscene.prototype.changeCamera = function()
{
	this.currentCamera++;

	if(this.currentCamera >= this.camerasIDs.length)
		this.currentCamera = 0;

	this.camera = this.cameras[this.camerasIDs[this.currentCamera]];
}

/**
change the current material of the component when you press "m"
*/
XMLscene.prototype.changeMaterial = function(){
    for(var i = 0;  i < this.componentsIDs.length; i++)
        this.componentsList[this.componentsIDs[i]].changeMaterial();
}

/**
  displayGraph
*/

XMLscene.prototype.displayGraph = function(root, material, texture)
{
  var node;
  var mat;
	var text;


	node = this.componentsList[root];

	//transformations
	this.pushMatrix();

	if(node.materialListIDs[0] == 'inherit')
			mat = material;
	else
      mat = this.materialsList[node.materialListIDs[node.materialIndex]];

	//textures
	text = this.texturesList[node.texture];
	switch(node.texture){
			case "none":
				 text = null;
			break;
			case "inherit":
				 text = texture;
			break;
	}

    if(node.transformationsID != null)
        this.applyTransformations(this.transformationsList[node.transformationsID]);
    else
        this.applyTransformations(node.transformations);


    for(var i = 0; i < node.primitivesRefs.length; i++){
      if(this.primitives[node.primitivesRefs[i]] instanceof Triangle || this.primitives[node.primitivesRefs[i]] instanceof Rectangle){
      var  s = this.texturesList[node.texture + "s"];
      var  t = this.texturesList[node.texture + "t"];
        if(s  > 1 && t > 1){
            this.primitives[node.primitivesRefs[i]].updateTexCoords(s, t);
            mat.setTextureWrap('REPEAT', 'REPEAT');
        }
      }

      mat.setTexture(text);
      mat.apply();

      for(var j = 0; j < node.animationList.length;j++) {
          var animation = this.animationsList[node.animationList[j]];
          var point = animation.animate();
          this.translate(point[0], point[1], point[2]);
      }
      this.primitives[node.primitivesRefs[i]].display();
    }

	for(var i = 0 ; i < node.componentRefs.length; i++ ){
        var childID = node.componentRefs[i];
	    this.displayGraph(childID, mat, text);

}
	this.popMatrix();

}

/**
  apply the the proper transformation to the component
*/

XMLscene.prototype.applyTransformations = function(transformations)
{
    for(var i = 0; i < transformations.length; i++){
        var transf = transformations[i];

        switch(transf.type){
            case "rotate":
            this.rotate(transf.angle * Math.PI / 180,
                        transf.axis == "x" ? 1 : 0,
                        transf.axis == "y" ? 1 : 0,
                        transf.axis == "z" ? 1 : 0);
            break;
            case "translate":
            this.translate(transf.x, transf.y, transf.z);
            break;
            case "scale":
            this.scale(transf.x, transf.y, transf.z);
            break;
        }
    }
}

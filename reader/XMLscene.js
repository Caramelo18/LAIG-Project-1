
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

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
	this.cameras = [];

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

};


XMLscene.prototype.setInterface = function (interface) {
    this.interface = interface;
}

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
	this.initLights();
	this.initMaterials();
    this.initTextures();
    this.initTransformations();
    this.initComponents();

    this.interface.initLightsButtons();
};

XMLscene.prototype.initCameras = function()
{
	for(var i = 0; i < this.graph.cameras.length / 6; i++)
		this.cameras[i] = new CGFcamera(0.4, this.graph.cameras[i * 6 + 1], this.graph.cameras[i * 6 + 2], this.graph.cameras[i * 6 + 4], this.graph.cameras[5]);

	this.camera = this.cameras[this.currentCamera];
    this.interface.setActiveCamera(this.camera);
}


XMLscene.prototype.initIllumination = function()
{
	this.gl.clearColor(this.graph.backgroundR,this.graph.backgroundG,this.graph.backgroundB,this.graph.backgroundA);
    this.setAmbient(this.graph.ambientR, this.graph.ambientG, this.graph.ambientB, this.graph.ambientA);
}

XMLscene.prototype.initLights = function () {
	console.log("lights size: " + this.lights.length);
};

XMLscene.prototype.initMaterials = function()
{
    this.materialsList = this.graph.materialsList;
    this.materialsIDs = this.graph.materialsIDs;

    console.log("materials IDS length: " + this.materialsIDs.length);
}

XMLscene.prototype.initTextures = function ()
{
    this.texturesList = this.graph.texturesList;
    this.texturesID = this.graph.texturesID;

    if(this.texturesID.length > 0)
        this.enableTextures(true);
}

XMLscene.prototype.initTransformations = function()
{
    //console.log(this.graph.transformationList);
    this.transformationsList = this.graph.transformationList;
    this.transformationsIDs = this.graph.transformationIDs;

}

XMLscene.prototype.initComponents = function()
{
    this.componentsList = this.graph.componentsList;
    this.componentsIDs = this.graph.componentsIDs;
}

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

    this.primitives = this.graph.primitivesList;
    this.primitivesIDs = this.graph.primitivesIDs;

	if (this.graph.loadedOk)
	{
        this.updateLights();
        //this.graph.displayGraph();
        this.displayGraph(this.graph.root, null, null);
    /*    for(var i = 0; i < this.primitivesIDs.length; i++){
            console.log(this.primitivesIDs[i]);
            this.primitives[this.primitivesIDs[i]].display();
        }*/
	};
};

XMLscene.prototype.changeCamera = function()
{
	this.currentCamera++;

	if(this.currentCamera >= this.cameras.length)
		this.currentCamera = 0;

	this.camera = this.cameras[this.currentCamera];

}


XMLscene.prototype.displayGraph = function(root, material, texture)
{
    var node;
  	var mat;
	var text;

	node = this.componentsList[root];
    //console.log(node);
	if(node instanceof Component){

	//transformations
	this.pushMatrix();
//	this.multMatrix(this.transformationList[node.transformationsID]);

	//materials
	if(node.materialID == 'inherit')
			mat = material;
	else {
		  mat = this.materialsList[node.materialID];
	}

	//textures
    //console.log(this.texturesList);
	text = this.texturesList[node.texture];//[node.textureIndex];
	switch(node.texture){
			case "none":
				 text = null;
			break;
			case "inherit":
				 text = texture;
			break;
	}
//    console.log(text);
    mat.setTexture(text);
    mat.apply();
    //console.log(node.transformationsID);
    if(node.transformationsID != null)
    {
        this.applyTransformations(this.transformationsList[node.transformationsID]);
    }
    else {
    //    console.log(node.transformations);
        this.applyTransformations(node.transformations);
    }

    for(var i = 0; i < node.primitivesRefs.length; i++){
        this.primitives[node.primitivesRefs[i]].display();
    }

	for(var i = 0 ; i < node.componentRefs.length; i++ ){
        var childID = node.componentRefs[i];
        //console.log(childID);
    //    console.log(this.graph.nodes[childID]);
        //console.log(this.componentsList[childID]);
	    this.displayGraph(childID, mat, text);
	}


	this.popMatrix();

}/*else{
		console.log("asdadadasdasda");
		node = this.graph.primitivesList[root];
		//mat.setTexture(text);
	//	mat.apply();
		node.display();
		mat.setTexture(null);
	}*/


}

XMLscene.prototype.applyTransformations = function(transformations){
/*    console.log("transformations: ");
    console.log(transformations);*/
    //var i = transformations.length - 1; i >= 0; i--

    //var i = 0; i < transformations.length; i++
    for(var i = 0; i < transformations.length; i++){
        var transf = transformations[i];
        //console.log(transf);
    //    console.log(transformations[i].tagName);
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
        //console.log(transformations[i]);
}

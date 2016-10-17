
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
    this.textures = this.graph.texturesList;
    this.texturesID = this.graph.texturesID;

    if(this.texturesID.length > 0)
        this.enableTextures(true);
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

        for(var i = 0; i < this.primitivesIDs.length; i++){
            this.materialsList[this.materialsIDs[0]].apply();
            //this.textures[this.texturesID[i]].apply();
            this.primitives[this.primitivesIDs[i]].display();
        }
	};
};

XMLscene.prototype.changeCamera = function()
{
	this.currentCamera++;

	if(this.currentCamera >= this.cameras.length)
		this.currentCamera = 0;

	this.camera = this.cameras[this.currentCamera];

}

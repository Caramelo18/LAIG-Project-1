
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

    this.board = new Board(this),
    this.game = new Game(this.board, 0);

    this.fps = 60;
    var updatePeriod = 1000/this.fps;
    this.setUpdatePeriod(updatePeriod);

    this.playerAngle = 0;
    this.cameraChange = 0;


    this.setPickEnabled(true);

    this.timerStarted = false;
    this.currTime = 0;
    this.firstTime = true;

    this.timer = new Placard(this);
    this.client = new Client(8081);
    this.client.getPrologRequest('getTilePool', this.readPool ,1, this);
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
  //this.interface.addMenu();
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
 // this.interface.setActiveCamera(this.camera);
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

  this.logPicking();
  this.clearPickRegistration();

  // Clear image and depth buffer everytime we update the scene
  this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
  this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
	//this.axis.display();

  this.setDefaultAppearance();

  //this.timer.display();

    this.board.display();
	if (this.graph.loadedOk)
	{
        this.updateCameras(this.currTime);
        this.updateLights();
        this.displayGraph(this.graph.root, null, null);
	};


};

/**
change the current Camera when you press "v"
*/
XMLscene.prototype.change = function()
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


    if(node.currentAnimation < node.animationList.length){
        var animation = this.animationsList[node.animationList[node.currentAnimation]];
        if(animation.animate() == 1 && node.currentAnimation + 1 < node.animationList.length)
            node.currentAnimation++;
    }

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

XMLscene.prototype.changePlayerView = function(){
    var deg2Rad = Math.PI/180;

    if(this.playerAngle == Math.PI)
        this.cameraChange = -1;
    else if(this.playerAngle == 0)
        this.cameraChange = 1;

}

XMLscene.prototype.logPicking = function ()
{
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				if (obj)
				{
					var customId = this.pickResults[i][1];
                    if(customId > 0 && customId <= 36)
                        this.handlePlacements(customId);
                    else if(customId >= 50 && customId < 65)
                        this.handlePlayerPlacements(customId);
					console.log("Picked object: " + obj + ", with pick id " + customId);
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}
	}
}

XMLscene.prototype.handlePlacements = function(ID){
    var line = 5 - Math.trunc(ID / 6);
    var col = ID % 6 - 1;

    col == -1 ? (col = 5, line++) : col = col;

    this.game.setTarget(line, col);
    console.log('line ' + line);
    console.log('col ' + col);
    console.log('id ' + ID);
}

XMLscene.prototype.handlePlayerPlacements = function(ID) {
    this.game.setSelectedTile(ID);
}

XMLscene.prototype.readPool = function(data){
    this.scene.game.pool = data.target.response;
    console.log(this.scene.pool);
    var command = 'getPlayerAStartHand(' + this.scene.game.pool + ')';
    console.log(command);
    this.scene.client.getPrologRequest(command, this.scene.readPlayerAHand, 1, this.scene);
}

XMLscene.prototype.readPlayerAHand = function(data){
    var response = data.target.response;
    response = response.split("],");

    var hand = response[0];
    this.scene.board.p1Hand = hand.substring(1) + "]";

    var pool = response[1];
    hand = hand.substring(2);
    hand = hand.split("),");
    pool = pool.substring(0, pool.length - 1);
    this.scene.playerAHand = hand;
    this.scene.game.pool = pool;

    var command = 'getPlayerBStartHand(' + pool + ')';
    this.scene.client.getPrologRequest(command, this.scene.readPlayerBHand, 1, this.scene);
}

XMLscene.prototype.readPlayerBHand = function(data){
    var response = data.target.response;
    response = response.split("],");

    var hand = response[0];
    this.scene.board.p2Hand = hand.substring(1) + "]";

    var pool = response[1];
    hand = hand.substring(2);
    hand = hand.split("),");
    pool = pool.substring(0, pool.length - 1);
    this.scene.playerBHand = hand;
    this.scene.game.pool = pool;
    this.scene.game.poolSize = 29;
    console.log(this.scene.playerAHand);
    console.log(this.scene.playerBHand);
    console.log(pool);
    this.scene.board.loadPlayerTiles(this.scene.playerAHand, this.scene.playerBHand);
    this.scene.board.setPickableP1Tiles(false);
    this.scene.board.setPickableP2Tiles(false);

    var command = 'getBoard';
    this.scene.client.getPrologRequest(command, this.scene.readBoard, 1, this.scene);


}

XMLscene.prototype.readBoard = function(data){
    var response = data.target.response;

    this.scene.board.board = response;
    response = response.split("],");
    response[0] = response[0].substring(1);
    response[5] = response[5].substring(0, response[5].length - 2);
    for(var i = 0; i < response.length; i++)
    {
        response[i] = response[i].substring(1);
        response[i] = response[i].split("),");
        for(var j = 0; j < response[i].length; j++)
            response[i][j] = response[i][j].substring(5);
    }
    this.scene.board.loadTiles(response);
    //this.scene.client.getPrologRequest('quit', 0, 1);
}

XMLscene.prototype.update = function(currTime) {
  this.timer.update(currTime);
}



XMLscene.prototype.updateCameras = function(time){


  var duration = 3;

  var location = vec3.clone(this.cameras[this.camerasIDs[this.currentCamera]].position);
  var target = vec3.clone(this.cameras[this.camerasIDs[this.currentCamera]].target);

  if(time < duration ){
    var perc = time/duration;

    var ang = perc * Math.PI;

    var size = Math.sqrt(Math.pow(location[0] - target[0],2) + Math.pow(location[2] - target[2],2));

    //this.camera.setPosition(vec3.fromValues( target[0] + size * Math.sin(ang), location[1], target[2] + size * Math.cos(ang)));
  }
}

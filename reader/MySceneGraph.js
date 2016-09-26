
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
		
	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	this.reader.open('scenes/'+filename, this);  
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseGlobalsExample(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	var sceneError = this.parseScene(rootElement);
	
	if (sceneError != null) {
		this.onXMLError(sceneError);
		return;
	}
	
	var illuminationError = this.parseIllumination(rootElement);
	
	if (illuminationError != null) {
		this.onXMLError(illuminationError);
		return;
	}
	
	var texturesError = this.parseTextures(rootElement);
	
	if (texturesError != null) {
		this.onXMLError(texturesError);
		return;
	}
	
	
	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};



/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
MySceneGraph.prototype.parseGlobalsExample= function(rootElement) {
	
	var elems =  rootElement.getElementsByTagName('globals');
	if (elems == null) {
		return "globals element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'globals' element found.";
	}

	// various examples of different types of access
	var globals = elems[0];
	this.background = this.reader.getRGBA(globals, 'background');
	this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill","line","point"]);
	this.cullface = this.reader.getItem(globals, 'cullface', ["back","front","none", "frontandback"]);
	this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw","cw"]);

	console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");

	/*var tempList=rootElement.getElementsByTagName('list');

	if (tempList == null  || tempList.length==0) {
		return "list element is missing.";
	}
	
	this.list=[];
	// iterate over every element
	var nnodes=tempList[0].children.length;
	for (var i=0; i< nnodes; i++)
	{
		var e=tempList[0].children[i];

		// process each element and store its information
		this.list[e.id]=e.attributes.getNamedItem("coords").value;
		console.log("Read list item id "+ e.id+" with value "+this.list[e.id]);
	};*/

};

MySceneGraph.prototype.parseScene = function(rootElement)
{
	var elems =  rootElement.getElementsByTagName('scene');
	if (elems == null) {
		return "scene element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'scene' element found.";
	}
	
	var scene = elems[0];
	
	this.root = this.reader.getString(scene, 'root');
	this.axis_length = this.reader.getFloat(scene, 'axis_length');
	
	console.log("Scene read from file: root = " + this.root + ", axis_length = " + this.axis_length);
}
	
MySceneGraph.prototype.parseIllumination = function(rootElement)
{
	var elems =  rootElement.getElementsByTagName('illumination');
	if (elems == null) {
		return "illumination element is missing.";
	}
	if (elems.length != 1) {
		return "either zero or more than one 'illumination' element found.";
	}
	
	var ambient = rootElement.getElementsByTagName('ambient');
	if (ambient == null) {
		return "ambient element is missing.";
	}
	if (ambient.length != 1) {
		return "either zero or more than one 'ambient' element found.";
	}
	
	var background = rootElement.getElementsByTagName('background');
	if (background == null) {
		return "background element is missing.";
	}

	if (background.length != 1) {
		return "either zero or more than one 'background' element found.";
	}
	
	elems = elems[0];
	
	this.doubleSided = this.reader.getBoolean(elems, 'doublesided');
	this.local = this.reader.getBoolean(elems, 'local');
	
	console.log('Illumination read from file: doubleSided = ' + this.doubleSided + ", local = " + this.local);
	
	ambient = ambient[0];
	this.ambientR = this.reader.getFloat(ambient, 'r');
	this.ambientG = this.reader.getFloat(ambient, 'g');
	this.ambientB = this.reader.getFloat(ambient, 'b');
	this.ambientA = this.reader.getFloat(ambient, 'a');
	
	console.log('Illumination read from file: Ambient R = ' + this.ambientR + ", Ambient G = " + this.ambientG + ", Ambient B = " + this.ambientB + ", Ambient A = ", this.ambientA);

	background = background[0];
	this.backgroundR = this.reader.getFloat(background, 'r');
	this.backgroundG = this.reader.getFloat(background, 'g');
	this.backgroundB = this.reader.getFloat(background, 'b');
	this.backgroundA = this.reader.getFloat(background, 'a');
	
	console.log('Illumination read from file: Background R = ' + this.backgroundR + ", Background G = " + this.backgroundG + ", Background B = " + this.backgroundB + ", Background A = ", this.backgroundA);	
}	

MySceneGraph.prototype.parseTextures = function(rootElement)
{
	var textures = rootElement.getElementsByTagName('textures');

	if (textures == null  || textures.length==0) {
		return "textures element is missing.";
	}
	
	this.textureList=[];
	
	var numText = textures[0].children.length;
	
	for (var i = 0; i < numText; i++)
	{
		var e = textures[0].children[i];
		// process each element and store its information
		this.textureList[e.id] = e.attributes.getNamedItem("id").value;
		this.textureList[e.file] = e.attributes.getNamedItem("file").value;
		this.textureList[e.s] = e.attributes.getNamedItem("length_s").value;
		this.textureList[e.t] = e.attributes.getNamedItem("length_t").value;
		
		console.log("Texture read from file: ID = " + this.textureList[e.id] + ", File = " + this.textureList[e.file] + ",S Length = " + this.textureList[e.s] + ",T Length = " + this.textureList[e.t]);
	};
	
}
	
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};



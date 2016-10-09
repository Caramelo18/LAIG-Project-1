

function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
		
	
	this.rgba = ['r', 'g', 'b', 'a'];
	this.xyzw = ['x', 'y', 'z', 'w'];
	this.xyz = ['x', 'y', 'z'];

	this.lightIndex = 0;

	this.materialsList = [];
	this.primitivesList = [];
	this.cameras = [];
	this.omniLightsList = [];
	this.spotLightsList = [];


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
	this.parseGlobalsExample(rootElement);
	this.parseScene(rootElement);
	this.parseIllumination(rootElement);
	this.parseTextures(rootElement);
 	this.parseMaterials(rootElement);
 	this.parseViews(rootElement);
 	this.parseTransformations(rootElement);
	this.parseComponents(rootElement);
	this.parserPrimitives(rootElement);
	this.parseLights(rootElement);


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
		onXMLError("globals element is missing."); 
	}

	if (elems.length != 1) {
		onXMLError("either zero or more than one 'globals' element found.");
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
		onXMLError("scene element is missing.");
	}

	if (elems.length != 1) {
		onXMLError("either zero or more than one 'scene' element found.");
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
		onXMLError("illumination element is missing.");
	}
	if (elems.length != 1) {
		onXMLError("either zero or more than one 'illumination' element found.");
	}
	
	var ambient = elems[0].getElementsByTagName('ambient');
	if (ambient == null) {
		onXMLError("ambient element is missing.");
	}
	if (ambient.length != 1) {
		onXMLError("either zero or more than one 'ambient' element found.");
	}
	
	var background = elems[0].getElementsByTagName('background');
	if (background == null) {
		onXMLError("background element is missing.");
	}

	if (background.length != 1) {
		onXMLError("either zero or more than one 'background' element found.");
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
		onXMLError("textures element is missing.");
	}
	
	this.textureList=[];
	
	var numText = textures[0].children.length;
	
	if(numText <= 0)
		onXMLError("texture elements are missing");
	
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
	
MySceneGraph.prototype.parseViews = function(rootElement)
{
	var views = rootElement.getElementsByTagName('views');
	
	if (views == null  || views.length==0) {
		onXMLError("views element is missing.");
	}
	
	var nnodes = views[0].children.length;
		
	var view = views[0];
	
	this.default = this.reader.getString(view, 'default');

	for(var i = 0; i <nnodes ; i++){
	
		perspective = view.children[i];
		
		this.cameras[i * 6 ] = this.reader.getString(perspective, 'id');
		this.cameras[i * 6 + 1] = this.reader.getFloat(perspective, 'near');
		this.cameras[i * 6 + 2] = this.reader.getFloat(perspective, 'far');
		this.cameras[i * 6 + 3] = this.reader.getFloat(perspective, 'angle');
		console.log( this.reader.getString(perspective, 'id') + " " + this.reader.getFloat(perspective, 'near') + " " + this.reader.getFloat(perspective, 'far') + " " + this.reader.getFloat(perspective, 'angle'));

		from =perspective.children[0];
		this.cameras[i * 6 + 4] = vec3.fromValues( this.reader.getFloat(from, 'x'), this.reader.getFloat(from, 'y'),  this.reader.getFloat(from, 'z'));

		to = perspective.children[1];
		this.cameras[i * 6 + 5] =  vec3.fromValues(this.reader.getFloat(to, 'x'), this.reader.getFloat(to, 'y'), this.reader.getFloat(to, 'z'));

	}

	console.log("tamanho " + this.cameras.length/6);

	for(var i = 0;  i< this.cameras.length /6 ; i++){
		console.log("Perspective :id= " + this.cameras[i * 6] + " near= " + this.cameras[i * 6 +1] + " far= "+ this.cameras[i * 6 + 2] + " angle= " + this.cameras[i * 6 + 3]);
		console.log("from x= " + this.cameras[i * 6 + 4][0] + " y= " + this.cameras[i * 6 + 4][1] + " z= " +  this.cameras[i * 6 + 4][2]);
		console.log("to x= " +  this.cameras[i * 6 + 5][0] + " y= " + this.cameras[i * 6 + 5][1] + " z= " + this.cameras[i * 6 + 5][2]);	
	}
}	


MySceneGraph.prototype.parseMaterials = function(rootElement)
{
	var component = ['emission', 'ambient', 'diffuse', 'specular'];
	var rgba = ["r", "g", "b", "a"];

	var materials = rootElement.getElementsByTagName('materials');

	if (materials == null  || materials.length==0) {
		onXMLError( "materials element is missing.");
	}
	
	
	var ltMaterial = materials[0].getElementsByTagName('material');
	
	for(var i = 0; i< ltMaterial.length; i++){
			
		var id = ltMaterial[i].attributes.getNamedItem("id").value;
	
		if(id === null)
			continue;
		
		// is necessary to check if already exist a material with this id!!!
		console.log("material id: " + id);
			
		var material = [];

		// obtain shininess attributes
		var x =  ltMaterial[i].getElementsByTagName('shininess')[0];	
		material[4] = x.getAttribute("value");

		console.log("material value: " + material[4]);
		//obtain  ambient, emission, diffuse and specular attributes
		for(var j = 0; j < component.length ; j++){
			
			var att = ltMaterial[i].getElementsByTagName(component[j]);

			material[j] = [];
			for(var k = 0; k < rgba.length; k++)
			{
				material[j][k] = att[0].getAttribute(rgba[k]);
				console.log("Material property: " + material[j][k]);
			}	
			
		}
		
		
		var mat = new CGFappearance(this.scene);
		mat.setEmission(material[0][0], material[0][1], material[0][2], material[0][3]);
		mat.setAmbient(material[1][0], material[1][1], material[1][2], material[1][3]);
		mat.setDiffuse(material[2][0], material[2][1], material[2][2], material[2][3]);
		mat.setSpecular(material[3][0], material[3][1], material[3][2], material[3][3]);
		mat.setShininess(material[4]);
		

		this.materialsList[i] = mat;
	};
	
	console.log("Materials length :" + this.materialsList.length);

}

MySceneGraph.prototype.parseTransformations = function(rootElement)
{
	var transformations = rootElement.getElementsByTagName('transformations');
	
	if (transformations == null  || transformations.length==0) {
		onXMLError("transformations element is missing.");
	}
	
	var numTransf = transformations[0].children.length;
	
	if(numTransf <= 0)
		onXMLError("transformation elements are missing");
	
	this.transformationList = [];
	
	for(var i = 0; i < numTransf; i++)
	{
		var e = transformations[0].children[i];
		this.transformationList[e.id] = this.reader.getString(e, 'id');
				
		var translate = e.getElementsByTagName('translate');
		if (translate[0] != null)
		{
			this.transformationList[0] = translate[0].attributes.getNamedItem("x").value;
			this.transformationList[1] = translate[0].attributes.getNamedItem("y").value;
			this.transformationList[2] = translate[0].attributes.getNamedItem("z").value; 
		}
		else
		{
			this.transformationList[0] = 0;
			this.transformationList[1] = 0;
			this.transformationList[2] = 0;
		}
		
		var rotate = e.getElementsByTagName('rotate');
		if (rotate[0] != null)
		{
			this.transformationList[3] = rotate[0].attributes.getNamedItem("axis").value;
			this.transformationList[4] = rotate[0].attributes.getNamedItem("angle").value;
		}
		else
		{
			this.transformationList[3] = 0;
			this.transformationList[4] = 0;
		}
		
		
		var scale = e.getElementsByTagName('scale');
		if (scale[0] != null)
		{
			this.transformationList[5] = scale[0].attributes.getNamedItem("x").value;
			this.transformationList[6] = scale[0].attributes.getNamedItem("y").value;
			this.transformationList[7] = scale[0].attributes.getNamedItem("z").value; 
		}
		else
		{
			this.transformationList[5] = 0;
			this.transformationList[6] = 0;
			this.transformationList[7] = 0;
		}
		
		console.log("Transformation read from file: ID = " + this.transformationList[e.id] +  " TX = " + this.transformationList[0] +  " TY = " + this.transformationList[1] +  " TZ = " + this.transformationList[2]
		+ " Rotation axis: " + this.transformationList[3] + " R Angle " + this.transformationList[4]
		+ " SX = " + this.transformationList[5] + " SY = " +  this.transformationList[6] + " SZ = " + this.transformationList[7]);
		
	}
	
	
}

MySceneGraph.prototype.parseComponents = function(rootElement)
{
	var components = rootElement.getElementsByTagName('components');
	
	if (components == null  || components.length==0) {
		onXMLError("components element is missing.");
	}
	
	var compLength = components[0].children.length;
	
	var component = components[0].children[0]; // alterar aqui o 0
	
	var componentID = this.reader.getString(component, 'id');
	
	var transformation = component.getElementsByTagName('transformation');
	
	if(transformation == null) {
		onXMLError("transformation element is missing on Components");
	}
	
	transformation = transformation[0];
	var transformationRef = transformation.getElementsByTagName('transformationref');
	
	if(transformationRef != null && transformationRef.length != 0)
	{
		var ref = this.reader.getString(transformationRef[0], 'id');
		console.log("Transformation Ref ID = " +  ref);
	}
	else
	{
		var transformationList = this.parseTransformationElements(transformation);
	}
	
	
	var material = component.getElementsByTagName('materials');
	
	if (material.length == 0) {
		onXMLError("materials element is missing com Components");
	}
	
	var materialLength = material[0].children.length;
	var materialID = new Array();
	
	for(var i = 0; i < materialLength; i++)
	{
		materialID[i] = this.reader.getString(material[0].children[i], 'id');
		console.log("Material ID = " +  materialID[i]);
	}
	
	var texture = component.getElementsByTagName('texture');
	if(texture == null || texture.length == 0) {
		onXMLError("texture element is missing on Components");
	}
	
	texture = this.reader.getString(texture[0], 'id');
	
	console.log("Texture = " + texture);
	
	
	var children = component.getElementsByTagName('children');
	if(children == null || children.length == 0) {
		onXMLError("children element is missing on Components");
	}
	
	children = children[0];
	var componentref = children.getElementsByTagName('componentref');
	var primitiveref = children.getElementsByTagName('primitiveref');
	if(componentref.length == 0 && primitiveref.length == 0) {
		onXMLError( "children element on Components must contain componentref and/or primitiveref");
	}
	
	var componentRefs = new Array();
	var primitiveRefs = new Array();
	
	for(var i = 0; i < componentref.length; i++)
	{
		componentRefs[i] = this.reader.getString(componentref[i], 'id');
		console.log("componentref = " + componentRefs[i]);
	}	
	
	for(var i = 0; i < primitiveref.length; i++)
	{
		primitiveRefs[i] = this.reader.getString(primitiveref[i], 'id');
		console.log("primitiveref = " + primitiveRefs[i]);
	}
 	
} 


MySceneGraph.prototype.parseTransformationElements = function(rootElement)
{
	var transformationList = new Array();
	
	var translate = rootElement.getElementsByTagName('translate');
	if (translate[0] != null)
	{
		transformationList[0] = translate[0].attributes.getNamedItem("x").value;
		transformationList[1] = translate[0].attributes.getNamedItem("y").value;
		transformationList[2] = translate[0].attributes.getNamedItem("z").value; 
	}
	else
	{
		transformationList[0] = 0;
		transformationList[1] = 0;
		transformationList[2] = 0;
	}
		
	var rotate = rootElement.getElementsByTagName('rotate');
	if (rotate[0] != null)
	{
		transformationList[3] = rotate[0].attributes.getNamedItem("axis").value;
		transformationList[4] = rotate[0].attributes.getNamedItem("angle").value;
	}
	else
	{
		transformationList[3] = 0;
		transformationList[4] = 0;
	}
		
		
	var scale = rootElement.getElementsByTagName('scale');
	if (scale[0] != null)
	{
		transformationList[5] = scale[0].attributes.getNamedItem("x").value;
		transformationList[6] = scale[0].attributes.getNamedItem("y").value;
		transformationList[7] = scale[0].attributes.getNamedItem("z").value; 
	}
	else
	{
		transformationList[5] = 0;
		transformationList[6] = 0;
		transformationList[7] = 0;
	}
		
	console.log("Transformation read from file (component): " +  " TX = " + transformationList[0] +  " TY = " + transformationList[1] +  " TZ = " + transformationList[2]
	+ " Rotation axis: " + transformationList[3] + " R Angle " + transformationList[4]
	+ " SX = " + transformationList[5] + " SY = " +  transformationList[6] + " SZ = " + transformationList[7]);

	return transformationList;
}

MySceneGraph.prototype.parseLights = function(rootElement)
{

	var lights = rootElement.getElementsByTagName('lights');

	if(lights == null | lights.length  == 0){
		onXMLError("lights element is missing");
	}

	var light = lights[0];
	var nnodes = light.children.length;

	if(nnodes == 0)
		onXMLError("there are no lights");

	
	for(var i = 0; i < nnodes; i++){
		var child = light.children[i];
		console.log(child.tagName);
		switch(child.tagName){
			case "omni":
				this.parserOmniLights(child);
				break;
			case "spot":
				this.parserSpotLights(child);
				break;	
		}
	}
}


MySceneGraph.prototype.parserOmniLights = function(rootElement){
	
	if(rootElement == null)
		onXMLError("error on omni light");

	var omni = this.scene.lights[this.lightIndex];	
	
	omni.disable();
	omni.setVisible(true);


	var id = this.reader.getString(rootElement, 'id');
	var enabled = this.reader.getBoolean(rootElement, 'enabled');

	if(enabled == 1)
		this.scene.lights[this.lightIndex].enable();
	
	var location = this.getNvalues(rootElement.getElementsByTagName('location')[0], this.xyzw);
	var ambient = this.getNvalues(rootElement.getElementsByTagName('ambient')[0], this.rgba);
	var difuse =  this.getNvalues(rootElement.getElementsByTagName('diffuse')[0], this.rgba);
	var specular =  this.getNvalues(rootElement.getElementsByTagName('specular')[0], this.rgba);

	omni.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
	omni.setDiffuse(difuse[0], difuse[1], difuse[2], difuse[3]);
	omni.setSpecular(specular[0], specular[1], specular[2], specular[3]);
	omni.setPosition(location[0],location[1], location[2], location[3]);	

	this.omniLightsList[id] = this.scene.lights[this.lightIndex];

	this.lightIndex++;
	omni.update();	
}

MySceneGraph.prototype.parserSpotLights = function(rootElement){

	if(rootElement == null)
		onXMLError("error on spot light");

	var spot = this.scene.lights[this.lightIndex];	
	
	spot.disable();
	spot.setVisible(true);


	var id = this.reader.getString(rootElement, 'id');
	var enabled = this.reader.getBoolean(rootElement, 'enabled');
	var angle = this.reader.getFloat(rootElement, 'angle');
	var exponent = this.reader.getFloat(rootElement, 'exponent');
	
	
	if(enabled == 1)
		this.scene.lights[this.lightIndex].enable();
	
	var target = this.getNvalues(rootElement.getElementsByTagName('target')[0], this.xyz)
	var location = this.getNvalues(rootElement.getElementsByTagName('location')[0], this.xyz);
	var ambient = this.getNvalues(rootElement.getElementsByTagName('ambient')[0], this.rgba);
	var difuse =  this.getNvalues(rootElement.getElementsByTagName('diffuse')[0], this.rgba);
	var specular =  this.getNvalues(rootElement.getElementsByTagName('specular')[0], this.rgba);

	var direction = [];
	for(var j = 0; j < location.length; j++){
		direction[j] = target[j] - location[j];
	}

	spot.setSpotDirection(direction[0], direction[1], direction[2]);
	spot.setSpotExponent(exponent);
	spot.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
	spot.setDiffuse(difuse[0], difuse[1], difuse[2], difuse[3]);
	spot.setSpecular(specular[0], specular[1], specular[2], specular[3]);
	spot.setPosition(location[0],location[1], location[2], 1);	

	this.spotLightsList[id] = this.scene.lights[this.lightIndex];

	this.lightIndex++;
	spot.update();	

}

MySceneGraph.prototype.getNvalues = function(rootElement, type){
	
		if(rootElement == null)
			this.onXMLError("error geting 4 values");

		var tmp = [];

		for(var i = 0; i< type.length; i++){
			
			tmp[i] = this.reader.getFloat(rootElement,type[i]);
			console.log("tmp " + tmp[i] + " type " + type[i]);
		}

		return tmp;

}



MySceneGraph.prototype.parserPrimitives = function(rootElement){

	var elems = rootElement.getElementsByTagName('primitives');

	if(elems == null || elems.length != 1){
		onXMLError("primitives element is missing or more than one element");
	}

	var primitive = elems[0];

	if(primitive.children == null|| primitive.children.length == 0){
			onXMLError("Should have one or more primitives");
	}

	var nnodes = primitive.children.length;

	for(var i = 0 ; i < nnodes ; i++){
		var child  = primitive.children[i];


		if(child.tagName != 'primitive'){
			onXMLError("error got < " + child.tagName + " > instead of <primitive>");
		}

		if(child.children == null | child.children.length != 1 ){
			onXMLError("there must be only one primitive");
		}


		var primitiveChild = child.children[0];
		var primitve;
		
		switch(primitiveChild.tagName){
			case "rectangle":
				primitive = this.parserRectangle(primitiveChild);
				break;
			case "triangle":
				primitive = this.parserTriangle(primitiveChild);
				break;
			case "cylinder":
				primitive = this.parserCylinder(primitiveChild);
				break;
			case "sphere":
				//primitive =  this.parserSphere(primitiveChild);
				break;		
			case "torus":
				//primitive = this.parserTorus(primitiveChild);
				break;	

		}
		this.primitivesList[primitiveChild.id] = primitive;

	}

}

MySceneGraph.prototype.parserRectangle = function(element){
	var coord ={
		x1:0,
		x2:0,
		y1:0,
		y2:0
	}

	coord.x1 = this.reader.getFloat(element, 'x1');
	coord.x2 = this.reader.getFloat(element, 'x2');
	coord.y1 = this.reader.getFloat(element, 'y1');
	coord.y2 = this.reader.getFloat(element, 'y2');

	return new Rectangle(this.scene,coord.x1, coord.x2, coord.y1, coord.y2);
}

MySceneGraph.prototype.parserTriangle = function(element){
	var coord ={
		x1:0,
		x2:0,
		x3:0,
		y1:0,
		y2:0,
		y3:0,
		z1:0,
		z2:0,
		z3:0
	}

	coord.x1 = this.reader.getFloat(element, 'x1');
	coord.x2 = this.reader.getFloat(element, 'x2');
	coord.x3 = this.reader.getFloat(element, 'x3');
	coord.y1 = this.reader.getFloat(element, 'y1');
	coord.y2 = this.reader.getFloat(element, 'y2');
	coord.y3 = this.reader.getFloat(element, 'y3');
	coord.z1 = this.reader.getFloat(element, 'z1');
	coord.z2 = this.reader.getFloat(element, 'z2');
	coord.z3 = this.reader.getFloat(element, 'z3');

	return new Triangle(this.scene,coord.x1, coord.y1, coord.z1 ,coord.x2, coord.y2, coord.z2,coord.x3, coord.y3, coord.z3);
}

MySceneGraph.prototype.parserCylinder = function(element){
	
	var coord ={
		base: 0,
		top: 0,
		height: 0,
		slices: 0,
		stacks: 0
	}

	coord.base = this.reader.getFloat(element, 'base');
	coord.top = this.reader.getFloat(element, 'top');
	coord.height = this.reader.getFloat(element, 'height');
	coord.slices = this.reader.getInteger(element, 'slices');
	coord.stacks = this.reader.getInteger(element, 'stacks');

	return new Cylinder(this.scene, coord.slices, coord.stacks);

}

/*
MySceneGraph.prototype.parserSphere = function(element){
	
	var coord ={
		radius: 0,
		slices: 0,
		stacks: 0
	}

	coord.radius = this.reader.getFloat(element, 'radius');
	coord.slices = this.reader.getInteger(element, 'slices');
	coord.stacks = this.reader.getInteger(element, 'stacks');


	return new Sphere(this.scene, coord.radius, coord.slices, coord.stacks);

}


MySceneGraph.prototype.parserTorus = function(element){
	
	var coord ={
		inner: 0,
		outer: 0,
		slices: 0,
		loops:0
	}

	coord.inner = this.reader.getFloat(element, 'inner');
	coord.outer = this.reader.getFloat(element, 'outer');
	coord.slices = this.reader.getInteger(element, 'slices');
	coord.loops = this.reader.getInteger(element, 'loops');


	return new Torus(this.scene, coord.inner, coord.outer, coord.slices, coord.loops);

}

*/

/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};



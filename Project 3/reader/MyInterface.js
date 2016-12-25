/**
 * MyInterface
 * @constructor
 */

function MyInterface() {
	//call CGFinterface constructor
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);

	this.gui = new dat.GUI();

	this.lights = this.gui.addFolder("Lights");
	this.lights.open();

	return true;
};

/**
 * processKeyboard
 * @param event {Event}
 */
MyInterface.prototype.processKeyboard = function(event) {
	// call CGFinterface default code (omit if you want to override)
	//CGFinterface.prototype.processKeyboard.call(this,event);

	// Check key codes e.g. here: http://www.asciitable.com/
	// or use String.fromCharCode(event.keyCode) to compare chars

	// for better cross-browser support, you may also check suggestions on using event.which in http://www.w3schools.com/jsref/event_key_keycode.asp
	switch (event.keyCode)
	{
		case (118):	// v
		//	this.scene.changeCamera();
			this.scene.changePlayerView();
			break;
		case (109):
			this.scene.changeMaterial();
			break;
	};


    this.setActiveCamera(this.scene.camera);

};

MyInterface.prototype.initLightsButtons = function() {
	for(var i = 0; i < this.scene.graph.lightIndex; i++)
	{
		this.lights.add(this.scene.lightsStatus, i).name(this.scene.lightsNames[i]);
	}
}

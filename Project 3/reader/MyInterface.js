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


MyInterface.prototype.addMenu = function(){
	this.gui.add(this.scene, 'newGame').name("New Game");

	this.gui.add(this.scene.game,'undoMove').name("Undo");
	this.gui.add(this.scene.game,'setPlayMovieV').name("Replay");

	this.gui.add(this.scene, 'mode', {'HumanVsHuman' : 0, 'HumanVsComputer' : 1 });

	this.gui.add(this.scene,'changeScene').name("change scene");

	this.gui.add(this.scene,'changeCamera').name("change camera");

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
			this.scene.turnView = true;
			break;
		case (122):
			this.scene.game.undoMove();
			break;
		case (112):
			this.scene.game.playMovieV = true;
			break;
		case (99):
			changeScene();
			break;
	};


};

MyInterface.prototype.initLightsButtons = function() {
	for(var i = 0; i < this.scene.graph.lightIndex; i++)
	{
		this.lights.add(this.scene.lightsStatus, i).name(this.scene.lightsNames[i]);
	}
}

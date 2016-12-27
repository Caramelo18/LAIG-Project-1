/**
* Font
* @constructor
*/

function Font(scene) {
	CGFobject.call(this,scene);

    this.shader = new CGFshader(scene.gl, "Shaders/font.vert", "Shaders/font.frag");
  	this.shader.setUniformsValues({'dims': [16, 16]});

    this.texture = new CGFtexture(scene, "../textures/numbers.png");
    this.appearance = new CGFappearance(scene);
    this.appearance.setTexture(this.texture);
};

Font.prototype = Object.create(CGFobject.prototype);
Font.prototype.constructor = Font;


Font.prototype.getCharCoords = function(char) {

	var code = char.charCodeAt(0);
	if(code >= 48 && code <=57){
		switch(char) {
			case "0":
				return [0, 3];
			case "1":
				return [1, 3];
			case "2":
				return [2, 3];
			case "3":
				return [3, 3];
			case "4":
				return [4, 3];
			case "5":
				return [5, 3];
			case "6":
				return [6, 3];
			case "7":
				return [7, 3];
			case "8":
				return [8, 3];
			case "9":
				return [9, 3];
		}
	}
	else{
			switch(char) {
				case "T":
					return [4, 5];
				case "I":
					return [9, 4];
				case "M":
					return [13, 4];
				case "E":
					return [5, 4];
				case "R":
					return [2, 5];
				case "S":
					return [3, 5];
				case "C":
					return [3, 4];
				case "O":
						return [15, 4];
			}
	}
}


Font.prototype.getShader = function() {
  return this.shader;
}

Font.prototype.getTexture = function() {
  return this.texture;
}

Font.prototype.getAppearance = function() {
  return this.appearance;
}

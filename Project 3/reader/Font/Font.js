/**
* Font
* @constructor
*/

function Font(scene) {
	CGFobject.call(this,scene);

    this.shader = new CGFshader(scene.gl, "Shaders/font.vert", "Shaders/font.frag");
  	this.shader.setUniformsValues({'dims': [5, 2]});

    this.texture = new CGFtexture(scene, "../textures/numbers.jpg");
    this.appearance = new CGFappearance(scene);
    this.appearance.setTexture(this.texture);
};

Font.prototype = Object.create(CGFobject.prototype);
Font.prototype.constructor = Font;


Font.prototype.getCharCoords = function(char) {

  switch(char) {
    case "1":
      return [0, 0];
    case "2":
      return [1, 0];
    case "3":
      return [2, 0];
    case "4":
      return [3, 0];
    case "5":
      return [4, 0];
    case "6":
      return [0, 1];
    case "7":
      return [1, 1];
    case "8":
      return [2, 1];
    case "9":
      return [3, 1];
    case "0":
      return [4, 1];
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

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

varying vec4 coords;
varying vec4 normal;

void main() {
	vec4 vertex = vec4(aVertexPosition+aVertexNormal, 1.0);
	normal = vec4(aVertexNormal, 1.0);
	coords=vertex;

	gl_Position = uPMatrix * uMVMatrix * vertex;

	vTextureCoord = aTextureCoord;
}

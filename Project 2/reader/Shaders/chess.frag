#ifdef GL_ES
precision highp float;
#endif


varying vec2 vTextureCoord;

uniform vec4 c1;
uniform vec4 c2;
uniform vec4 cs;

uniform sampler2D uSampler;


void main() {


		vec4 textureColor = texture2D(uSampler, vTextureCoord);
		gl_FragColor = textureColor * c1;

	}

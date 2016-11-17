#ifdef GL_ES
precision highp float;
#endif

uniform vec4 c1;
uniform vec4 c2;
uniform vec4 cs;

uniform float distX;
uniform float distY;

uniform float su;
uniform float sv;
uniform float du;
uniform float dv;

uniform sampler2D uSampler;
varying vec2 vTextureCoord;

varying vec4 coords;
varying float selected;

void main() {


	vec4 textureColor = texture2D(uSampler, vTextureCoord);

	float x = coords[0] / distX;
	float y = coords[1] / distY;

	if(mod(x, 2.0) < 1.0 ^^ mod(y, 2.0) < 1.0)
	gl_FragColor = c1;
	else
	gl_FragColor = c2;

	if(selected == 1.0)
		gl_FragColor = cs;

		gl_FragColor = textureColor * gl_FragColor;


}

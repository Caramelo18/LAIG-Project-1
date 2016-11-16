#ifdef GL_ES
precision highp float;
#endif

uniform vec4 c1;
uniform vec4 c2;
uniform vec4 cs;

uniform float offSetX;
uniform float offSetY;

uniform sampler2D uSampler;
varying vec2 vTextureCoord;

varying vec4 coords;
varying vec4 normal;

void main() {


		//vec4 textureColor = texture2D(uSampler, vTextureCoord);
//		gl_FragColor = textureColor * c1;
		float x = 0.5*(coords[0] + 1.0);
		float y = 0.5*(coords[1] + 1.0);
		gl_FragColor = c1;

         // checkerboard shader:
         if ((mod(8.0*x, 1.0) < 0.5) ^^ (mod(8.0*y, 1.0) < 0.5))
         {
            gl_FragColor = c1;
         }
         else
         {
            gl_FragColor = c2;
         }


}

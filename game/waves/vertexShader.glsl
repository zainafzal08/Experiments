#define M_PI 3.1415926535897932384626433832795

uniform float time;
varying vec4 pos;

void main() {
    pos = vec4( position, 1.0 );
    pos.z = sin((time/100.0)+(pos.y*M_PI))/3.0;
    gl_Position = projectionMatrix * modelViewMatrix * pos;
}
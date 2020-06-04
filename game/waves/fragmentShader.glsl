varying vec4 pos;

void main() {
    vec4 dark = vec4(0.0, 0.51, 0.69, 1.0);
    vec4 light = vec4(0.0, 0.705, 0.858, 1.0);

    gl_FragColor = mix(dark, light, (pos.z*2.6)+1.0);
}
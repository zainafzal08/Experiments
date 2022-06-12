varying float vHeight;

void main() {
    vec4 baseColor = vec4(59.0/256.0, 137.0/256.0, 10.0/256.0, 1.0);
    vec4 tipColor = vec4(139.0/256.0, 200.0/256.0, 62.0/256.0, 1.0);
    gl_FragColor = mix(baseColor, tipColor, vHeight);
}
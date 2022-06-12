varying float vHeight;
attribute vec3 vPos;
attribute mat4 rotationMatrix;    

void main() {
    vHeight = uv.y;
    vec4 rotatedPosition = rotationMatrix * vec4(position + vPos, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * rotatedPosition;
}
import * as THREE from './three.js';
import { OrbitControls } from './OrbitControls.js';
import { WaveShader } from './WaveShader.js';

function createVerticies() {
  const gran = 50;
  const step = 2/gran;
  const vertices = [];
  for (let row = 0; row < gran-1; row++) {
    for (let col = 0; col < gran-1; col++) {
      const x = -1 + col*step;
      const y = -1 + row*step;
  
      vertices.push(x, y, 1);
      vertices.push(x+step, y, 1);
      vertices.push(x, y+step, 1);
  
      vertices.push(x, y+step, 1);
      vertices.push(x+step, y, 1);
      vertices.push(x+step, y+step, 1);
    }
  }
  
  return vertices;
}

async function init() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({alpha: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0)

  camera.position.z = 3;
  camera.position.y = 3;
  camera.rotation.x = THREE.MathUtils.degToRad(-30);

  const light = new THREE.DirectionalLight(0xFFFFFF, 1);
  light.position.set(-1, 2, 4);
  scene.add(light);

  var controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 1;
  controls.maxDistance = 10;

  // Create mesh.
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
      'position', new THREE.BufferAttribute(new Float32Array(createVerticies()), 3));
  geometry.computeVertexNormals();
  const shader = await WaveShader();
  const material = new THREE.ShaderMaterial({
    uniforms: shader.uniforms,
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  mesh.rotation.x = THREE.MathUtils.degToRad(-90);
  mesh.rotation.z = THREE.MathUtils.degToRad(15);
  mesh.onBeforeRender = () => {
    material.uniforms.time.value++;
    material.uniformsNeedUpdate = true;
  };
  scene.add(mesh);

  // Tick.
  document.body.appendChild(renderer.domElement);
  function tick() {
    requestAnimationFrame(tick);
    renderer.render(scene, camera);
  }
  tick();
}

init();
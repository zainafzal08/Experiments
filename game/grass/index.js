import * as THREE from './three.js';
import { OrbitControls } from './OrbitControls.js';
import { Shader } from './shader.js';

const NUM_BLADES_OF_GRASS = 10000;

async function init() {
    const sceneObjects = [];
    // Set up scene + camera.
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0)

    camera.position.z = 3;
    camera.position.y = 3;
    camera.rotation.x = THREE.MathUtils.degToRad(-30);

    // Lights.
    const light = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.position.set(-1, 2, 4);
    sceneObjects.push(light);

    // Orbit Contorls.
    var controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 1;
    controls.maxDistance = 10;

    // Plane
    const planeGeometry = new THREE.PlaneGeometry(2, 2, 64, 64);
    const planematerial = new THREE.MeshBasicMaterial({ color: 0x33631C, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry, planematerial);
    plane.receiveShadow = true;
    plane.castShadow = true;
    plane.rotation.x = THREE.MathUtils.degToRad(-90);
    sceneObjects.push(plane);

    // Grass
    const shader = await Shader();
    const bladeHeight = .1;
    const bladeWidth = .01;
    const bladeTransformations = new Array(NUM_BLADES_OF_GRASS).fill(0).map(() => ({
        position: {
            x: Math.random() * 2 - 1,
            y: bladeHeight / 2,
            z: Math.random() * 2 - 1
        },
        rotation: {
            x: 0,
            y: Math.random() * Math.PI,
            z: 0
        }
    }));

    const bladeGeometry = new THREE.InstancedBufferGeometry().copy(new THREE.PlaneGeometry(bladeWidth, bladeHeight, 16, 64));
    const vPositions = new Float32Array(NUM_BLADES_OF_GRASS * 3);
    for (let i = 0; i < NUM_BLADES_OF_GRASS; i++) {
        const transform = bladeTransformations[i];
        const { position, rotation } = transform;
        vPositions[i * 3] = position.x;
        vPositions[i * 3 + 1] = position.y;
        vPositions[i * 3 + 2] = position.z;

        // Build rotation matrix and put it in
        const rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeRotationX(rotation.x);
        rotationMatrix.makeRotationY(rotation.y);
        rotationMatrix.makeRotationZ(rotation.z);
        const rotationMatrixArray = rotationMatrix.toArray();
    }
    const positions = new THREE.InstancedBufferAttribute(vPositions, 3)
    bladeGeometry.setAttribute('vPos', positions);
    bladeGeometry.setAttribute('rotationMatrix', new THREE.InstancedBufferAttribute(vRotations, 9));
    const grassMaterial = new THREE.ShaderMaterial({
        uniforms: shader.uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader
    });
    const grassMesh = new THREE.InstancedMesh(bladeGeometry, grassMaterial, NUM_BLADES_OF_GRASS);
    grassMesh.onBeforeRender = () => {
        grassMaterial.uniforms.time.value++;
        grassMaterial.uniformsNeedUpdate = true;
    };
    grassMesh.receiveShadow = true;
    grassMesh.castShadow = true;
    sceneObjects.push(grassMesh);

    // Add everything to the scene.
    for (const obj of sceneObjects) {
        scene.add(obj);
    }

    // Tick.
    document.body.appendChild(renderer.domElement);

    function tick() {
        requestAnimationFrame(tick);
        renderer.render(scene, camera);
    }
    tick();
}

init();
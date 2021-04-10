import * as THREE from './three.js';
import { OrbitControls } from './OrbitControls.js';
import { STLLoader } from './STLLoader.js';

function createRenderer(containerDimentions) {
    const renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(containerDimentions.width, containerDimentions.height);
    renderer.setClearColor(0x000000, 0)
    return renderer;
}

function createCamera(containerDimentions) {
    const camera = new THREE.PerspectiveCamera(
        75, containerDimentions.width / containerDimentions.height, 0.1, 1000);   
    camera.position.z = -50;
    return camera;
}

class DNAModel {
    constructor(target, ) {
        this.target = target;
        const containerDimentions = this.target.getBoundingClientRect();
        this.renderer = createRenderer(containerDimentions);
        this.camera = createCamera(containerDimentions);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.scene = new THREE.Scene();

        const light = new THREE.DirectionalLight(0xFFFFFF, 1);
        light.position.set(0, 0, -10);
        this.scene.add(light);
        
        const loader = new STLLoader();
        loader.load( './model.stl', (geometry) => {
            const material = new THREE.MeshPhongMaterial( { color: 0x1bc4b6, specular: 0x111111, shininess: 200 } );
            geometry.center();
            const mesh = new THREE.Mesh( geometry, material );
            mesh.rotation.x = 90 * THREE.Math.DEG2RAD;
            mesh.rotation.z = 40 * THREE.Math.DEG2RAD;

            mesh.scale.set(.5, .5, .5);
            
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            this.dnaModel = mesh;
            this.scene.add(mesh);
        } );
    }

    activate() {
        this.target.appendChild(this.renderer.domElement);
        this.tick();
    }

    tick() {
        requestAnimationFrame(() => this.tick());
        this.dnaModel.rotation.z += 0.01;
        this.renderer.render(this.scene, this.camera);
    }
}

const model = new DNAModel(document.querySelector('.model'));

function init() {
    model.activate();
}

window.onload = init;
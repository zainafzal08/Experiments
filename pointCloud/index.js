'use strict';

const STATS = new Stats();
const PHI = (1 + Math.sqrt(5));
const NUM_SECTIONS = 4;
const POINT_CLOUD_CONFIGERATIONS = [
    "sphere",
    "chrome",
    "code",
    "design",
];

function constructMask(maskSelector) {
    const svgElement = document.querySelector(maskSelector);
    // Assumes all our masks start at (0,0).
    const { width, height } = svgElement.viewBox.baseVal;
    return {
        width,
        height,
        svgElement,
        polygons: svgElement.querySelectorAll('path')
    }
}

function easeCurve(p) {
    return Math.pow(p, 1.5);
}

function linearInterp(from, to, progress) {
    const dist = Math.abs(from - to);
    if (to > from) {
        return from + (dist * progress);
    }
    return from - (dist * progress);
}

function pointLinearInterp(from, to, progress) {
    return {
        x: linearInterp(from.x, to.x, progress),
        y: linearInterp(from.y, to.y, progress),
        z: linearInterp(from.z, to.z, progress),
    }
}


class ScrollObserver {
    constructor() {
        this.scrollPosition = 0;
        this.timer = null;
        this.listeners = [];
        window.addEventListener('scroll', () => this.onScroll());
        window.addEventListener('resize', () => this.updateWindowSize());
        this.updateWindowSize();
        this.onScroll();
    }

    // Calls `listner` with what section the user has stopped at when the scroll
    // position of the page stabilises.
    addScrollListener(listener) {
        this.listeners.push(listener);
    }

    updateWindowSize() {
        this.windowHeight = window.innerHeight;
    }

    onScroll() {
        // The 400 is a fudge factor so that we switch to the next section
        // even if it's only partially on screen.
        this.scrollPosition = Math.floor((window.scrollY + 400) / this.windowHeight);
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => this.onScrollStable(), 300);
    }

    onScrollStable() {
        for (const listener of this.listeners) {
            listener(this.scrollPosition);
        }
    }
}

class BackgroundController {
    constructor(canvas, masks) {
        this.canvas = canvas;
        const { height, width } = this.canvas.getBoundingClientRect();
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        this.renderer.setSize(width, height, false);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.masks = masks;
        this.runningAnimation = null;
        this.transitionSpeed = 600;
        this.animationFrameRequestId = null;

        this.cameraAngle = 0;
        this.cameraPitch = 0;
        this.orbitRadius = 250;
        this.sphereRadius = 150;
        this.diskRadius = 125;
        this.numPoints = 1249;
        this.orbitSpeed = 0.0025; // Degrees per frame.
        this.currentConfigeration = "sphere";
        this.pointSize = 1;
        this.pointPositions = [];
        this.lines = [];
        this.lineOpacity = .65;
        this.interpSpeed = .1; // units per frame.

        this.buildConfigeration();
        this.initScene();
        this.animate();
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.points = [];
        for (let i = 0; i < this.numPoints; i++) {
            const geometry = new THREE.SphereGeometry(this.pointSize, 32, 16);
            const material = new THREE.MeshBasicMaterial({ color: 0xa1cfe8 });
            const point = new THREE.Mesh(geometry, material);
            this.points.push(point);
            this.scene.add(point);
        }
    }

    // Exclusion zone code.
    inMask(point, maskId) {
        const mask = this.masks[maskId];
        const { width, height } = mask;
        // Map point from our model space into the svg's coords.
        const x = (point[0] + this.diskRadius) / (2 * this.diskRadius) * width;
        const y = (point[1] + this.diskRadius) / (2 * this.diskRadius) * height;
        let svgPoint = mask.svgElement.createSVGPoint();
        svgPoint.x = x;
        svgPoint.y = y;
        for (const polygon of mask.polygons) {
            if (polygon.isPointInFill(svgPoint)) {
                return true;
            }
        }
        return false;
    }

    // Generates a series of points on a sphere.
    sphereMap(i) {
        // This apparently comes from taking the inverse of a cumulative
        // distribution function representing the density of our sphere...
        // or something i honestly don't get it.
        // https://stackoverflow.com/questions/9600801/evenly-distributing-n-points-on-a-sphere/44164075#44164075
        const lat = Math.acos(1 - 2 * (i / this.numPoints));
        const long = Math.PI * PHI * i;
        return [
            this.sphereRadius * Math.cos(long) * Math.sin(lat),
            this.sphereRadius * Math.sin(long) * Math.sin(lat),
            this.sphereRadius * Math.cos(lat)
        ];
    }

    // Generates a series of points evenly spread through a disk.
    diskMap(i) {
        const theta = Math.PI * PHI * (i / this.numPoints * this.diskRadius);
        const r = Math.sqrt(i / this.numPoints) * this.diskRadius;
        return [
            r * Math.cos(theta),
            r * Math.sin(theta),
            0
        ];
    }

    randomMap(i) {
        if (i > Math.floor(this.numPoints * .25)) {
            return null;
        }
        return [
            Math.random() * this.sphereRadius - this.sphereRadius / 2,
            Math.random() * this.sphereRadius - this.sphereRadius / 2,
            Math.random() * this.sphereRadius - this.sphereRadius / 2
        ];
    }

    buildConfigeration() {
        this.pointPositions = [];
        const originalCameraOrbitRadius = this.orbitRadius;
        for (const line of this.lines) {
            this.killMesh(line);
        }
        this.lines = [];
        for (let i = 0; i < this.numPoints; i++) {
            let position = null;
            if (this.currentConfigeration === "sphere") {
                this.orbitRadius = 250;
                position = this.sphereMap(i);
            } else if (this.currentConfigeration === "code") {
                position = this.randomMap(i);
            } else {
                position = this.diskMap(i);
                if (!this.inMask(position, this.currentConfigeration)) {
                    position = null;
                }
            }
            this.pointPositions.push(
                position !== null ? new THREE.Vector3(...position) : null);
        }
        if (this.currentConfigeration === "code") {
            // Pick a random 10% of not null points.
            const points = this.pointPositions
                .filter(p => p !== null)
                .filter(() => Math.random() > .90);
            for (let i = 0; i < points.length; i++) {
                const from = points[i];
                const toIndex = Math.floor(Math.random() * points.length);
                if (toIndex === i) {
                    // Wasn't meant to be.
                    continue;
                }
                const to = points[toIndex];
                this.lines.push(this.drawLine(from, to));
            }

        }

        if (this.points) {
            for (let i = 0; i < this.points.length; i++) {
                if (this.pointPositions[i] !== null) {
                    this.points[i].material.visible = true;
                }
            }
        }

        let originalPointPositions;
        if (!this.points) {
            originalPointPositions = Array(this.numPoints).fill(null);
        } else {
            originalPointPositions = this.points.map(p => p !== null ? p.position.clone() : null)
        }
        this.runningAnimation = {
            startTime: performance.now(),
            endTime: performance.now() + this.transitionSpeed,
            originalPointPositions,
            originalCameraOrbitRadius,
        };
    }

    drawLine(start, end) {
        const material = new THREE.LineBasicMaterial({
            color: 0xa1cfe8,
            transparent: true,
            opacity: 0
        });
        const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(...start),
            new THREE.Vector3(...end)
        ]);
        const line = new THREE.Line(geometry, material);
        this.scene.add(line);
        return line;
    }

    resizeRendererToDisplaySize() {
        const canvas = this.renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            this.renderer.setSize(width, height, false);
        }
        return needResize;
    }

    animatePoints(progress) {
        for (let i = 0; i < this.points.length; i++) {
            const point = this.points[i];
            let originalPosition = this.runningAnimation.originalPointPositions[i];
            let pointPosition = this.pointPositions[i];
            if (originalPosition === null) {
                originalPosition = new THREE.Vector3(0, 0, 0);
            }
            if (pointPosition === null) {
                pointPosition = new THREE.Vector3(0, 0, 0);
            }

            const { x, y, z } = pointLinearInterp(originalPosition, pointPosition, progress);
            point.position.set(x, y, z);
        }
    }

    animateLines(progress) {
        if (this.currentConfigeration !== 'code') {
            return;
        }
        for (const line of this.lines) {
            line.material.opacity = progress * this.lineOpacity;
        }
    }

    animate() {
        this.animationFrameRequestId = requestAnimationFrame(() => this.animate());
        STATS.update();
        let orbitRadius = this.orbitRadius;

        if (this.runningAnimation) {
            let progress;
            const { startTime, endTime } = this.runningAnimation;
            if (performance.now() >= endTime) {
                progress = 1;
            } else {
                progress = easeCurve((performance.now() - startTime) / (endTime - startTime));
            }
            this.animatePoints(progress);
            this.animateLines(progress);
            orbitRadius = linearInterp(this.runningAnimation.originalCameraOrbitRadius, this.orbitRadius, progress);

            if (progress === 1) {
                this.runningAnimation = null;
                for (let i = 0; i < this.numPoints; i++) {
                    if (this.pointPositions[i] === null) {
                        this.points[i].material.visible = false;
                    }
                }
            }
        }

        const x = Math.sin(this.cameraAngle) * orbitRadius;
        const z = Math.cos(this.cameraAngle) * orbitRadius;
        this.camera.position.set(x, 0, z);
        this.camera.lookAt(0, 0, 0);
        this.cameraAngle += this.orbitSpeed;
        if (this.resizeRendererToDisplaySize()) {
            const canvas = this.renderer.domElement;
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            this.camera.updateProjectionMatrix();
        }

        this.renderer.render(this.scene, this.camera);
    };

    setConfigeration(configeration) {
        if (!POINT_CLOUD_CONFIGERATIONS.includes(configeration)) {
            throw new Error(
                `Bro!!!! ${configeration} is not a known cloud configeration.`);
        }
        if (configeration === this.currentConfigeration) {
            return;
        }
        this.currentConfigeration = configeration;
        this.buildConfigeration();
    }

    setPointSize(pointSize) {
        this.pointSize = pointSize;
        this.buildConfigeration();
        this.initScene();
    }

    killMesh(mesh) {
        mesh.geometry.dispose();
        mesh.material.dispose();
        this.scene.remove(mesh);
    }

    setPointCount(pointCount) {
        if (this.animationFrameRequestId) {
            cancelAnimationFrame(this.animationFrameRequestId);
            this.runningAnimation = null;
        }
        this.numPoints = pointCount;
        if (this.points) {
            for (const point of this.points) {
                this.killMesh(point);
            }
        }
        this.points = undefined;
        this.buildConfigeration();
        this.initScene();
        this.animate();
    }
}

function init() {
    const bgController = new BackgroundController(
        document.querySelector('canvas'), {
            'chrome': constructMask('#chrome'),
            'design': constructMask('#design'),
        }
    );

    document.querySelector('#stats-container').append(STATS.dom);

    for (const config of POINT_CLOUD_CONFIGERATIONS) {
        const option = document.createElement('option');
        option.value = config;
        option.innerText = config;
        document.querySelector('#cloud-configerations').append(option);
    }
    document.querySelector('#cloud-configerations').addEventListener('change', (e) => {
        bgController.setConfigeration(e.target.value);
    });

    document.querySelector('#stats-type').addEventListener('change', (e) => {
        STATS.showPanel(
            ['fps', 'ms', 'mb'].indexOf(e.target.value)
        );
    });

    document.querySelector('#point-size').addEventListener('change', (e) => {
        bgController.setPointSize(e.target.value);
    });
    document.querySelector('#point-count').value = bgController.numPoints;
    document.querySelector('#point-count-val').innerText = bgController.numPoints;
    document.querySelector('#point-count').addEventListener('change', (e) => {
        const v = Number(e.target.value);
        bgController.setPointCount(v);
        document.querySelector('#point-count-val').innerText = v;
    });
}

window.onload = init;
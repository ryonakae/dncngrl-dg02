import THREE from 'three';
import gsap from 'gsap';
import OrbitControls from '../lib/OrbitControls.js';
// import bas from '../lib/bas.js';

class SlideGeometry {
  constructor(model) {
    this.model = model;
  }
}

class Slide {
  constructor(width, height, animationPhase) {
    this.width = width;
    this.height = height;
    this.animationPhase = animationPhase;

    // 平面作る
    const plane = new THREE.PlaneGeometry(width, height, width*2, height*2);
  }
}

export default class Particle {
  constructor() {
    this.renderer;
    this.scene;
    this.camera;
    this.controls;
    this.width = 640;
    this.height = 480;
  }

  init() {
    console.log(THREE);
    console.log(OrbitControls);
    console.log(TweenMax);

    const container = document.body;
    const width = 640;
    const height = 480;

    const slide = new Slide(width, height, 'out');
    console.log(slide);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0xffffff, 0, 3000);

    this.camera = new THREE.PerspectiveCamera(60, width/height, 1, 10000);
    this.camera.position.z = 420;

    this.controls = new OrbitControls(this.camera);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0xFFFFFF, 1.0);

    container.appendChild(this.renderer.domElement);
  }
}
import THREE from 'three';
// import OrbitControls from '../lib/OrbitControls.js';


// Canvas Class
export default class Canvas {
  constructor(dom, magnification) {
    this.dom = dom;
    this.magnification = magnification;

    this.container = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.controls = null;
  }

  init() {
    // scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x000000, 0, 3000);

    // camera
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 10, 10000);
    this.setCameraAsPixelSize();
    this.camera.lookAt(this.scene.position);

    // renderer
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      // antialias: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);

    // controls
    // this.controls = new OrbitControls(this.camera);

    // container
    this.container = this.dom;
    this.container.appendChild(this.renderer.domElement);

    // do animation
    this.animate();

    // listen resize event
    this.resize = this.resize.bind(this);
    this.resize();
    window.addEventListener('resize', this.resize, false);

    console.log('canvas init', this.dom);
  }

  animate() {
    this.render();
    requestAnimationFrame(() => {
      this.animate();
    });
  }

  render() {
    // this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.setCameraAsPixelSize();
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  setCameraAsPixelSize() {
    // ピクセル等倍にする(canvasのサイズでオブジェクトの大きさを変えない)
    // http://ikeryou.jp/log/?p=242
    const cameraZ = ((window.innerHeight/2) / Math.tan((this.camera.fov * Math.PI/180)/2)) / -this.magnification;
    this.camera.position.z = -cameraZ;
  }
}
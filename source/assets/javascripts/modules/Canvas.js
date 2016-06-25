window.jQuery = window.$ = require('jquery');
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

    this.requestId = null;
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
    this.resize();
    $(window).on('resize.canvasResize', ()=>{
      this.resize();
    });

    console.log('canvas init', this);
  }

  animate() {
    this.requestId = requestAnimationFrame(this.animate.bind(this));

    this.render();
  }

  stopAnimate(){
    cancelAnimationFrame(this.requestId);
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

  destroy(){
    // sceneからmeshを削除
    for (let i = this.scene.children.length-1; i >= 0; i--) {
      const mesh = this.scene.children[i];
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();

      // 最後なら
      if(i == 0){
        // canvas消す
        this.container.removeChild(this.renderer.domElement);

        // もろもろ消す
        this.stopAnimate(); //アニメーション止める
        this.scene = null;
        this.camera = null;
        this.controls = null;
        this.renderer = null;

        // resizeイベントをoff
        $(window).off('.canvasResize');

        console.log('canvas destroy', this);
      }
    }
  }
}
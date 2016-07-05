import THREE from 'three';
import gsap from 'gsap';
const SimplexNoise = require('../lib/SimplexNoise');


// wave class
export default class Wave extends THREE.Mesh{
  constructor(){
    super();

    this.requestId = null;

    this.geometry = null;
    this.material = null;

    this.clock = new THREE.Clock(true);
    this.delta = null;
    this.timeScale = 0.3;
    this.tick = null;
    this.radian = (Math.PI/180);

    this.simplexNoise = null;

    this.init();
  }

  init(){
    this.geometry = new THREE.PlaneGeometry(5000, 5000, 64, 64);
    this.material = new THREE.MeshLambertMaterial({
      color: 0x000000,
      transparent: true,
      wireframe: true,
      // antialias: true,
      // blending: THREE.AdditiveBlending,
    });

    // this.rotation.x = -90 / 180 * Math.PI;
    // this.rotation.z = -10 / 180*Math.PI;

    this.simplexNoise = new SimplexNoise();

    //console.log(this);
  }

  animate(){
    this.requestId = requestAnimationFrame(this.animate.bind(this));

    // 頂点の変更を有効にする
    this.geometry.verticesNeedUpdate = true;

    this.delta = this.clock.getDelta();
    this.tick += this.delta * this.timeScale;

    for(let i = 0; i < this.geometry.vertices.length; i++){
      const vertex = this.geometry.vertices[i];
      vertex.z = this.simplexNoise.noise(Math.sin(this.tick + i*10), Math.cos(this.tick + i*10)) * 20;
    }
  }

  stopAnimate(){
    cancelAnimationFrame(this.requestId);
  }

  in(duration, cb){
    this.animate();

    TweenMax.fromTo(this.rotation, duration, {
      x: -45 / 180 * Math.PI,
      z: -45 / 180 * Math.PI,
    }, {
      x: -90 / 180 * Math.PI,
      z: 0,
      ease: Power1.easeInOut,
    });

    TweenMax.to(this.material, duration, {
      opacity: 1,
      ease: Power1.easeInOut,
      onComplete: ()=>{
        //console.log('wave in');
        cb();
      }
    });
  }

  out(duration, cb){
    TweenMax.fromTo(this.rotation, duration, {
      x: -90 / 180 * Math.PI,
      z: 0,
    }, {
      x: -45 / 180 * Math.PI,
      z: -45 / 180 * Math.PI,
      ease: Power1.easeInOut,
    });

    TweenMax.to(this.material, duration, {
      opacity: 0,
      ease: Power1.easeInOut,
      onComplete: ()=>{
        this.stopAnimate();
        //console.log('wave out');
        cb();
      }
    });
  }

  resize(){}
}
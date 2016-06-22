import THREE from 'three';
import gsap from 'gsap';
require('../lib/GPUParticleSystem');


// particle class
export default class Particle {
  constructor(count) {
    this.tick = null;
    this.clock = new THREE.Clock(true);
    this.requestId = null;

    this.particleSystem = new THREE.GPUParticleSystem({
      maxParticles: count,
    });

    this.options = {
      position: new THREE.Vector3(),
      positionRandomness: 30, //4
      velocity: new THREE.Vector3(),
      velocityRandomness: 30, //4
      color: 0xffffff,
      colorRandomness: 0.2,
      turbulence: 0.78, //0.78
      lifetime: 1, //10
      size: 0, //4
      sizeRandomness: 0,
    };
    this.spawnerOptions = {
      spawnRate: 30000,
      horizontalSpeed: 1.5,
      verticalSpeed: 1.24,
      timeScale: 0.3 //0.4
    };

    console.log(this);
    this.frustumCulled = false;
  }

  animate(){
    this.requestId = requestAnimationFrame(this.animate.bind(this));

    var delta = this.clock.getDelta() * this.spawnerOptions.timeScale;
    // console.log(delta);
    this.tick += delta;
    if (this.tick < 0) this.tick = 0;

    if (delta > 0) {
      this.options.position.x = Math.cos(this.tick * this.spawnerOptions.horizontalSpeed) * 7;
      this.options.position.y = Math.sin(this.tick * this.spawnerOptions.verticalSpeed) * 4;
      this.options.position.z = Math.sin(this.tick * this.spawnerOptions.horizontalSpeed + this.spawnerOptions.verticalSpeed) * 5;
      for (var x = 0; x < this.spawnerOptions.spawnRate * delta; x++) {
        // Yep, that's really it.	Spawning particles is super cheap, and once you spawn them, the rest of
        // their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
        this.particleSystem.spawnParticle(this.options);
      }
    }

    this.particleSystem.update(this.tick);
    console.log('particle update');
  }

  stopAnimate(){
    cancelAnimationFrame(this.requestId);
  }

  fadeIn(duration, cb){
    this.animate();

    TweenMax.to(this.options, duration, {
      positionRandomness: 5,
      velocityRandomness: 5,
      lifetime: 10,
      size: 4,
      ease: Power3.easeInOut,
      onComplete: cb
    });
    TweenMax.to(this.spawnerOptions, duration, {
      timeScale: 0.3,
      ease: Power3.easeInOut
    });
  }

  fadeOut(duration, cb){
    TweenMax.to(this.options, duration, {
      positionRandomness: 30,
      velocityRandomness: 30,
      lifetime: 1,
      size: 0,
      ease: Power3.easeInOut,
      onComplete: cb
    });
    TweenMax.to(this.spawnerOptions, duration, {
      timeScale: 1,
      ease: Power3.easeInOut,
      onComplete: ()=>{
        setTimeout(()=>{
          this.stopAnimate();
          console.log('particle stop');
        }, duration*1000 * 1.5);
      }
    });
  }
}
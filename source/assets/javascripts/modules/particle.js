import THREE from 'three';
require('../lib/GPUParticleSystem');


// particle class
export default class Particle {
  constructor(count) {
    this.tick = null;
    this.clock = new THREE.Clock(true);

    this.particleSystem = new THREE.GPUParticleSystem({
      maxParticles: count,
    });

    this.options = {
      position: new THREE.Vector3(),
      positionRandomness: 1.3,
      velocity: new THREE.Vector3(),
      velocityRandomness: 1.5,
      color: 0xffffff,
      colorRandomness: 0,
      turbulence: .8,
      lifetime: 10,
      size: 5,
      sizeRandomness: 1,
    };
    this.spawnerOptions = {
      spawnRate: 1000,
      horizontalSpeed: 1.5,
      verticalSpeed: 1.33,
      timeScale: 0.2
    };

    console.log(this);
    this.frustumCulled = false;
  }

  animate(){
    requestAnimationFrame(()=>{
      this.animate();
    });

    var delta = this.clock.getDelta() * this.spawnerOptions.timeScale;
    this.tick += delta;
    if (this.tick < 0) this.tick = 0;

    if (delta > 0) {
      this.options.position.x = Math.sin(this.tick * this.spawnerOptions.horizontalSpeed) * 20;
      this.options.position.y = Math.sin(this.tick * this.spawnerOptions.verticalSpeed) * 10;
      this.options.position.z = Math.sin(this.tick * this.spawnerOptions.horizontalSpeed + this.spawnerOptions.verticalSpeed) * 5;
      for (var x = 0; x < this.spawnerOptions.spawnRate * delta; x++) {
        // Yep, that's really it.	Spawning particles is super cheap, and once you spawn them, the rest of
        // their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
        this.particleSystem.spawnParticle(this.options);
      }
    }

    this.particleSystem.update(this.tick);
  }
}
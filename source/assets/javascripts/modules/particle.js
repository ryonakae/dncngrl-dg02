import THREE from 'three';
import gsap from 'gsap';


// particle class
export default class Particle extends THREE.Points {
  constructor(count) {
    super(); // 子Classはsuper();する必要あり

    this.geometry = null;
    this.count = count;
    this.material = null;
    this.particles = null;
  }

  init() {
    this.geometry = new THREE.Geometry();
    this.material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 2,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    for (let i = 0; i < this.count; i++) {
      const vertex = new THREE.Vector3();
      vertex.x = (Math.random() - 0.5) * 1000;
      vertex.y = (Math.random() - 0.5) * 1000;
      vertex.z = (Math.random() - 0.5) * 1000;

      this.geometry.vertices.push(vertex);
    }

    this.particles = new THREE.Points(this.geometry, this.material);
    this.particles.sortPoints = true;

    this.frustumCulled = false;
    console.log(this.particles);
  }
}
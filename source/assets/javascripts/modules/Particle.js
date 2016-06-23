import THREE from 'three';
import gsap from 'gsap';


// particle class
export default class Particle extends THREE.Points {
  constructor(count) {
    super();

    this.requestId = null;

    this.geometry = null;
    this.count = count;
    this.material = null;
    this.particles = null;

    this.friction = 0.01;
    this.mass = 1.0;
    this.force = new THREE.Vector3();
    this.velocity = new THREE.Vector3();

    this.init();
  }

  resetForce(){
    this.force.set(0, 0, 0);
  }

  addForce(force){
    this.force.add(force / this.mass);
  }

  updateForce(){
    this.force.sub(this.velocity * this.friction);
  }

  updatePos(vertex){
    this.velocity.add(this.force);
    vertex.add(this.velocity);
  }

  update(){
    this.updateForce();
    this.updatePos();
  }

  // http://yoppa.org/ma2_14/5837.html
  addAttractionForce(vertex, x, y, z, radius, scale){
    const posOfForce = new THREE.Vector3();
    posOfForce.set(x, y, z);

    const diff = vertex.sub(posOfForce);
    const length = diff.length();

    let bAmCloseEnough = true;
    if(radius > 0){
      if(length > radius){
        bAmCloseEnough = false;
      }
    }
    if(bAmCloseEnough == true){
      const pct = 1 - (length/radius);
      diff.normalize();
      this.force.x = this.force.x - diff.x * scale * pct;
      this.force.y = this.force.y - diff.y * scale * pct;
      this.force.z = this.force.z - diff.z * scale * pct;
    }
  }

  init(){
    this.geometry = new THREE.Geometry();
    this.material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 2,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    for (let i = 0; i < this.count; i++) {
      const particle = new THREE.Vector3();
      particle.x = (Math.random() - 0.5) * 1000;
      particle.y = (Math.random() - 0.5) * 1000;
      particle.z = (Math.random() - 0.5) * 1000;

      this.geometry.vertices.push(particle);
    }

    this.particles = new THREE.Points(this.geometry, this.material);
    this.particles.sortPoints = true;

    this.frustumCulled = false;
    console.log(this);

    // this.animate();
  }

  animate(){
    this.requestId = requestAnimationFrame(this.animate.bind(this));
  }

  stopAnimate(){
    cancelAnimationFrame(this.requestId);
  }

  fadeIn(duration, cb){
  }

  fadeOut(duration, cb){
  }
}
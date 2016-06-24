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

    this.posOfForce = new THREE.Vector3(0, 0, 0);
    this.timeScale = 0.1;
    this.tick = null;
    this.clock = new THREE.Clock(true);
    this.horizontalSpeed = 1.5;
    this.verticalSpeed = 1.24;

    this.init();
  }

  init(){
    this.geometry = new THREE.Geometry();
    this.material = new THREE.PointsMaterial({
      color: 0x000000,
      size: 1,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    // それぞれのパーティクル
    for (let i = 0; i < this.count; i++) {
      const vertex = new THREE.Vector3(0, 0, 0);
      vertex.x = (Math.random() - 0.5) * 500;
      vertex.y = (Math.random() - 0.5) * 500;
      vertex.z = (Math.random() - 0.5) * 50;

      vertex.velocity = new THREE.Vector3(0, 0, 0);
      vertex.force = new THREE.Vector3(0, 0, 0);
      vertex.friction = 0.01;
      vertex.mass = 1.0;

      // geometryにパーティクルのデータを追加
      this.geometry.vertices.push(vertex);
    }

    this.particles = new THREE.Points(this.geometry, this.material);
    this.particles.sortPoints = true;

    this.frustumCulled = false;
    console.log(this.particles);
    console.log(this.geometry.vertices[0]);

    this.animate();
  }

  animate(){
    this.requestId = requestAnimationFrame(this.animate.bind(this));

    // 頂点の変更を有効にする
    this.geometry.verticesNeedUpdate = true;

    // posOfForceを動かす
    const delta = this.clock.getDelta() * this.timeScale;
    this.tick += delta;
    this.posOfForce.x = Math.cos(this.tick * this.horizontalSpeed) * 50;
    this.posOfForce.y = Math.sin(this.tick * this.verticalSpeed) * 40;
    this.posOfForce.z = Math.sin(this.tick * this.horizontalSpeed + this.verticalSpeed) * 5;

    // それぞれのパーティクルのアニメーション
    for (let i = 0; i < this.count; i++) {
      const particle = this.geometry.vertices[i];
      this.vertexUpdate(particle, this.posOfForce);
    }

    // console.log(this.geometry.vertices[0].velocity);
    // console.log(this.posOfForce.x);
  }

  stopAnimate(){
    cancelAnimationFrame(this.requestId);
  }

  fadeIn(duration, cb){
  }

  fadeOut(duration, cb){
  }

  vertexUpdate(vertex, posOfForce){
    vertex.force.x = vertex.force.x - vertex.velocity.x * vertex.friction;
    vertex.force.y = vertex.force.y - vertex.velocity.y * vertex.friction;
    vertex.force.z = vertex.force.z - vertex.velocity.z * vertex.friction;

    this.vertexAddAttraction(vertex, posOfForce.x, posOfForce.y, posOfForce.z, 2000, 0.005);

    vertex.velocity.x = vertex.velocity.x + vertex.force.x * 0.1;
    vertex.velocity.y = vertex.velocity.y + vertex.force.y * 0.1;
    vertex.velocity.z = vertex.velocity.z + vertex.force.z * 0.1;

    vertex.x = vertex.x + vertex.velocity.x;
    vertex.y = vertex.y + vertex.velocity.y;
    vertex.z = vertex.z + vertex.velocity.z;
  }

  vertexAddAttraction(vertex, forceX, forceY, forceZ, radius, scale){
    const posOfForce = new THREE.Vector3(forceX, forceY, forceZ);

    let diff = new THREE.Vector3;
    diff.x = vertex.x - posOfForce.x;
    diff.y = vertex.y - posOfForce.y;
    diff.z = vertex.z - posOfForce.z;

    const length = diff.length();

    let bAmCloseEnough = true;

    if(radius > 0){
      if(length > radius){
        bAmCloseEnough = false;
      }
    }

    if(bAmCloseEnough == true) {
      const pct = 1 - (length / radius);
      diff.normalize();
      vertex.force.x = vertex.force.x - diff.x * scale * pct;
      vertex.force.y = vertex.force.y - diff.y * scale * pct;
      vertex.force.z = vertex.force.y - diff.y * scale * pct;
    }
  }
}
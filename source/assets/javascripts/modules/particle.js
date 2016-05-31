import THREE from 'three';
import gsap from 'gsap';
import OrbitControls from '../lib/OrbitControls.js';
import Bas from '../lib/bas.js';

export function particle() {
  new Bas();

  let renderer, scene, camera, controls;
  const width = 640;
  const height = 480;

  init();

  function init() {
    // console.log(THREE);
    // console.log(OrbitControls);
    // console.log(TweenMax);

    const container = document.body;
    const width = 640;
    const height = 480;

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 0, 3000);

    camera = new THREE.PerspectiveCamera(60, width/height, 1, 10000);
    camera.position.z = 100;

    controls = new OrbitControls(camera);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 1.0);

    const axis = new THREE.AxisHelper(200);
    axis.position.set(0, 0, 0);
    // scene.add(axis);

    // add slide
    const slide = new Slide(100, 100, 'out');
    slide.setImage(new THREE.ImageLoader().load('./assets/images/sample.jpg'));
    scene.add(slide);

    const timeline = new TimelineMax({repeat:-1, repeatDelay:1.0, yoyo: true});
    timeline.add(TweenMax.fromTo(slide, 4.0, {time:0.0}, {time:slide.totalDuration, ease:Power0.easeInOut}));

    container.appendChild(renderer.domElement);

    animate();
  }

  function animate() {
    render();
    requestAnimationFrame(animate);
  }

  function render() {
    controls.update();
    renderer.render(scene, camera);
  }
}

class Slide extends THREE.Mesh {
  constructor(width, height, animationPhase){
    // 子Classはsuper();する必要あり
    super();

    this.width = width;
    this.height = height;
    this.animationPhase = animationPhase;
    this.minDuration = 0.8;
    this.maxDuration = 1.2;
    this.maxDelayX = 0.9;
    this.maxDelayY = 0.125;
    this.stretch = 0.11;
    this.totalDuration = this.maxDuration + this.maxDelayX + this.maxDelayY + this.stretch;

    this.plane = new THREE.PlaneGeometry(this.width, this.height, this.width/2, this.height/2);
    THREE.BAS.Utils.separateFaces(this.plane);

    this.geometry = new THREE.BAS.ModelBufferGeometry(this.plane);
    this.geometry.bufferUVs();
    console.log(this.geometry, this.geometry.faceCount);

    this.bufferPositions();

    this.aAnimation = this.geometry.createAttribute('aAnimation', 2);
    this.aStartPosition = this.geometry.createAttribute('aStartPosition', 3);
    this.aControl0 = this.geometry.createAttribute('aControl0', 3);
    this.aControl1 = this.geometry.createAttribute('aControl1', 3);
    this.aEndPosition = this.geometry.createAttribute('aEndPosition', 3);

    this.startPosition = new THREE.Vector3();
    this.control0 = new THREE.Vector3();
    this.control1 = new THREE.Vector3();
    this.endPosition = new THREE.Vector3();
    this.tempPoint = new THREE.Vector3();

    let i, i2, i3, v;

    for (i = 0, i2 = 0, i3 = 0; i < this.geometry.faceCount; i++, i2 += 6, i3 += 9) {
      const planeFace = this.plane.faces[i];
      const centroid = THREE.BAS.Utils.computeCentroid(this.plane, planeFace);

      // animation
      const duration = THREE.Math.randFloat(this.minDuration, this.maxDuration);
      const delayX = THREE.Math.mapLinear(centroid.x, -this.width * 0.5, this.width * 0.5, 0.0, this.maxDelayX);
      let delayY;

      if (this.animationPhase === 'in') {
        delayY = THREE.Math.mapLinear(Math.abs(centroid.y), 0, this.height * 0.5, 0.0, this.maxDelayY);
      }
      else {
        delayY = THREE.Math.mapLinear(Math.abs(centroid.y), 0, this.height * 0.5, this.maxDelayY, 0.0);
      }

      for (v = 0; v < 6; v += 2) {
        this.aAnimation.array[i2 + v]     = delayX + delayY + (Math.random() * this.stretch * duration);
        this.aAnimation.array[i2 + v + 1] = duration;
      }

      // position
      this.endPosition.copy(centroid);
      this.startPosition.copy(centroid);

      if (this.animationPhase === 'in') {
        this.control0.copy(centroid).add(this.getControlPoint0(centroid));
        this.control1.copy(centroid).add(this.getControlPoint1(centroid));
      }
      else { // out
        this.control0.copy(centroid).sub(this.getControlPoint0(centroid));
        this.control1.copy(centroid).sub(this.getControlPoint1(centroid));
      }

      for (v = 0; v < 9; v += 3) {
        this.aStartPosition.array[i3 + v]     = this.startPosition.x;
        this.aStartPosition.array[i3 + v + 1] = this.startPosition.y;
        this.aStartPosition.array[i3 + v + 2] = this.startPosition.z;

        this.aControl0.array[i3 + v]     = this.control0.x;
        this.aControl0.array[i3 + v + 1] = this.control0.y;
        this.aControl0.array[i3 + v + 2] = this.control0.z;

        this.aControl1.array[i3 + v]     = this.control1.x;
        this.aControl1.array[i3 + v + 1] = this.control1.y;
        this.aControl1.array[i3 + v + 2] = this.control1.z;

        this.aEndPosition.array[i3 + v]     = this.endPosition.x;
        this.aEndPosition.array[i3 + v + 1] = this.endPosition.y;
        this.aEndPosition.array[i3 + v + 2] = this.endPosition.z;
      }
    }

    // material
    this.material = new THREE.BAS.BasicAnimationMaterial({
      shading: THREE.FlatShading,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {type: 'f', value: 0}
      },
      shaderFunctions: [
        THREE.BAS.ShaderChunk['cubic_bezier'],
        // THREE.BAS.ShaderChunk[(animationPhase === 'in' ? 'ease_out_cubic' : 'ease_in_cubic')],
        THREE.BAS.ShaderChunk['ease_in_out_cubic'],
        THREE.BAS.ShaderChunk['quaternion_rotation']
      ],
      shaderParameters: [
        'uniform float uTime;',
        'attribute vec2 aAnimation;',
        'attribute vec3 aStartPosition;',
        'attribute vec3 aControl0;',
        'attribute vec3 aControl1;',
        'attribute vec3 aEndPosition;',
      ],
      shaderVertexInit: [
        'float tDelay = aAnimation.x;',
        'float tDuration = aAnimation.y;',
        'float tTime = clamp(uTime - tDelay, 0.0, tDuration);',
        'float tProgress = ease(tTime, 0.0, 1.0, tDuration);'
        // 'float tProgress = tTime / tDuration;'
      ],
      shaderTransformPosition: [
        (this.animationPhase === 'in' ? 'transformed *= tProgress;' : 'transformed *= 1.0 - tProgress;'),
        'transformed += cubicBezier(aStartPosition, aControl0, aControl1, aEndPosition, tProgress);'
      ]
    }, {
      map: new THREE.Texture()
    });
    console.log(this.material);

    console.log(this);

    Object.defineProperty(this, 'time', {
      get: function () {
        return this.material.uniforms['uTime'].value;
      },
      set: function (v) {
        this.material.uniforms['uTime'].value = v;
      }
    });
  }

  bufferPositions() {
    const positionBuffer = this.geometry.createAttribute('position', 3).array;

    for (let i = 0; i < this.geometry.faceCount; i++) {
      const geomFace = this.geometry.modelGeometry.faces[i];
      const centroid = THREE.BAS.Utils.computeCentroid(this.geometry.modelGeometry, geomFace);

      const a = this.geometry.modelGeometry.vertices[geomFace.a];
      const b = this.geometry.modelGeometry.vertices[geomFace.b];
      const c = this.geometry.modelGeometry.vertices[geomFace.c];

      positionBuffer[geomFace.a * 3]     = a.x - centroid.x;
      positionBuffer[geomFace.a * 3 + 1] = a.y - centroid.y;
      positionBuffer[geomFace.a * 3 + 2] = a.z - centroid.z;

      positionBuffer[geomFace.b * 3]     = b.x - centroid.x;
      positionBuffer[geomFace.b * 3 + 1] = b.y - centroid.y;
      positionBuffer[geomFace.b * 3 + 2] = b.z - centroid.z;

      positionBuffer[geomFace.c * 3]     = c.x - centroid.x;
      positionBuffer[geomFace.c * 3 + 1] = c.y - centroid.y;
      positionBuffer[geomFace.c * 3 + 2] = c.z - centroid.z;
    }
  }

  getControlPoint0(centroid) {
    const signY = Math.sign(centroid.y);
    // const radian = centroid.y * (Math.PI / 180);
    // const signY = Math.cos(radian);

    this.tempPoint.x = THREE.Math.randFloat(0.1, 0.3) * 50;
    this.tempPoint.y = -signY * THREE.Math.randFloat(0.1, 0.3) * 70;
    this.tempPoint.z = THREE.Math.randFloatSpread(20);

    return this.tempPoint;
  }

  getControlPoint1(centroid) {
    const signY = Math.sign(centroid.y);
    // const radian = centroid.y * (Math.PI / 180);
    // const signY = Math.cos(radian);

    this.tempPoint.x = THREE.Math.randFloat(0.3, 0.6) * 50;
    this.tempPoint.y = signY * THREE.Math.randFloat(0.3, 0.6) * 70;
    this.tempPoint.z = THREE.Math.randFloatSpread(20);

    return this.tempPoint;
  }

  setImage(img) {
    this.material.uniforms.map.value.image = img;
    this.material.uniforms.map.value.needsUpdate = true;
  }
}
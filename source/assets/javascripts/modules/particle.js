import THREE from 'three';
import gsap from 'gsap';
// import OrbitControls from '../lib/OrbitControls.js';
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
    const width = window.innerWidth;
    const height = window.innerHeight;
    let mouseX;
    let mouseY;

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 0, 3000);

    // camera
    camera = new THREE.PerspectiveCamera(60, width/height, 1, 10000);

    // ピクセル等倍にする(canvasのサイズでオブジェクトの大きさを変えない)
    // http://ikeryou.jp/log/?p=242
    const magnification = 5.0; //倍率
    const cameraZ = ((height/2) / Math.tan((camera.fov * Math.PI/180)/2)) / -magnification;
    camera.position.z = -cameraZ;
    camera.lookAt(scene.position);

    // renderer
    renderer = new THREE.WebGLRenderer({
      // antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 1.0);

    // orbit controls
    // controls = new OrbitControls(camera);

    // axis helper
    // const axis = new THREE.AxisHelper(200);
    // axis.position.set(0, 0, 0);
    // scene.add(axis);

    // add slide
    const slide = new Slide(78, 110, 78*1.5, 110*1.5, 'in');
    slide.setImage(new THREE.ImageLoader().load('./assets/images/sample04.jpg'));
    slide.position.y = 10;
    scene.add(slide);

    // slide parallax
    const defaultRotateX = -0.13;
    const defaultRotateY = -0.15;

    slide.rotation.x = defaultRotateX;
    slide.rotation.y = defaultRotateY;

    document.body.addEventListener('mousemove', (e) => {
      mouseX = e.pageX - window.innerWidth/2;
      mouseY = e.pageY - window.innerHeight/2;

      slide.rotation.x = defaultRotateX + mouseY * 0.0002;
      slide.rotation.y = defaultRotateY + mouseX * 0.0002;
    }, false);

    setTimeout(() => {
      const timeline = new TimelineMax({repeat:-1, repeatDelay:2.0, yoyo: true});
      timeline.add(TweenMax.fromTo(slide, 7.0, {time:0.0}, {time:slide.totalDuration, ease:Power0.easeInOut}));
    }, 2000);

    container.appendChild(renderer.domElement);

    animate();
  }

  function animate() {
    render();
    requestAnimationFrame(animate);
  }

  function render() {
    // controls.update();
    renderer.render(scene, camera);
  }
}

class Slide extends THREE.Mesh {
  constructor(width, height, divisionX, divisionY, animationPhase){
    super(); // 子Classはsuper();する必要あり

    this.width = width;
    this.height = height;
    this.divisionX = divisionX;
    this.divisionY = divisionY;
    this.animationPhase = animationPhase;
    this.minDuration = 0.8;
    this.maxDuration = 1.2;
    this.maxDelayX = 0.5;
    this.maxDelayY = 0;
    this.stretch = 0.11;
    this.totalDuration = this.maxDuration + this.maxDelayX + this.maxDelayY + this.stretch;

    this.plane = new THREE.PlaneGeometry(this.width, this.height, this.divisionX, this.divisionY);
    THREE.BAS.Utils.separateFaces(this.plane);

    this.geometry = new THREE.BAS.ModelBufferGeometry(this.plane);
    this.geometry.bufferUVs();
    console.log(this.geometry, this.geometry.faceCount);

    this.bufferPositions();

    this.aAnimation = this.geometry.createAttribute('aAnimation', 2);
    this.aStartPosition = this.geometry.createAttribute('aStartPosition', 3);
    this.aControl0 = this.geometry.createAttribute('aControl0', 3);
    this.aControl1 = this.geometry.createAttribute('aControl1', 3);
    this.aControl2 = this.geometry.createAttribute('aControl2', 3);
    this.aEndPosition = this.geometry.createAttribute('aEndPosition', 3);

    this.startPosition = new THREE.Vector3();
    this.control0 = new THREE.Vector3();
    this.control1 = new THREE.Vector3();
    this.control2 = new THREE.Vector3();
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
      else if (this.animationPhase === 'out') {
        delayY = THREE.Math.mapLinear(Math.abs(centroid.y), 0, this.height * 0.5, this.maxDelayY, 0.0);
      }

      for (v = 0; v < 6; v += 2) {
        this.aAnimation.array[i2 + v]     = delayX + delayY + (Math.random() * this.stretch * duration);
        this.aAnimation.array[i2 + v + 1] = duration;
      }

      // startPosition
      this.startPosition.copy(centroid);
      if (this.animationPhase === 'in') {
        for (v = 0; v < 9; v += 3) {
          this.aStartPosition.array[i3 + v    ] = centroid.x;
          this.aStartPosition.array[i3 + v + 1] = centroid.y + 200;
          this.aStartPosition.array[i3 + v + 2] = centroid.z - 150;
        }
      }
      else if (this.animationPhase === 'out') {
        for (v = 0; v < 9; v += 3) {
          this.aStartPosition.array[i3 + v    ] = centroid.x;
          this.aStartPosition.array[i3 + v + 1] = centroid.y;
          this.aStartPosition.array[i3 + v + 2] = centroid.z;
        }
      }

      // controls
      this.control0.x = centroid.x + THREE.Math.randFloat(-120, 120) * -1;
      this.control0.y = centroid.y + this.height/1.5 * THREE.Math.randFloat(0.0, 3.0);
      this.control0.z = THREE.Math.randFloat(-30, -60);

      this.control1.x = centroid.x + THREE.Math.randFloat(-120, 120) * 1;
      this.control1.y = centroid.y + this.height/1.5 * THREE.Math.randFloat(0.0, 3.0);
      this.control1.z = THREE.Math.randFloat(-60, -90);

      this.control0.x = centroid.x + THREE.Math.randFloat(-120, 120) * -1;
      this.control0.y = centroid.y + this.height/1.5 * THREE.Math.randFloat(0.0, 3.0);
      this.control0.z = THREE.Math.randFloat(-90, -120);

      for (v = 0; v < 9; v += 3) {
        this.aControl0.array[i3 + v]     = this.control0.x;
        this.aControl0.array[i3 + v + 1] = this.control0.y;
        this.aControl0.array[i3 + v + 2] = this.control0.z;

        this.aControl1.array[i3 + v]     = this.control1.x;
        this.aControl1.array[i3 + v + 1] = this.control1.y;
        this.aControl1.array[i3 + v + 2] = this.control1.z;

        this.aControl2.array[i3 + v]     = this.control2.x;
        this.aControl2.array[i3 + v + 1] = this.control2.y;
        this.aControl2.array[i3 + v + 2] = this.control2.z;
      }

      // endPosition
      this.endPosition.copy(this.startPosition);
      if (this.animationPhase === 'in') {
        for (v = 0; v < 9; v += 3) {
          this.aEndPosition.array[i3 + v]     = this.endPosition.x;
          this.aEndPosition.array[i3 + v + 1] = this.endPosition.y;
          this.aEndPosition.array[i3 + v + 2] = this.endPosition.z;
        }
      }
      else if (this.animationPhase === 'out') {
        for (v = 0; v < 9; v += 3) {
          this.aEndPosition.array[i3 + v]     = this.endPosition.x;
          this.aEndPosition.array[i3 + v + 1] = this.endPosition.y + 200;
          this.aEndPosition.array[i3 + v + 2] = this.endPosition.z - 150;
        }
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
    this.frustumCulled = false;

    this.defineProperty();
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

    this.tempPoint.x = THREE.Math.randFloat(0.1, 0.3) * 50;
    this.tempPoint.y = -signY * THREE.Math.randFloat(0.1, 0.3) * 70;
    this.tempPoint.z = THREE.Math.randFloatSpread(20);

    return this.tempPoint;
  }

  getControlPoint1(centroid) {
    const signY = Math.sign(centroid.y);

    this.tempPoint.x = THREE.Math.randFloat(0.3, 0.6) * 50;
    this.tempPoint.y = signY * THREE.Math.randFloat(0.3, 0.6) * 70;
    this.tempPoint.z = THREE.Math.randFloatSpread(20);

    return this.tempPoint;
  }

  setImage(img) {
    this.material.uniforms.map.value.minFilter = THREE.LinearFilter;
    this.material.uniforms.map.value.magFilter = THREE.LinearFilter;

    this.material.uniforms.map.value.image = img;
    this.material.uniforms.map.value.needsUpdate = true;

    console.log(this.material.uniforms.map.value);
  }

  defineProperty() {
    Object.defineProperty(this, 'time', {
      get: function () {
        return this.material.uniforms['uTime'].value;
      },
      set: function (v) {
        this.material.uniforms['uTime'].value = v;
      }
    });
  }
}
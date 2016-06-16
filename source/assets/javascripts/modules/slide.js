import THREE from 'three';
import gsap from 'gsap';
import Bas from '../lib/bas.js';


// Slide Class
export default class Slide extends THREE.Mesh {
  constructor(width, height, divisionX, divisionY, animationPhase){
    super(); // 子Classはsuper();する必要あり

    new Bas();

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
    console.log(THREE.BAS);
    THREE.BAS.Utils.separateFaces(this.plane);

    this.geometry = new THREE.BAS.ModelBufferGeometry(this.plane);
    this.geometry.bufferUVs();
    console.log(this.geometry, this.geometry.faceCount);

    this.bufferPositions();

    this.aAnimationIn = this.geometry.createAttribute('aAnimationIn', 2);
    this.aAnimationOut = this.geometry.createAttribute('aAnimationOut', 2);
    this.aStartPositionIn = this.geometry.createAttribute('aStartPositionIn', 3);
    this.aStartPositionOut = this.geometry.createAttribute('aStartPositionOut', 3);
    this.aControl0 = this.geometry.createAttribute('aControl0', 3);
    this.aControl1 = this.geometry.createAttribute('aControl1', 3);
    this.aControl2 = this.geometry.createAttribute('aControl2', 3);
    this.aEndPositionIn = this.geometry.createAttribute('aEndPositionIn', 3);
    this.aEndPositionOut = this.geometry.createAttribute('aEndPositionOut', 3);

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
      let delayYIn, delayYOut;

      delayYIn = THREE.Math.mapLinear(Math.abs(centroid.y), 0, this.height * 0.5, 0.0, this.maxDelayY);
      delayYOut = THREE.Math.mapLinear(Math.abs(centroid.y), 0, this.height * 0.5, this.maxDelayY, 0.0);

      for (v = 0; v < 6; v += 2) {
        this.aAnimationIn.array[i2 + v]     = delayX + delayYIn + (Math.random() * this.stretch * duration);
        this.aAnimationIn.array[i2 + v + 1] = duration;

        this.aAnimationOut.array[i2 + v]     = delayX + delayYOut + (Math.random() * this.stretch * duration);
        this.aAnimationOut.array[i2 + v + 1] = duration;
      }

      // startPosition
      this.startPosition.copy(centroid);
      for (v = 0; v < 9; v += 3) {
        this.aStartPositionIn.array[i3 + v    ] = centroid.x;
        this.aStartPositionIn.array[i3 + v + 1] = centroid.y + 200;
        this.aStartPositionIn.array[i3 + v + 2] = centroid.z - 150;

        this.aStartPositionOut.array[i3 + v    ] = centroid.x;
        this.aStartPositionOut.array[i3 + v + 1] = centroid.y;
        this.aStartPositionOut.array[i3 + v + 2] = centroid.z;
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
      for (v = 0; v < 9; v += 3) {
        this.aEndPositionIn.array[i3 + v]     = this.endPosition.x;
        this.aEndPositionIn.array[i3 + v + 1] = this.endPosition.y;
        this.aEndPositionIn.array[i3 + v + 2] = this.endPosition.z;

        this.aEndPositionOut.array[i3 + v]     = this.endPosition.x;
        this.aEndPositionOut.array[i3 + v + 1] = this.endPosition.y + 200;
        this.aEndPositionOut.array[i3 + v + 2] = this.endPosition.z - 150;
      }
    }

    // material
    this.material = new THREE.BAS.BasicAnimationMaterial({
      shading: THREE.FlatShading,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {value: 0},
        uAnimationPhase: {value: 1} // in:0 / out:1
      },
      vertexFunctions: [
        THREE.BAS.ShaderChunk['cubic_bezier'],
        // THREE.BAS.ShaderChunk[(animationPhase === 'in' ? 'ease_out_cubic' : 'ease_in_cubic')],
        THREE.BAS.ShaderChunk['ease_cubic_in_out'],
        THREE.BAS.ShaderChunk['quaternion_rotation']
      ],
      vertexParameters: [
        'uniform float uTime;',
        'uniform int uAnimationPhase;',
        'attribute vec2 aAnimationIn;',
        'attribute vec2 aAnimationOut;',
        'attribute vec3 aStartPositionIn;',
        'attribute vec3 aStartPositionOut;',
        'attribute vec3 aControl0;',
        'attribute vec3 aControl1;',
        'attribute vec3 aEndPositionIn;',
        'attribute vec3 aEndPositionOut;',
      ],
      vertexInit: [
        'float tDelay;',
        'float tDuration;',
        'uAnimationPhase == 0 ? tDelay = aAnimationIn.x : tDelay = aAnimationOut.x;',
        'uAnimationPhase == 0 ? tDuration = aAnimationIn.y : tDuration = aAnimationOut.y;',
        'float tTime = clamp(uTime - tDelay, 0.0, tDuration);',
        'float tProgress = easeCubicInOut(tTime, 0.0, 1.0, tDuration);'
        // 'float tProgress = tTime / tDuration;'
      ],
      vertexNormal: [],
      vertexPosition: [
        // (this.animationPhase === 'in' ? 'transformed *= tProgress;' : 'transformed *= 1.0 - tProgress;'),
        'uAnimationPhase == 0 ? transformed *= tProgress : transformed *= 1.0 - tProgress;',
        'uAnimationPhase == 0 ? transformed += cubicBezier(aStartPositionIn, aControl0, aControl1, aEndPositionIn, tProgress) : transformed += cubicBezier(aStartPositionOut, aControl0, aControl1, aEndPositionOut, tProgress);'
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
    Object.defineProperty(this, 'uTime', {
      get: function () {
        return this.material.uniforms['uTime'].value;
      },
      set: function (v) {
        return this.material.uniforms['uTime'].value = v;
      }
    });
    Object.defineProperty(this, 'uAnimationPhase', {
      get: function () {
        return this.material.uniforms['uAnimationPhase'].value;
      },
      set: function (v) {
        return this.material.uniforms['uAnimationPhase'].value = v;
      }
    });
  }
}
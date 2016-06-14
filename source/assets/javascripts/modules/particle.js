import THREE from 'three';
import gsap from 'gsap';
import Bas from '../lib/bas.js';


// particle class
// https://github.com/zadvorsky/three.bas/blob/develop/examples/basic_transform/main.js
export default class Particle extends THREE.Mesh {
  constructor(prefabCount) {
    super(); // 子Classはsuper();する必要あり

    new Bas();

    this.prefabCount = prefabCount;

    this.prefabGeometry = new THREE.TetrahedronGeometry(1.0);
    this.geometry = new THREE.BAS.PrefabBufferGeometry(this.prefabGeometry, this.prefabCount);

    // temp stuff
    let i, j, offset;
    let prefabData = [];

    const aDelayDuration = this.geometry.createAttribute('aDelayDuration', 2);
    const duration = 1.0;
    const maxPrefabDelay = 0.5;
    this.totalDuration = duration + maxPrefabDelay;

    // give each prefab a random delay
    for(i = 0, offset = 0; i < prefabCount; i++){
      const delay = Math.random() * maxPrefabDelay;

      for(j = 0; j < this.prefabGeometry.vertices.length; j++){
        aDelayDuration.array[offset] = delay;
        aDelayDuration.array[offset + 1] = duration;

        offset += 2;
      }
    }

    const aStartPosition = this.geometry.createAttribute('aStartPosition', 3);
    const aEndPosition = this.geometry.createAttribute('aEndPosition', 3);
    // temp position
    const startPosition = new THREE.Vector3();
    const endPosition = new THREE.Vector3();
    const range = {
      x: window.innerWidth,
      y: window.innerHeight,
      z: 300
    };

    // calculate the stand and end positions for each prefab
    for(i = 0; i < this.prefabCount; i++){
      startPosition.x = THREE.Math.randFloatSpread(range.x);
      startPosition.y = THREE.Math.randFloatSpread(range.y);
      startPosition.z = THREE.Math.randFloatSpread(range.z);

      endPosition.x = THREE.Math.randFloatSpread(range.x);
      endPosition.y = THREE.Math.randFloatSpread(range.y);
      endPosition.z = THREE.Math.randFloatSpread(range.z);

      this.geometry.setPrefabData(aStartPosition, i, startPosition.toArray(prefabData));
      this.geometry.setPrefabData(aEndPosition, i, endPosition.toArray(prefabData));
    }

    const aAxisAngle = this.geometry.createAttribute('aAxisAngle', 4);
    const axis = new THREE.Vector3();
    let angle;

    for(i = 0, offset = 0; i < this.prefabCount; i++){
      // get a random axis
      axis.x = THREE.Math.randFloatSpread(2);
      axis.y = THREE.Math.randFloatSpread(2);
      axis.z = THREE.Math.randFloatSpread(2);
      // axis has to be normalized, or else things get weird
      axis.normalize();
      // the total angle of rotation around the axis
      angle = Math.PI * THREE.Math.randFloat(4.0, 8.0);

      // copy the data to the array
      axis.toArray(prefabData);
      prefabData[3] = angle;

      // same as the position data
      this.geometry.setPrefabData(aAxisAngle, i, prefabData);
    }

    // material
    this.material = new THREE.BAS.StandardAnimationMaterial({
      // material parameters go here
      shading: THREE.FlatShading,
      // uniform definitions
      uniforms: {
        // uTime is updated every frame, and is used to calculate the current animation state
        // this is the only value that changes, which is the reason we can animate so many objects at the same time
        uTime: {value: 0}
      },
      // THREE.BAS has a number of functions that can be reused. They can be injected here
      vertexFunctions: [
        // penner easing functions easeCubicInOut and easeQuadOut (see the easing example for all available functions)
        THREE.BAS.ShaderChunk['ease_cubic_in_out'],
        THREE.BAS.ShaderChunk['ease_quad_out'],
        // quatFromAxisAngle and rotateVector functions
        THREE.BAS.ShaderChunk['quaternion_rotation'],
        THREE.BAS.ShaderChunk['cubic_bezier']
      ],
      // parameters must be the same as the names of uniforms and attributes, defined above
      // as a convention, I prefix uniforms with 'u' and attributes with 'a' (and constants with 'c', varyings with 'v', and temps with 't')
      vertexParameters: [
        'uniform float uTime;',
        'attribute vec2 aDelayDuration;',
        'attribute vec3 aStartPosition;',
        'attribute vec3 aEndPosition;',
        'attribute vec4 aAxisAngle;'
      ],
      // this chunk is injected 1st thing in the vertex shader main() function
      // variables declared here are available in all subsequent chunks
      vertexInit: [
        // calculate a progress value between 0.0 and 1.0 based on the vertex delay and duration, and the uniform time
        'float tProgress = clamp(uTime - aDelayDuration.x, 0.0, aDelayDuration.y) / aDelayDuration.y;',
        // ease the progress using one of the available easing functions
        'tProgress = easeCubicInOut(tProgress);',
        // calculate a quaternion based on the vertex axis and the angle
        // the angle is multiplied by the progress to create the rotation animation
        'vec4 tQuat = quatFromAxisAngle(aAxisAngle.xyz, aAxisAngle.w * tProgress);'
      ],
      // this chunk is injected before all default normal calculations
      vertexNormal: [
        // 'objectNormal' is used throughout the three.js vertex shader
        // we rotate it to match the new orientation of the prefab
        // this isn't required when using flat shading
        //'objectNormal = rotateVector(tQuat, objectNormal);'
      ],
      // this chunk is injected before all default position calculations (including the model matrix multiplication)
      vertexPosition: [
        // calculate a scale based on tProgress
        // here an easing function is used with the (t, b, c, d) signature (see easing example)
        'float scl = easeQuadOut(tProgress, 0.5, 1.5, 1.0);',
        // 'transformed' is the vertex position modified throughout the THREE.js vertex shader
        // it contains the position of each vertex in model space
        // scaling it can be done by simple multiplication
        // 'transformed *= scl;',
        // rotate the vector by the quaternion calculated in vertexInit
        'transformed = rotateVector(tQuat, transformed);',
        // linearly interpolate between the start and end position based on tProgress
        // and add the value as a delta
        'transformed += mix(aStartPosition, aEndPosition, tProgress);',
        // 'transformed += cubicBezier(aStartPosition, aEndPosition, aStartPosition, aEndPosition, tProgress);'
      ]
    },
    // material uniform values go here
    {
      metalness: 0.0,
      roughness: 1.0
    });
    console.log(this.material);

    console.log(this);
    this.frustumCulled = false;

    this.defineProperty();
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
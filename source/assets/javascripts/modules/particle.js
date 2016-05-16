import THREE from 'three';
import gsap from 'gsap';
import OrbitControls from '../lib/OrbitControls.js';
import Bas from '../lib/bas.js';

export function particle() {
  new Bas();

  let renderer, scene, camera, controls;
  const width = 640;
  const height = 480;
  const minDuration = 0.8;
  const maxDuration = 1.2;
  const maxDelayX = 0.9;
  const maxDelayY = 0.125;
  const stretch = 0.11;
  const totalDuration = maxDuration + maxDelayX + maxDelayY + stretch;

  init();

  function init() {
    // console.log(THREE);
    // console.log(OrbitControls);
    // console.log(TweenMax);

    const container = document.body;
    const width = 640;
    const height = 480;

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 0, 3000);

    camera = new THREE.PerspectiveCamera(60, width/height, 1, 10000);
    camera.position.z = 420;

    controls = new OrbitControls(camera);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(0xFFFFFF, 1.0);

    const axis = new THREE.AxisHelper(200);
    axis.position.set(0, 0, 0);
    scene.add(axis);

    initSlide('out');

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

  function initSlide(animationPhase){
    const width = 200;
    const height = 200;

    const plane = new THREE.PlaneGeometry(width, height, 32, 32);
    THREE.BAS.Utils.separateFaces(plane);

    const geometry = new THREE.BAS.ModelBufferGeometry(plane);
    geometry.bufferUVs();
    console.log(geometry, geometry.faceCount);

    const aAnimation = geometry.createAttribute('aAnimation', 2);
    const aStartPosition = geometry.createAttribute('aStartPosition', 3);
    const aControl0 = geometry.createAttribute('aControl0', 3);
    const aControl1 = geometry.createAttribute('aControl1', 3);
    const aEndPosition = geometry.createAttribute('aEndPosition', 3);

    const startPosition = new THREE.Vector3();
    const control0 = new THREE.Vector3();
    const control1 = new THREE.Vector3();
    const endPosition = new THREE.Vector3();
    const tempPoint = new THREE.Vector3();

    var i, i2, i3, i4, v;

    function getControlPoint0(centroid) {
      var signY = Math.sign(centroid.y);

      tempPoint.x = THREE.Math.randFloat(0.1, 0.3) * 50;
      tempPoint.y = signY * THREE.Math.randFloat(0.1, 0.3) * 70;
      tempPoint.z = THREE.Math.randFloatSpread(20);

      return tempPoint;
    }
    function getControlPoint1(centroid) {
      var signY = Math.sign(centroid.y);

      tempPoint.x = THREE.Math.randFloat(0.3, 0.6) * 50;
      tempPoint.y = -signY * THREE.Math.randFloat(0.3, 0.6) * 70;
      tempPoint.z = THREE.Math.randFloatSpread(20);

      return tempPoint;
    }

    for (i = 0, i2 = 0, i3 = 0; i < 1; i++, i2 += 6, i3 += 9) {
      var face = plane.faces[i];
      var centroid = THREE.BAS.Utils.computeCentroid(plane, face);

      // animation
      var duration = THREE.Math.randFloat(minDuration, maxDuration);
      var delayX = THREE.Math.mapLinear(centroid.x, -width * 0.5, width * 0.5, 0.0, maxDelayX);
      var delayY;

      if (animationPhase === 'in') {
        delayY = THREE.Math.mapLinear(Math.abs(centroid.y), 0, height * 0.5, 0.0, maxDelayY)
      }
      else {
        delayY = THREE.Math.mapLinear(Math.abs(centroid.y), 0, height * 0.5, maxDelayY, 0.0)
      }

      for (v = 0; v < 6; v += 2) {
        aAnimation.array[i2 + v]     = delayX + delayY + (Math.random() * stretch * duration);
        aAnimation.array[i2 + v + 1] = duration;
      }

      // position
      endPosition.copy(centroid);
      startPosition.copy(centroid);

      if (animationPhase === 'in') {
        control0.copy(centroid).sub(getControlPoint0(centroid));
        control1.copy(centroid).sub(getControlPoint1(centroid));
      }
      else { // out
        control0.copy(centroid).add(getControlPoint0(centroid));
        control1.copy(centroid).add(getControlPoint1(centroid));
      }

      for (v = 0; v < 9; v += 3) {
        aStartPosition.array[i3 + v]     = startPosition.x;
        aStartPosition.array[i3 + v + 1] = startPosition.y;
        aStartPosition.array[i3 + v + 2] = startPosition.z;

        aControl0.array[i3 + v]     = control0.x;
        aControl0.array[i3 + v + 1] = control0.y;
        aControl0.array[i3 + v + 2] = control0.z;

        aControl1.array[i3 + v]     = control1.x;
        aControl1.array[i3 + v + 1] = control1.y;
        aControl1.array[i3 + v + 2] = control1.z;

        aEndPosition.array[i3 + v]     = endPosition.x;
        aEndPosition.array[i3 + v + 1] = endPosition.y;
        aEndPosition.array[i3 + v + 2] = endPosition.z;

        console.log(startPosition.x, startPosition.y);
        console.log(control0.x, control0.y);
        console.log(control1.x, control1.y);
        console.log(endPosition.x, endPosition.y);
      }
    }

    const material = new THREE.BAS.BasicAnimationMaterial({
      shading: THREE.FlatShading,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {type: 'f', value: 0}
      },
      shaderFunctions: [
        THREE.BAS.ShaderChunk['cubic_bezier'],
        //THREE.BAS.ShaderChunk[(animationPhase === 'in' ? 'ease_out_cubic' : 'ease_in_cubic')],
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
        //'float tProgress = tTime / tDuration;'
      ],
      shaderTransformPosition: [
        (animationPhase === 'in' ? 'transformed *= tProgress;' : 'transformed *= 1.0 - tProgress;'),
        'transformed += cubicBezier(aStartPosition, aControl0, aControl1, aEndPosition, tProgress);'
      ]
    }, {
      map: new THREE.Texture()
    });
    console.log(material);

    const slide = new THREE.Mesh(geometry, material);
    Object.defineProperty(slide, 'time', {
      get: function () {
        return this.material.uniforms['uTime'].value;
      },
      set: function (v) {
        this.material.uniforms['uTime'].value = v;
      }
    });
    const imageLoader = new THREE.ImageLoader();
    setImage(imageLoader.load('./assets/images/sample.jpg'));
    scene.add(slide);

    const timeline = new TimelineMax({repeat:-1, repeatDelay:1.0, yoyo: true});
    // timeline.add(TweenMax.fromTo(slide, 3.0, {time:0.0}, {time:totalDuration, ease:Power0.easeInOut}));

    function setImage(img) {
      material.uniforms.map.value.image = img;
      material.uniforms.map.value.needsUpdate = true;
    }
  }
}
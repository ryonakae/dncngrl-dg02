import THREE from 'three';
import TWEEN from 'tween.js';

export function particle() {
  console.log(THREE);
  console.log(TWEEN);

  let renderer, scene, camera;
  const width = 640;
  const height = 480;

  let imgArray = [];
  let randomArray = [];

  let pGeometry, pMaterial, pointCloud;
  let pTween = [];
  let pTweenBack = [];

  let particleFlg = false;
  let randomFlg = false;

  init();

  // init
  function init(){
    const container = document.body;

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 0, 3000);

    camera = new THREE.PerspectiveCamera(60, width/height, 1, 10000);
    camera.position.z = 500;

    createParticle();

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(0xFFFFFF, 1.0);

    container.appendChild(renderer.domElement);

    animate();
  }

  // animate
  function animate(){
    render();
    // TWEEN.update();
    requestAnimationFrame(animate);
  }

  // render
  function render(){
    if(particleFlg) pGeometry.verticesNeedUpdate = true;
    renderer.render(scene, camera);
  }

  // createParticle
  function createParticle(){
    const img = new Image();

    img.onload = () => {
      console.log('image loaded');

      // canvas
      const imgCanvas = document.createElement('canvas');
      imgCanvas.width = img.width;
      imgCanvas.height = img.height;

      const context = imgCanvas.getContext('2d');
      context.drawImage(img, 0, 0);

      const imageW = imgCanvas.width;
      const imageH = imgCanvas.height;

      // data
      const pixels = context.getImageData(0, 0, imageW, imageH).data;
      let index = 0;
      let i = 0;

      // geometry
      pGeometry = new THREE.Geometry();

      // material
      pMaterial = new THREE.PointsMaterial({
        size: 2,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0.7,
        vertexColors: THREE.VertexColors
      });

      for(let x = 0; x < imageW; x++){
        for(let y = 0; y < imageH; y++){
          const r = pixels[index];
          const g = pixels[index+1];
          const b = pixels[index+2];
          const a = pixels[index+3];

          const randomVertex = new THREE.Vector3(Math.random() * 6000 - 3000, Math.random() * 6000 - 3000, Math.random() * 6000 - 3000);
          imgArray[i] = {
            vertex: new THREE.Vector3((x-imageW/2), -(y-imageH/2), 0)
          };
          randomArray[i] = {
            vertex: randomVertex.clone()
          };
          pGeometry.vertices.push(randomVertex.clone());
          // pGeometry.vertices.push(imgArray[i].vertex);
          pGeometry.colors.push(new THREE.Color("rgb("+r+","+g+","+b+")"));
          i++;

          index = (x*4) + y*(4*imageW);
        }
      }

      // pointCloud
      pointCloud = new THREE.Points( pGeometry, pMaterial );
      scene.add(pointCloud);

      // animate
      // for(let i = 0; i < imgArray.length; i++){
      //   pTween[i] = new TWEEN.Tween(pGeometry.vertices[i])
      //     .to({ x: imgArray[i].vertex.x, y: imgArray[i].vertex.y, z: imgArray[i].vertex.z }, 4000)
      //     .easing(TWEEN.Easing.Quartic.InOut)
      //     .start();
      //
      //   pTweenBack[i] = new TWEEN.Tween(pGeometry.vertices[i])
      //     .delay(1000)
      //     .to({ x: randomArray[i].vertex.x, y: randomArray[i].vertex.y, z: randomArray[i].vertex.z }, 4000)
      //     .easing(TWEEN.Easing.Quartic.InOut);
      //
      //   pTween[i].chain(pTweenBack[i]);
      //   pTweenBack[i].chain(pTween[i]);
      // }

      particleFlg = true;
    }

    img.src = 'assets/images/sample.jpg'; // htmlからの相対パス
  }
}
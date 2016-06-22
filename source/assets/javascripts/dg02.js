'use strict';

window.jQuery = window.$ = require('jquery');
import THREE from 'three';
import gsap from 'gsap';

import Canvas from './modules/Canvas';
import Eyecatch from './modules/Eyecatch';
import Particle from './modules/Particle';


(() => {
  $(() => {
    init();
  });

  const init = () => {
    console.log('init');


    // eyecatch
    const bgTop = document.getElementById('bgTop');
    const canvasTop = new Canvas(bgTop, 5.0);
    canvasTop.init();

    const eyecatch = new Eyecatch(78, 110, 78*1.5, 110*1.5);
    eyecatch.setImage(new THREE.ImageLoader().load('./assets/images/sample04.jpg'));
    eyecatch.position.y = 3;
    canvasTop.scene.add(eyecatch);

    eyecatch.parallax(document.body, -0.13, -0.15, 0.0002);

    // eyecatch in/out
    let isEyecatchStarted = false;
    bgTop.addEventListener('click', ()=>{
      if(isEyecatchStarted == false){
        eyecatch.in(6.0, ()=>{
          console.log('eyecatch in');
          isEyecatchStarted = true;
        });
      }
      else if(isEyecatchStarted == true){
        eyecatch.out(5.0, ()=>{
          console.log('eyecatch out');
          isEyecatchStarted = false;
        });
      }
    }, false);


    // introduction particle
    const bgIntro = document.getElementById('bgIntroduction');
    const canvasIntro = new Canvas(bgIntro, 25.0);
    canvasIntro.init();

    const particle = new Particle(100000);
    canvasIntro.scene.add(particle.particleSystem);

    // particle in/out
    let isParticleStarted = false;
    bgIntro.addEventListener('click', ()=>{
      if(isParticleStarted == false){
        particle.fadeIn(2.0, ()=>{
          console.log('fadeIn');
          isParticleStarted = true;
        });
      }
      else if(isParticleStarted == true){
        particle.fadeOut(2.0, ()=>{
          console.log('fadeOut');
          isParticleStarted = false;
        });
      }
    }, false);


    // gallery
    // const bgGallery = document.getElementById('bg_gallery');
    // const canvasGallery = new Canvas(bgGallery, 5.0);
    // canvasGallery.init();
    //
    // const slide1 = new Slide(78, 110, 78*1.5, 110*1.5, 'out');
    // slide1.setImage(new THREE.ImageLoader().load('./assets/images/sample04.jpg'));
    // canvasGallery.scene.add(slide1);
  };
})();
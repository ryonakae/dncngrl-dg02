'use strict';

window.jQuery = window.$ = require('jquery');
import THREE from 'three';
import gsap from 'gsap';

import Canvas from './modules/Canvas';
import Eyecatch from './modules/Eyecatch';
import Particle from './modules/Particle';
import Carousel from './modules/Carousel';


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
    const bgGallery = document.getElementById('bgGallery');
    const canvasGallery = new Canvas(bgGallery, 7.0);
    canvasGallery.init();

    const carousel = new Carousel(100, 67, 100*1.5, 67*1.5);
    carousel.addSlide(canvasGallery.scene, './assets/images/sample01.jpg');
    carousel.addSlide(canvasGallery.scene, './assets/images/sample02.jpg');
    carousel.addSlide(canvasGallery.scene, './assets/images/sample03.jpg');

    carousel.slides[0].init('out');

    let slideCount = 1;
    // let slideCount = 3;
    bgGallery.addEventListener('click', ()=>{
      // carousel.slides[0].slideOut(5.0, ()=>{
      //   console.log('slide out');
      // });
      // carousel.slides[1].slideIn(5.0, ()=>{
      //   console.log('slide in');
      // });

      carousel.slideNext(slideCount, 10.0, ()=>{
        slideCount++;
      });

      // carousel.slideNext(slideCount, 5.0, ()=>{
      //   slideCount--;
      // });
    }, false);
  };
})();
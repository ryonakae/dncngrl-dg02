'use strict';

window.jQuery = window.$ = require('jquery');
import THREE from 'three';
import gsap from 'gsap';

import Canvas from './modules/Canvas';
import Eyecatch from './modules/Eyecatch';
import Particle from './modules/Particle';
import Carousel from './modules/Carousel';

import UaManager from './modules/UaManager';
const uaManager = new UaManager();


(() => {
  $(() => {
    init();
  });

  const init = () => {
    console.log('init');

    // uamanager
    uaManager.init();

    // eyecatch
    const bgTop = document.getElementById('bgTop');
    const canvasTop = new Canvas(bgTop, 5.0);
    let eyecatch;

    // introduction particle
    const bgIntro = document.getElementById('bgIntroduction');
    const canvasIntro = new Canvas(bgIntro, 2.0);
    let particle;

    // gallery
    const bgGallery = document.getElementById('bgGallery');
    const canvasGallery = new Canvas(bgGallery, 7.0);




    // section transition function
    // 0:top, 1:intro, 2:gallery, 3:credit
    let currentNum = -1;

    function topIn(){
      canvasTop.init();

      eyecatch = new Eyecatch(78, 110, 78*1.5, 110*1.5);
      eyecatch.setImage(new THREE.ImageLoader().load('./assets/images/sample04.jpg'));
      eyecatch.position.y = 3;
      canvasTop.scene.add(eyecatch);

      eyecatch.parallax(document.body, -0.13, -0.15, 0.0002);

      $('.bg_item-top').addClass('is-show');
      eyecatch.in(5.0, ()=>{
        $('.viewArea_section-top').addClass('is-show');
        console.log('eyecatch in');
      });
    }

    function topOut(){
      eyecatch.out(5.0, ()=>{
        $('.bg_item-top').removeClass('is-show');
        $('.viewArea_section-top').removeClass('is-show');
        canvasTop.destroy();
        console.log('eyecatch out');
      });
    }

    function introIn(){
      canvasIntro.init();

      particle = new Particle(1000, canvasIntro.renderer);
      canvasIntro.scene.add(particle);

      $('.bg_item-intro').addClass('is-show');
      particle.fadeIn(1, 5.0, ()=>{
        $('.viewArea_section-intro').addClass('is-show');
        console.log('intro in');
      });
    }

    function introOut(){
      particle.fadeOut(5.0, ()=>{
        $('.bg_item-intro').removeClass('is-show');
        $('.viewArea_section-intro').removeClass('is-show');
        canvasIntro.destroy();
        console.log('intro out');
      });
    }

    // topIn();
    // $(window).on('click', ()=>{
    //   topOut();
    //   setTimeout(introIn, 5000);
    // });
    introIn();



    // // eyecatch in/out
    // let isEyecatchStarted = false;
    // bgTop.addEventListener('click', ()=>{
    //   if(isEyecatchStarted == false){
    //     eyecatch.in(5.0, ()=>{
    //       console.log('eyecatch in');
    //       isEyecatchStarted = true;
    //     });
    //   }
    //   else if(isEyecatchStarted == true){
    //     eyecatch.out(5.0, ()=>{
    //       console.log('eyecatch out');
    //       isEyecatchStarted = false;
    //     });
    //   }
    // }, false);
    //
    //
    // // introduction particle
    // canvasIntro.init();
    //
    // const particle = new Particle(100000);
    // canvasIntro.scene.add(particle.particleSystem);
    //
    // // particle in/out
    // let isParticleStarted = false;
    // bgIntro.addEventListener('click', ()=>{
    //   if(isParticleStarted == false){
    //     particle.fadeIn(2.0, ()=>{
    //       console.log('fadeIn');
    //       isParticleStarted = true;
    //     });
    //   }
    //   else if(isParticleStarted == true){
    //     particle.fadeOut(2.0, ()=>{
    //       console.log('fadeOut');
    //       isParticleStarted = false;
    //     });
    //   }
    // }, false);


    // // gallery
    // canvasGallery.init();
    //
    // const carousel = new Carousel({
    //   itemWidth: 100,
    //   itemHeight: 67,
    //   itemDivisionX: 100*1.5,
    //   itemDivisionY: 67*1.5,
    //   duration: 3.5,
    //   nav: document.getElementById('galleryNav'),
    //   navNext: document.getElementById('galleryNavNext'),
    //   navPrev: document.getElementById('galleryNavPrev'),
    //   indicatorCurrent: document.getElementById('galleryIndicatorCurrent'),
    //   indicatorAll: document.getElementById('galleryIndicatorAll'),
    //   scene: canvasGallery.scene,
    //   images: [
    //     './assets/images/sample00.jpg',
    //     './assets/images/sample01.jpg',
    //     './assets/images/sample02.jpg',
    //     './assets/images/sample03.jpg'
    //   ]
    // });
    //
    // carousel.initParallax(document.body, 0, 0, 0.00006);
    //
    // window.addEventListener('dblclick', ()=>{
    //   canvasGallery.destroy();
    //   console.log(canvasGallery);
    //   canvasGallery = null;
    //   console.log(canvasGallery);
    //
    //   carousel.destroyParallax();
    // }, false);
  };
})();
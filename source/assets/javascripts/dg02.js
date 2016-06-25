'use strict';

window.jQuery = window.$ = require('jquery');
import THREE from 'three';
import gsap from 'gsap';

import Canvas from './modules/Canvas';
import Eyecatch from './modules/Eyecatch';
import Particle from './modules/Particle';
import Carousel from './modules/Carousel';
import Section from './modules/Section';

import UaManager from './modules/UaManager';
export const uaManager = new UaManager();


(() => {
  $(() => {
    init();
  });

  const init = () => {
    console.log('init');


    // uamanager
    uaManager.init();


    // section initialize
    const sectionTop = new Section({
      bg: document.getElementById('bgTop'),
      magnification: 5.0
    });
    sectionTop.init();
    console.log(sectionTop.canvas);
    let eyecatch;

    const sectionIntro = new Section({
      bg: document.getElementById('bgIntroduction'),
      magnification: 1.0
    });
    sectionIntro.init();
    let particle;

    const sectionGallery = new Section({
      bg: document.getElementById('bgGallery'),
      magnification: 7.0
    });
    sectionGallery.init();
    let carousel;


    // show eyecatch
    moveSection(null, 'top');


    // move section when scroll
    let nowMoving = false;
    let moveAmount;
    let scrollPositionTop;
    let scrollPositionBottom;

    if(uaManager.device() === 'pc'){
      $(window).on('wheel.onScroll', (e)=>{
        moveAmount = e.originalEvent.deltaY;
      });
    }
    else if(uaManager.device() === 'mobile'){
      let touchStartY;
      let touchMoveY;

      $(window).on('touchstart.onScroll', (e) => {
        touchStartY = e.originalEvent.changedTouches[0].pageY;
      });
      $(window).on('touchmove.onScroll', (e) => {
        touchMoveY = e.originalEvent.changedTouches[0].pageY;
        moveAmount = touchStartY - touchMoveY;
      });
    }

    $(window).on('wheel.onScroll touchmove.onScroll', ()=>{
      // nowMovingがtrueなら以下スキップ
      if(nowMoving) return;

      nowMoving = true;

      scrollPositionTop = window.pageYOffset;
      scrollPositionBottom = scrollPositionTop + window.innerHeight;
      console.log(moveAmount);

      if(moveAmount > 0){
        console.log('next');
        moveSection('top', 'intro');
      }
      else if(moveAmount < 0){
        console.log('back');
      }
    });


    // セクション移動関数
    function moveSection(currentSection, nextSection){
      // in: 次のセクションの処理
      function sectionIn(){
        // top
        if(nextSection == 'top'){
          return new Promise((resolve, reject)=>{
            sectionTop.canvas.init();

            eyecatch = new Eyecatch(78, 110, 78*1.5, 110*1.5);
            eyecatch.setImage(new THREE.ImageLoader().load('./assets/images/sample04.jpg'));
            eyecatch.position.y = 3;
            sectionTop.canvas.scene.add(eyecatch);

            eyecatch.parallax(document.body, -0.13, -0.15, 0.0002);

            $('.bg_item-top').addClass('is-show');
            eyecatch.in(5.0, ()=>{
              $('.viewArea_section-top').addClass('is-show');
              console.log('eyecatch in');
              resolve();
            });
          });
        }

        // intro
        else if(nextSection == 'intro'){
          return new Promise((resolve, reject)=>{
            sectionIntro.canvas.init();

            if(uaManager.device() === 'pc'){
              particle = new Particle(40000, sectionIntro.canvas.renderer);
            } else {
              particle = new Particle(10000, sectionIntro.canvas.renderer);
            }
            sectionIntro.canvas.scene.add(particle);

            $('.bg_item-intro').addClass('is-show');
            particle.in(3.0, ()=>{
              $('.viewArea_section-intro').addClass('is-show');
              console.log('intro in');
              resolve();
            });
          });
        }

        // どれでもない時
        // 最初のページ表示時とか
        else {
          return new Promise((resolve, reject)=>{
            resolve();
          });
        }
      }

      // out: 今のセクションの処理
      function sectionOut(){
        // top
        if(currentSection == 'top'){
          return new Promise((resolve, reject)=>{
            $('.viewArea_section-top').removeClass('is-show');

            setTimeout(()=>{
              eyecatch.out(5.0, ()=>{
                $('.bg_item-top').removeClass('is-show');
                sectionTop.canvas.destroy();
                console.log('eyecatch out');
                resolve();
              });
            }, 1000);
          });
        }

        // intro
        else if(currentSection == 'intro'){
          return new Promise((resolve, reject)=>{
            $('.viewArea_section-intro').removeClass('is-show');

            setTimeout(()=>{
              particle.out(3.0, ()=>{
                $('.bg_item-intro').removeClass('is-show');
                sectionIntro.canvas.destroy();
                console.log('intro out');
                resolve();
              });
            }, 1000);
          });
        }

        // どれでもない時
        // 最初のページ表示時とか
        else {
          return new Promise((resolve, reject)=>{
            resolve();
          });
        }
      }

      // 関数実行
      // 今と次のセクションが同じだったら何もしない
      if(currentSection == nextSection) return;

      sectionOut()
        .then(sectionIn)
        .then(()=>{
          nowMoving = false; //ロック解除
          console.log('section moved');
        })
    }



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
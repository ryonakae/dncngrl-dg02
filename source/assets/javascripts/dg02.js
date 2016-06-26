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


    // uamanager initialize
    uaManager.init();


    // 画像をロード
    // 使う画像全部入れとく
    const loadingManager = new THREE.LoadingManager();
    const eyecatchImage = new THREE.ImageLoader(loadingManager).load('./assets/images/sample04.jpg');
    const carouselImage00 = new THREE.ImageLoader(loadingManager).load('./assets/images/sample00.jpg');
    const carouselImage01 = new THREE.ImageLoader(loadingManager).load('./assets/images/sample01.jpg');
    const carouselImage02 = new THREE.ImageLoader(loadingManager).load('./assets/images/sample02.jpg');
    const carouselImage03 = new THREE.ImageLoader(loadingManager).load('./assets/images/sample03.jpg');


    // section initialize
    const sectionTop = new Section({
      bg: document.getElementById('bgTop'),
      magnification: 7.0
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
      magnification: 8.0
    });
    sectionGallery.init();
    let carousel;


    // show eyecatch at first
    // top表示前はnowMovingをtrue
    // topの表示が終わったらnowMovingがfalseになる
    let _currentSection = 'top';
    let _nowMoving = true;
    $('body').addClass('is-nowLoading');

    loadingManager.onLoad = (item, loaded, total)=>{
      setTimeout(()=>{
        console.log('all images are loaded');
        $('body').removeClass('is-nowLoading');
        $('body').addClass('is-loaded');

        setTimeout(()=>{
          moveSection(null, 'top', ()=>{
            $('body').addClass('is-ready');
          });
        }, 1200);
      }, 1500);
    };

    // debug
    // let _currentSection = 'gallery';
    // let _nowMoving = true;
    // moveSection(null, 'gallery', ()=>{
    //   $('body').addClass('is-ready');
    // });


    // move section when scroll
    let moveAmount;

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
      console.log('moveAmount:', moveAmount);
      console.log('nowMoving:', _nowMoving);

      // nowMovingがtrueなら以下スキップ
      if(_nowMoving) return;

      if(moveAmount > 30){
        _nowMoving = true;
        moveNext();
      }
      else if(moveAmount < -30){
        _nowMoving = true;
        movePrev();
      }
    });


    // move section when click scroll
    $('#scroll').on('click', ()=>{
      // nowMovingがtrueなら以下スキップ
      if(_nowMoving) return;
      _nowMoving = true;

      moveNext();
    });


    // move section whien click sectionNavi
    $('.sectionNav_item').each((id, value)=>{
      $(value).on('click', ()=>{
        console.log(id, value.dataset.section);
        moveSection(_currentSection, value.dataset.section);
      });
    });


    // 次のセクションに行くぞい
    function moveNext(){
      console.log('move next');
      console.log('nowMoving:', _nowMoving);

      if(_currentSection == 'top') {
        moveSection('top', 'intro');
      }
      else if(_currentSection == 'intro'){
        moveSection('intro', 'gallery');
      }
      // else if(_currentSection == 'gallery'){
      //   moveSection('gallery', 'credit');
      // }
      else {
        _nowMoving = false;
        console.log('nowMoving', _nowMoving);
      }
    }


    // 前のセクションに行くぞい
    function movePrev(){
      console.log('move prev');
      console.log('nowMoving:', _nowMoving);

      if(_currentSection == 'intro'){
        moveSection('intro', 'top');
      }
      else if(_currentSection == 'gallery'){
        moveSection('gallery', 'intro');
      }
      // else if (_currentSection == 'credit') {
      //   moveSection('credit', 'gallery');
      // }
      else {
        _nowMoving = false;
        console.log('nowMoving', _nowMoving);
      }
    }


    // セクション移動関数
    function moveSection(currentSection, nextSection, callback){
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

            // // parallax only pc
            // if(uaManager.device() === 'pc') {
            //   eyecatch.parallax(document.body, -0.06, -0.11, 0.0001);
            // }
            eyecatch.rotation.x = -0.06;
            eyecatch.rotation.y = -0.11;

            $('.bg_item-top').addClass('is-show');
            eyecatch.in(6.0, ()=>{
              $('.viewArea_section-top').addClass('is-show');
              $('.footer_scroll').addClass('is-show');
              $('#sectionNav').addClass('is-show');
              $('#sectionNavTop').addClass('is-show');

              _currentSection = 'top';
              resolve();

              console.log('eyecatch in');
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
              $('.footer_scroll').addClass('is-show');
              $('#sectionNav').addClass('is-show');
              $('#sectionNavIntro').addClass('is-show');

              _currentSection = 'intro';
              resolve();

              console.log('intro in');
            });
          });
        }

        // gallery
        else if(nextSection == 'gallery'){
          return new Promise((resolve, reject)=>{
            sectionGallery.canvas.init();

            let divisionX, divisionY;
            if(uaManager.device() === 'pc'){
              divisionX = 100*1.5;
              divisionY = 67*1.5;
            } else {
              divisionX = 100*1.0;
              divisionY = 67*1.0;
            }

            carousel = new Carousel({
              itemWidth: 100,
              itemHeight: 67,
              itemDivisionX: divisionX,
              itemDivisionY: divisionY,
              duration: 4.0,
              nav: document.getElementById('galleryNav'),
              navNext: document.getElementById('galleryNavNext'),
              navPrev: document.getElementById('galleryNavPrev'),
              indicatorCurrent: document.getElementById('galleryIndicatorCurrent'),
              indicatorAll: document.getElementById('galleryIndicatorAll'),
              scene: sectionGallery.canvas.scene,
              images: [
                './assets/images/sample00.jpg',
                './assets/images/sample01.jpg',
                './assets/images/sample02.jpg',
                './assets/images/sample03.jpg'
              ]
            });

            // carousel.parallax(document.body, 0, 0, 0.00005);

            $('.bg_item-gallery').addClass('is-show');
            carousel.in(4.0, ()=>{
              $('.viewArea_section-gallery').addClass('is-show');
              $('.footer_scroll').addClass('is-show');
              $('#sectionNav').addClass('is-show');
              $('#sectionNavGallery').addClass('is-show');

              _currentSection = 'gallery';
              resolve();

              console.log('gallery in');
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
            $('.footer_scroll').removeClass('is-show');
            $('#sectionNav').removeClass('is-show');
            $('#sectionNavTop').removeClass('is-show');

            setTimeout(()=>{
              eyecatch.out(4.5, ()=>{
                $('.bg_item-top').removeClass('is-show');
                // eyecatch.disableParallax(document.body);
                sectionTop.canvas.destroy();
                console.log('eyecatch out');
                resolve();
              });
            }, 900);
          });
        }

        // intro
        else if(currentSection == 'intro'){
          return new Promise((resolve, reject)=>{
            $('.viewArea_section-intro').removeClass('is-show');
            $('.footer_scroll').removeClass('is-show');
            $('#sectionNav').removeClass('is-show');
            $('#sectionNavIntro').removeClass('is-show');

            setTimeout(()=>{
              particle.out(3.0, ()=>{
                $('.bg_item-intro').removeClass('is-show');
                sectionIntro.canvas.destroy();
                console.log('intro out');
                resolve();
              });
            }, 900);
          });
        }

        // gallery
        else if(currentSection == 'gallery'){
          return new Promise((resolve, reject)=>{
            $('.viewArea_section-gallery').removeClass('is-show');
            $('.footer_scroll').removeClass('is-show');
            $('#sectionNav').removeClass('is-show');
            $('#sectionNavGallery').removeClass('is-show');

            setTimeout(()=>{
              carousel.out(4.0, ()=>{
                $('.bg_item-gallery').removeClass('is-show');
                // carousel.disableParallax(document.body);
                sectionGallery.canvas.destroy();
                console.log('gallery out');
                resolve();
              });
            }, 900);
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
      console.log('nowMoving:', _nowMoving);
      // 今と次のセクションが同じだったら何もしない
      if(currentSection == nextSection) {
        _nowMoving = false; //ロック解除
        console.log('nowMoving:', _nowMoving);
        return;
      };

      sectionOut()
        .then(sectionIn)
        .then(()=>{
          console.log('section moved');
          console.log('currentSection:', _currentSection);
          _nowMoving = false; //ロック解除
          console.log('nowMoving:', _nowMoving);
          if(callback) callback();
        })
    }
  };
})();
'use strict';

window.jQuery = window.$ = require('jquery');
import THREE from 'three';
import gsap from 'gsap';

import Canvas from './modules/Canvas';
import Eyecatch from './modules/Eyecatch';
import Particle from './modules/Particle';
import Carousel from './modules/Carousel';
import Wave from './modules/Wave';
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
    const eyecatchImage = new THREE.ImageLoader(loadingManager).load('./assets/images/eyecatch.jpg');
    const carouselImage01 = new THREE.ImageLoader(loadingManager).load('./assets/images/gallery_01.jpg');
    const carouselImage02 = new THREE.ImageLoader(loadingManager).load('./assets/images/gallery_02.jpg');
    const carouselImage03 = new THREE.ImageLoader(loadingManager).load('./assets/images/gallery_03.jpg');
    const particleImage = new THREE.TextureLoader(loadingManager).load('./assets/images/textures/particle2.png');


    // リサイズ用変数
    let _topMagnification;
    let _galleryMagnification;


    // section initialize
    const sectionTop = new Section({
      bg: document.getElementById('bgTop'),
      magnification: _topMagnification
    });
    sectionTop.init();
    let eyecatch;

    const sectionIntro = new Section({
      bg: document.getElementById('bgIntroduction'),
      magnification: 1.0
    });
    sectionIntro.init();
    let particle;

    const sectionGallery = new Section({
      bg: document.getElementById('bgGallery'),
      magnification: _galleryMagnification
    });
    sectionGallery.init();
    let carousel;

    const sectionInfo = new Section({
      bg: document.getElementById('bgInfo'),
      magnification: 1.0
    });
    sectionInfo.init();
    let wave;


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
      if($('body').hasClass('is-transition')) return;

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
      if($('body').hasClass('is-transition')) return;

      // nowMovingがtrueなら以下スキップ
      if(_nowMoving) return;
      _nowMoving = true;

      moveNext();
    });


    // move section whien click sectionNavi
    $('.sectionNav_item').each((id, value)=>{
      $(value).on('click', ()=>{
        if($('body').hasClass('is-transition')) return;

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
      else if(_currentSection == 'gallery'){
        moveSection('gallery', 'info');
      }
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
      else if (_currentSection == 'info') {
        moveSection('info', 'gallery');
      }
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

            if(uaManager.device() === 'pc'){
              eyecatch = new Eyecatch(78, 110, 78*1.5, 110*1.5);
            } else {
              eyecatch = new Eyecatch(78, 110, 78*0.7, 110*0.7);
            }
            eyecatch.setImage(new THREE.ImageLoader().load('./assets/images/eyecatch.jpg'));
            eyecatch.position.x = -1;
            eyecatch.position.y = 1;
            sectionTop.canvas.scene.add(eyecatch);

            // // parallax only pc
            // if(uaManager.device() === 'pc') {
            //   eyecatch.parallax(document.body, -0.06, -0.11, 0.0001);
            // }
            eyecatch.rotation.x = -0.06;
            eyecatch.rotation.y = -0.11;

            $('.bg_item-top').addClass('is-show');
            $('body').removeClass('is-transitionOut');
            $('body').addClass('is-transitionIn');

            eyecatch.in(6.0, ()=>{
              $('.viewArea_section-top').addClass('is-show');
              $('.body').removeClass('is-transitionIn');

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
            $('body').removeClass('is-transitionOut');
            $('body').addClass('is-transitionIn');

            particle.in(3.0, ()=>{
              $('.viewArea_section-intro').addClass('is-show');
              $('.body').removeClass('is-transitionIn');

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
              divisionX = 100*0.8;
              divisionY = 67*0.8;
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
                './assets/images/gallery_01.jpg',
                './assets/images/gallery_02.jpg',
                './assets/images/gallery_03.jpg'
              ]
            });

            // carousel.parallax(document.body, 0, 0, 0.00005);

            $('.bg_item-gallery').addClass('is-show');
            $('body').removeClass('is-transitionOut');
            $('body').addClass('is-transitionIn');

            carousel.in(4.0, ()=>{
              $('.viewArea_section-gallery').addClass('is-show');
              $('.body').removeClass('is-transitionIn');

              $('.footer_scroll').addClass('is-show');
              $('#sectionNav').addClass('is-show');
              $('#sectionNavGallery').addClass('is-show');

              _currentSection = 'gallery';
              resolve();

              console.log('gallery in');
            });
          });
        }

        // info
        else if(nextSection == 'info'){
          return new Promise((resolve, reject)=>{
            sectionInfo.canvas.init();
            // sectionInfo.canvas.scene.fog = new THREE.FogExp2(0x989EA5, 0.001);

            wave = new Wave();
            wave.position.y = -200;
            sectionInfo.canvas.scene.add(wave);

            $('.bg_item-info').addClass('is-show');
            $('body').removeClass('is-transitionOut');
            $('body').addClass('is-transitionIn');

            wave.in(3.0, ()=>{
              $('.viewArea_section-info').addClass('is-show');
              $('.body').removeClass('is-transitionIn');

              $('.footer_scroll').addClass('is-show');
              $('#sectionNav').addClass('is-show');
              $('#sectionNavInfo').addClass('is-show');

              _currentSection = 'info';
              resolve();

              console.log('info in');
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
            $('body').removeClass('is-transitionIn');
            $('body').addClass('is-transitionOut');

            $('.footer_scroll').removeClass('is-show');
            $('#sectionNav').removeClass('is-show');
            $('#sectionNavTop').removeClass('is-show');

            setTimeout(()=>{
              eyecatch.out(4.5, ()=>{
                $('.bg_item-top').removeClass('is-show');
                $('.body').removeClass('is-transitionOut');

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
            $('body').removeClass('is-transitionIn');
            $('body').addClass('is-transitionOut');

            $('.footer_scroll').removeClass('is-show');
            $('#sectionNav').removeClass('is-show');
            $('#sectionNavIntro').removeClass('is-show');

            setTimeout(()=>{
              particle.out(3.0, ()=>{
                $('.bg_item-intro').removeClass('is-show');
                $('.body').removeClass('is-transitionOut');

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
            $('body').removeClass('is-transitionIn');
            $('body').addClass('is-transitionOut');

            $('.footer_scroll').removeClass('is-show');
            $('#sectionNav').removeClass('is-show');
            $('#sectionNavGallery').removeClass('is-show');

            setTimeout(()=>{
              carousel.out(4.0, ()=>{
                $('.bg_item-gallery').removeClass('is-show');
                $('.body').removeClass('is-transitionOut');

                // carousel.disableParallax(document.body);
                sectionGallery.canvas.destroy();
                console.log('gallery out');
                resolve();
              });
            }, 900);
          });
        }

        // info
        else if(currentSection == 'info'){
          return new Promise((resolve, reject)=>{
            $('.viewArea_section-info').removeClass('is-show');
            $('body').removeClass('is-transitionIn');
            $('body').addClass('is-transitionOut');

            $('.footer_scroll').removeClass('is-show');
            $('#sectionNav').removeClass('is-show');
            $('#sectionNavInfo').removeClass('is-show');

            setTimeout(()=>{
              wave.out(3.0, ()=>{
                $('.bg_item-info').removeClass('is-show');
                $('.body').removeClass('is-transitionOut');

                sectionInfo.canvas.destroy();
                console.log('info out');
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


    // windowの幅によって倍率変える
    $(window).on('load resize', ()=>{
      // width
      if(window.innerWidth > 768) {
        _topMagnification = 7.0;
        _galleryMagnification = 9.0;
      }
      else if(window.innerWidth <= 768 && window.innerWidth >= 720){
        _topMagnification = 6.5;
        _galleryMagnification = 7.0;
      }
      else if(window.innerWidth < 720 && window.innerWidth >= 640){
        _topMagnification = 6.0;
        _galleryMagnification = 6.0;
      }
      else if(window.innerWidth < 640 && window.innerWidth >= 500){
        _topMagnification = 5.5;
        _galleryMagnification = 4.5;
      }
      else if(window.innerWidth < 500 && window.innerWidth >= 400){
        _topMagnification = 4.5;
        _galleryMagnification = 3.8;
      }
      else if(window.innerWidth < 400 && window.innerWidth >= 350){
        _topMagnification = 4.0;
        _galleryMagnification = 3.3;
      }
      else {
        _topMagnification = 3.2;
        _galleryMagnification = 2.9;
      }

      sectionTop.canvas.magnification = _topMagnification;
      sectionGallery.canvas.magnification = _galleryMagnification;
    });
  };
})();
'use strict';

window.jQuery = window.$ = require('jquery');
import THREE from 'three';
import gsap from 'gsap';

import Canvas from './modules/canvas';
import Slide from './modules/slide';
import Particle from './modules/particle';
// import Particles from './lib/particles'

(() => {
  $(() => {
    init();
  });

  const init = () => {
    console.log('init');


    // eyecatch
    const bgTop = document.getElementById('bg_top');
    const canvasTop = new Canvas(bgTop, 5.0);
    canvasTop.init();

    const eyecatch = new Slide(78, 110, 78*1.5, 110*1.5, 'in');
    eyecatch.setImage(new THREE.ImageLoader().load('./assets/images/sample04.jpg'));
    eyecatch.position.y = 10;
    canvasTop.scene.add(eyecatch);

    // eyecatch parallax
    let mouseX;
    let mouseY;
    const defaultRotateX = -0.13;
    const defaultRotateY = -0.15;

    eyecatch.rotation.x = defaultRotateX;
    eyecatch.rotation.y = defaultRotateY;

    document.body.addEventListener('mousemove', (e) => {
      mouseX = e.pageX - window.innerWidth/2;
      mouseY = e.pageY - window.innerHeight/2;

      eyecatch.rotation.x = defaultRotateX + mouseY * 0.0002;
      eyecatch.rotation.y = defaultRotateY + mouseX * 0.0002;
    }, false);

    TweenMax.fromTo(eyecatch, 6.0, {time:0.0}, {time:eyecatch.totalDuration, ease:Power0.easeInOut});
    setTimeout(() => {
      TweenMax.fromTo(eyecatch, 4.0, {time:eyecatch.totalDuration, ease:Power0.easeInOut}, {time:0.0});
    }, 8000);


    // introduction particle
    const bgIntro = document.getElementById('bg_introduction');
    const canvasIntro = new Canvas(bgIntro, 1.0);
    canvasIntro.init();

    const particle = new Particle(100000/2);
    canvasIntro.scene.add(particle);

    setTimeout(() => {
      const timeline = new TimelineMax({repeat:-1, repeatDelay:2.0, yoyo: true});
      timeline.add(TweenMax.fromTo(particle, 7.0, {time:0.0}, {time:particle.totalDuration, ease:Power0.easeInOut}));
    }, 1000);


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
'use strict';

window.jQuery = window.$ = require('jquery');
import THREE from 'three';
import gsap from 'gsap';

import Canvas from './modules/canvas';
import Slide from './modules/slide';

(() => {
  $(() => {
    init();
  });

  const init = () => {
    console.log('init');

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

    setTimeout(() => {
      const timeline = new TimelineMax({repeat:-1, repeatDelay:2.0, yoyo: true});
      timeline.add(TweenMax.fromTo(eyecatch, 7.0, {time:0.0}, {time:eyecatch.totalDuration, ease:Power0.easeInOut}));
    }, 2000);
  };
})();
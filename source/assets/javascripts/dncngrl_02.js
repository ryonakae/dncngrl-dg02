'use strict';

window.jQuery = window.$ = require('jquery');
import Particle from './modules/particle';
const particle = new Particle();

(() => {
  $(() => {
    init();
  });

  const init = () => {
    console.log('init');

    particle.init();
  };
})();
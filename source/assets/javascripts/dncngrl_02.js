'use strict';

window.jQuery = window.$ = require('jquery');
import {particle} from './modules/particle';

(() => {
  $(() => {
    init();
  });

  const init = () => {
    console.log('init');

    particle();
  };
})();
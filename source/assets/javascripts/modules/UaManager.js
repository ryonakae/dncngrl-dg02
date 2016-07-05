'use strict';

window.jQuery = window.$ = require('jquery');

import UAParser from 'ua-parser-js';
const parser = new UAParser();
const ua = parser.getResult();

export default class UaManager {
  device() {
    if (ua.device.type === 'mobile' || ua.device.type === 'tablet') {
      return 'mobile';
    } else {
      return 'pc';
    }
  }

  os() {
    if (ua.os.name === 'iOS') {
      return 'iOS';
    } else if (ua.os.name === 'Android') {
      return 'Android';
    } else {
      return 'Other';
    }
  }

  init() {
    if (this.device() === 'pc') {
      $('body').addClass('is-pc');
    } else if (this.device() === 'mobile') {
      $('body').addClass('is-mobile');
    }

    if (this.device() === 'mobile' && this.os() === 'iOS') {
      $('body').addClass('is-ios');
    } else if (this.device() === 'mobile' && this.os() === 'Android') {
      $('body').addClass('is-android');
    } else if (this.device() === 'mobile') {
      $('body').addClass('is-other');
    }
  }
};
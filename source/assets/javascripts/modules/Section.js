window.jQuery = window.$ = require('jquery');
import THREE from 'three';
import gsap from 'gsap';

import uaManager from '../dg02';
import Canvas from './Canvas';
import Eyecatch from './Eyecatch';
import Particle from './Particle';
import Carousel from './Carousel';


// section class
export default class Section {
  constructor(options){
    this.bg = options.bg;
    this.canvas = null;
    this.magnification = options.magnification;
    this.canvasContent = null;
  }

  init(){
    this.canvas = new Canvas(this.bg, this.magnification);
  }

  transition(transitionOptions){
    function onStart(resolve, reject){
      return new Promise((resolve, reject)=>{
        // onStartに入れた関数の最後で
        // resolve(); を実行
        transitionOptions.onStart(resolve, reject);
      });
    }

    function main(resolve, reject){
      return new Promise((resolve, reject)=>{
        transitionOptions.main(resolve, reject);
      });
    }

    function onComplete(resolve, reject){
      return new Promise((resolve, reject)=>{
        transitionOptions.onComplete(resolve, reject);
      });
    }

    onStart()
      .then(main)
      .then(onComplete)
      .then(()=>{
        //console.log('transition done');
      });
  }
}
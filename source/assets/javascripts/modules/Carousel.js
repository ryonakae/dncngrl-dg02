import Slide from './Slide';


// Carousel Class
export default class Carousel {
  constructor(options){
    this.itemWidth = options.itemWidth;
    this.itemHeight = options.itemHeight;
    this.itemDivisionX = options.itemDivisionX;
    this.itemDivisionY = options.itemDivisionY;
    this.duration = options.duration;

    this.nav = options.nav;
    this.navNext = options.navNext;
    this.navPrev = options.navPrev;
    this.indicatorCurrent = options.indicatorCurrent;
    this.indicatorAll = options.indicatorAll;

    this.scene = options.scene;
    this.images = options.images;
    this.slides = [];
    this.slideCount = 1;

    this.init(this.images);
  }

  init(images){
    for(let i = 0; i < images.length; i++){
      this.addSlide(this.scene, images[i]);
    }

    this.slides[0].init('out');

    this.initIndicator(this.slideCount, this.slides.length);

    this.navNext.addEventListener('click', ()=>{
      this.slideNext(this.duration);
    }, false);
    this.navPrev.addEventListener('click', ()=>{
      this.slidePrev(this.duration);
    }, false);
  }

  addSlide(scene, imageSrc){
    const slide = new Slide(this.itemWidth, this.itemHeight, this.itemDivisionX, this.itemDivisionY, imageSrc);
    scene.add(slide);
    this.slides.push(slide);
    console.log(this.slides, this.slides.length);
  }

  showNext(currentNum, duration, cb){
    this.slides[currentNum-1].slideNextOut(duration);
    this.slides[currentNum].slideNextIn(duration, cb);
    console.log(currentNum);
  }

  showPrev(currentNum, duration, cb){
    this.slides[currentNum-1].slidePrevOut(duration);
    this.slides[currentNum-2].slidePrevIn(duration, cb);
    console.log(currentNum);
  }

  slideNext(duration){
    if(this.slideCount < this.slides.length){
      this.nav.classList.add('is-disableClick');
      this.showNext(this.slideCount, duration, ()=>{
        this.slideCount++;
        this.updateIndicator(this.slideCount);
        this.nav.classList.remove('is-disableClick');
      });
    }
  }

  slidePrev(duration){
    if(this.slideCount > 1){
      this.nav.classList.add('is-disableClick');
      this.showPrev(this.slideCount, duration, ()=>{
        this.slideCount--;
        this.updateIndicator(this.slideCount);
        this.nav.classList.remove('is-disableClick');
      });
    }
  }

  initIndicator(currentNum, allNum){
    this.indicatorAll.textContent = allNum;
    this.indicatorCurrent.textContent = currentNum;
  }

  updateIndicator(currentNum) {
    this.indicatorCurrent.textContent = currentNum;
  }
}
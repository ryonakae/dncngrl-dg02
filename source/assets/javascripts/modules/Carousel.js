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

    this.slides[0].init('in');

    this.initIndicator(this.slideCount, this.slides.length);

    $(this.navNext).on('click.carouselClick', ()=>{
      this.slideNext(this.duration);
    });
    $(this.navPrev).on('click.carouselClick', ()=>{
      this.slidePrev(this.duration);
    });
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

  parallax(dom, defaultRotateX, defaultRotateY, param){
    let mouseX;
    let mouseY;
    let rotation = {};

    for(let i = 0; i < this.slides.length; i++){
      this.slides[i].rotation.x = defaultRotateX;
      this.slides[i].rotation.y = defaultRotateY;

      $(dom).on('mousemove.carouselMousemove', (e)=>{
        mouseX = e.pageX - window.innerWidth/2;
        mouseY = e.pageY - window.innerHeight/2;

        this.slides[i].rotation.x = defaultRotateX + mouseY * param;
        this.slides[i].rotation.y = defaultRotateY + mouseX * param;
      });
    }
  }

  disableParallax(dom){
    $(dom).off('.carouselMousemove');
  }

  in(duration, cb){
    this.slides[0].slideNextIn(duration, cb);
  }

  out(duration, cb){
    this.slides[this.slideCount-1].slidePrevOut(duration, cb);
  }
}
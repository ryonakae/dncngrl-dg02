import Slide from './Slide';


// Carousel Class
export default class Carousel {
  constructor(itemWidth, itemHeight, itemDivisionX, itemDivisionY){
    this.itemWidth = itemWidth;
    this.itemHeight = itemHeight;
    this.itemDivisionX = itemDivisionX;
    this.itemDivisionY = itemDivisionY;
    this.slides = [];
  }

  addSlide(scene, imageSrc){
    const slide = new Slide(this.itemWidth, this.itemHeight, this.itemDivisionX, this.itemDivisionY, imageSrc);
    scene.add(slide);
    this.slides.push(slide);
    console.log(this.slides, this.slides.length);
  }

  slideNext(currentNum, duration, cb){
    this.slides[currentNum-1].slideNextOut(duration);
    this.slides[currentNum].slideNextIn(duration, cb);
    console.log(currentNum);
  }

  slidePrev(currentNum, duration, cb){
    this.slides[currentNum-1].slidePrevOut(duration);
    this.slides[currentNum-2].slidePrevIn(duration, cb);
    console.log(currentNum);
  }
}
import Page from "../classes/Page";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
export default class Results extends Page {
  constructor() {
    super({
      id: "resultsPage",
      element: ".resuts-page",
      elements: {
        tabs: ".tab",
        contents: ".tab-content",
        canvas: "canvas",
        sliderInner: ".results-slider__inner",
        slides: ".results-slider__slide",
        prevBtn: ".results-slider__prev",
        nextBtn: ".results-slider__next",
      },
    });
    gsap.registerPlugin(ScrollTrigger);

  
  }

resultAnimIntro() {
	gsap.fromTo(".results-slider h1", {y:30,autoAlpha: 0}, {y:0,autoAlpha: 1, duration: 1, ease: "power3.out",delay: 6});
	gsap.fromTo(".results-slider__slide", {y: 30, autoAlpha: 0}, {y:0,autoAlpha: 1, duration: 1, ease: "power3.out",delay: 6,stagger: 0.2});
	gsap.fromTo(".mob-heading h1", {y:30,autoAlpha: 0}, {y:0,autoAlpha: 1, duration: 1, ease: "power2.out",delay: 4.5});

}

  create() {

    super.create();
	console.log("results page");
	// this.resultAnimIntro();
	
  }

  onResize() {
    super.onResize();

  }

  destroy() {
    super.destroy();
  }
}

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Swiper, {
  Autoplay,
  Pagination,
  Mousewheel,
  Navigation,
  EffectFade,
} from "swiper";
import Page from "../classes/Page";
import Model from "../components/Canvas/Model";

export default class Home extends Page {
  constructor() {
    super({
      id: "home",
      element: ".home",
      elements: {
        results: ".results",
        blueSection: ".who-we-are",
        canvas: "canvas.home-webgl",
        hero_bg: ".hero__bg",
        hero_title: ".hero__title h1 span",
        hero_svg: ".hero__title h1 svg",
        hero_text: ".hero__title p",
        scroll_down: ".scroll-down",
      },
    });

    gsap.registerPlugin(ScrollTrigger);
  }

  create() {
    super.create();

    this.pinSection();
    this.blueSection();
    this.clientSliderFirst();
    this.clientSliderSecond();
    // this.drawSvg();
  }

  createPageAnimations() {
    super.create();
    this.initHomeAnimation();
  }

  initHomeAnimation() {
    console.log("start home");
    this.heroTl = gsap.timeline({
      defaults: {
        delay: 1.5,
      },
    });
    this.heroTl.fromTo(
      this.elements.hero_bg,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 1.5 }
    );
    this.heroTl.fromTo(
      this.elements.hero_title,
      { autoAlpha: 0, y: 50 },
      { autoAlpha: 1, y: 0 },
      0
    );
    this.heroTl.fromTo(
      this.elements.hero_text,
      { autoAlpha: 0, y: 50 },
      { autoAlpha: 1, y: 0 },
      0
    );
  }

  drawSvg() {
    const myPath = document.querySelector(".svg-path");
    // Get the length of the path
    const pathLength = myPath.getTotalLength();

    // Set the initial values for the stroke-dasharray and stroke-dashoffset properties
    myPath.style.strokeDasharray = pathLength;
    myPath.style.strokeDashoffset = pathLength;

    // Animate the stroke-dashoffset property from pathLength to 0
    gsap.to(myPath, {
      strokeDashoffset: 0,
      duration: 2,
      ease: "Power1.easeOut",
    });
  }

  modelAnimation() {
    this.scrollTl = gsap.timeline({ paused: true });
    this.scrollTl.to(this.handModel.rotation, { y: -Math.PI * 2 }, 0);
    this.scrollTl.to(this.handModel.children[3].material, { opacity: 0 }, 0);
    this.scrollTl.to(this.handModel.position, { x: 0.629 }, 0);
    this.scrollTl.to(this.handModel.children[4].material, { opacity: 1 }, 0);

    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      scrub: true,
      animation: this.scrollTl,
      id: "modelAnimation",
    });
  }

  pinSection() {
    const pinTl = gsap.timeline({ paused: true });
    pinTl.to(".results__overlay", { opacity: 1, delay: 0.15 });

    ScrollTrigger.create({
      trigger: ".results",
      invalidateOnRefresh: true,
      pin: true,
      start: "top top",
      end: "100%",
      scrub: true,
      pinSpacing: false,
      animation: pinTl,
      id: "pinSection",
    });
  }

  blueSection() {
    ScrollTrigger.create({
      trigger: this.elements.blueSection,
      start: "top top",
      toggleClass: {
        targets: ".logo-home",
        className: "logo-color",
      },
      id: "blueSection",
    });
  }

  clientSliderFirst() {
    this.clientSldier = new Swiper(".client-slider", {
      modules: [Autoplay],
      slidesPerView: 4,
      spaceBetween: 90,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
      loop: true,
      speed: 6000,
    });
  }

  clientSliderSecond() {
    this.clientSldierSecond = new Swiper(".client-slider-bottom", {
      modules: [Autoplay],
      slidesPerView: 4,
      spaceBetween: 90,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
        reverseDirection: true,
      },
      loop: true,
      speed: 6000,
    });
  }

  destroy() {
    super.destroy();
    // Kill the modelAnimation ScrollTrigger
    ScrollTrigger.getById("modelAnimation")?.kill();

    // Unpin the pinSection ScrollTrigger
    ScrollTrigger.getById("pinSection")?.disable();

    // Remove the blueSection ScrollTrigger
    ScrollTrigger.getById("blueSection")?.kill();

    // Destroy the clientsSlider Swiper instance
    // Destroy the Swiper instance
    if (this.clientSldier) {
      this.clientSldier.destroy();
    }
    if (this.clientSldierSecond) {
      this.clientSldierSecond.destroy();
    }
  }
}

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

export default class Home extends Page {
  constructor() {
    super({
      id: "home",
      element: ".home",
      elements: {
        results: ".results",
        blueSection: ".who-we-are",
        results_nav: ".results__nav span",
        results_headings: ".results__problem h2",
        results_text: ".results__problem p",
        results_result: ".results__result p",
        results_label: ".results__label p",
        results_border: ".results__border",
        results_cursor: ".results__follow",
      },
    });

    gsap.registerPlugin(ScrollTrigger);
  }

  create() {
    super.create();
    this.initResults();
    this.pinSection();
    this.blueSection();
    this.clientSliderFirst();
    this.clientSliderSecond();
    // this.drawSvg();
  }


  initResults() {
    const initTl = gsap.timeline({ paused: true });

    initTl.fromTo(
      this.elements.results_headings[0],
      { autoAlpha: "0", y: "100%" },
      { autoAlpha: "1", y: 0, duration: 1, ease: "Power2.out" },
      0
    );
    initTl.fromTo(
      this.elements.results_text[0],
      { autoAlpha: "0", y: "100%" },
      { autoAlpha: "1", y: 0, duration: 1, ease: "Power2.out" },
      0.2
    );
    initTl.fromTo(
      this.elements.results_result[0],
      { autoAlpha: "0", y: "100%" },
      { autoAlpha: "1", y: 0, duration: 1, ease: "Power2.out" },
      1
    );
    initTl.fromTo(
      this.elements.results_label,
      { autoAlpha: "0", y: "100%" },
      { autoAlpha: "1", y: 0, duration: 1, ease: "Power2.out" },
      1
    );
    initTl.fromTo(
      this.elements.results_nav,
      { autoAlpha: "0", y: 40 },
      { autoAlpha: "1", y: 0, duration: 1, ease: "Power2.out" },
      1
    );
    initTl.fromTo(
      this.elements.results_border,
      { scaleX: 0, y: 40 },
      { scaleX: 1, y: 0, duration: 1, ease: "Power2.out" },
      1
    );
    initTl.fromTo(
      this.elements.results_cursor,
      { autoAlpha: "0" },
      { autoAlpha: "1", duration: 1, ease: "Power2.out" },
      1.2
    );

    ScrollTrigger.create({
      trigger: ".result",
      start: "-20% top ",
      once: true,
      animation: initTl,
    });
  }


  //   drawSvg() {
  //     const myPath = document.querySelector(".svg-path");
  //     // Get the length of the path
  //     const pathLength = myPath.getTotalLength();

  //     // Set the initial values for the stroke-dasharray and stroke-dashoffset properties
  //     myPath.style.strokeDasharray = pathLength;
  //     myPath.style.strokeDashoffset = pathLength;

  //     // Animate the stroke-dashoffset property from pathLength to 0
  //     gsap.to(myPath, {
  //       strokeDashoffset: 0,
  //       duration: 2,
  //       ease: "Power1.easeOut",
  //     });
  //   }

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
    gsap.to(".logo-symbol", {
      fill: "#fff",
      duration: 0.3,
      scrollTrigger: {
        trigger: this.elements.blueSection,
        start: "top top",
        end: "bottom top",
        toggleActions: "play reverse play reverse",
        id: "blueSection",
      },
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

    // Reset the logo color to its default value
    gsap.set(".logo-symbol", { fill: "#3573FF" });
  }
}

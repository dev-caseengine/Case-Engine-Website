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
        results_label_problem: ".results__label-problem p",
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
    this.foundersSlider();
    this.whiteSection();
    this.clientSliderFirst();
    this.clientSliderSecond();
  }

  foundersSlider() {
    // Get all the elements
    const bullets = document.querySelectorAll(".who-we-are__bulets span");
    const founders = document.querySelectorAll(".who-we-are__founders__inner");
    const activeBulletClass = "active-bullet";


    // Loop through the bullets and add click event listeners
    bullets.forEach((bullet, index) => {

		
      bullet.addEventListener("click", () => {
        // Remove the active class from all the bullets
        bullets.forEach((bullet) => {
          bullet.classList.remove(activeBulletClass);
        });

        // Add the active class to the selected bullet
        bullet.classList.add(activeBulletClass);

        // Remove the active class from all the founders
        founders.forEach((founder) => {
          founder.classList.remove("active-founder");
        });

        // Add the active class to the selected founder
        founders[index].classList.add("active-founder");

        // Use GSAP to add the fade transition
        gsap.fromTo(
          ".who-we-are__founders__inner",
          { opacity: 0, duration: 0.5 },
          { opacity: 1, duration: 0.5 }
        );

	


      });
    });
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
      this.elements.results_label_problem,
      { autoAlpha: "0", y: "100%" },
      { autoAlpha: "1", y: 0, duration: 1, ease: "Power2.out" },
      0.8
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
    pinTl.to(".results__overlay", { opacity: 1, delay: 1 });

    // ScrollTrigger.config({
    //   matchMedia: "(min-width: 768px)",
    // });

    ScrollTrigger.create({
      trigger: ".results",
      invalidateOnRefresh: true,
      pin: true,
      start: "top top",
      end: "150%",
      scrub: true,
      pinSpacing: false,
      animation: pinTl,
      id: "pinSection",
    });
  }

  whiteSection() {
    this.whiteSections = document.querySelectorAll(".white-bg");
    this.whiteSections.forEach((section) => {
      this.whiteTl = gsap.timeline({ paused: true });
      this.whiteTl.to(".burger-btn *, .close-btn *", {
        background: "#000",
        duration: 0.3,
      });

      this.whiteTl.to(
        ".border-btn",
        {
          borderColor: "rgba(0,0,0,0.1)",
          color: "#000",
        },
        0
      );

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        toggleActions: "play reverse play reverse",
        animation: this.whiteTl,
        id: "whiteSection",
      });

      //   gsap.to(".burger-btn *, .close-btn *", {
      //     background: "#000",
      //     duration: 0.3,
      //     scrollTrigger: {
      //       trigger: section,
      //       start: "top top",
      //       end: "bottom top",
      //       toggleActions: "play reverse play reverse",
      //       id: "blueSection",
      //     },
      //   });
    });

    // gsap.to(".burger-btn *, .close-btn *", {
    //   background: "#000",
    //   duration: 0.3,
    //   scrollTrigger: {
    //     trigger: this.elements.blueSection,
    //     start: "top top",
    //     end: "bottom top",
    //     toggleActions: "play reverse play reverse",
    //     id: "blueSection",
    //   },
    // });
  }

  clientSliderFirst() {
    this.clientSldier = new Swiper(".client-slider", {
      modules: [Autoplay],
      slidesPerView: 2,
      spaceBetween: 30,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
      loop: true,
      speed: 6000,
      breakpoints: {
        920: {
          slidesPerView: 4,
          spaceBetween: 90,
        },
      },
    });
  }

  clientSliderSecond() {
    this.clientSldierSecond = new Swiper(".client-slider-bottom", {
      modules: [Autoplay],
      slidesPerView: 2,
      spaceBetween: 30,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
        reverseDirection: true,
      },
      loop: true,
      speed: 6000,
      breakpoints: {
        920: {
          slidesPerView: 4,
          spaceBetween: 90,
        },
      },
    });
  }

  destroy() {
    super.destroy();
    // Kill the modelAnimation ScrollTrigger
    ScrollTrigger.getById("modelAnimation")?.kill();

    // Unpin the pinSection ScrollTrigger
    ScrollTrigger.getById("pinSection")?.disable();
    // Remove the blueSection ScrollTrigger
    ScrollTrigger.getById("whiteSection")?.kill();
    // Destroy the clientsSlider Swiper instance
    // Destroy the Swiper instance
    if (this.clientSldier) {
      this.clientSldier.destroy();
    }
    if (this.clientSldierSecond) {
      this.clientSldierSecond.destroy();
    }

    // Reset the logo color to its default value
    gsap.set(".burger-btn *, .close-btn *", { background: "#fff" });
    gsap.set(".border-btn, .close-btn *", {
      borderColor: "rgba(255,255,255,0.1)",
      color: "#fff",
    });
  }
}

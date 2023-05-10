import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import each from "lodash/each";
import Text from "./Animations/Text";

export default class Page {
  constructor({ element, elements, id }) {
    this.id = id;
    this.selector = element;
    this.selectorChildren = {
      ...elements,
    };

    gsap.registerPlugin(ScrollTrigger);
  }

  createSmoothScroll() {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    if (!isMobile) {
      this.lenis = new Lenis({
        smooth: true,
        duration: 0.6,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        mouseMultiplier: 1,
        smoothTouch: true,
        touchMultiplier: 3,
      });
      this.lenis.stop();
      this.lenis.on("scroll", () => ScrollTrigger.update());
    } else {
      // Do nothing or fallback to default scrolling behavior on mobile devices
    }
  }

  createAnimations() {
    this.fadeText = new Text();
  }

  //Create Initial animation after laoding
  showAnimation(resolve) {
    this.introAnim = gsap.timeline({ delay: 1, onComplete: resolve });
    this.introAnim.to(
      ".overlay span",
      { scaleY: 0, duration: 1, ease: "power3.out" },
      -0.2
    );

    if (document.querySelector("h1 .line-heading div") != null) {
      this.introAnim.to(
        "h1 .line-heading div",
        {
          y: 0,
          duration: 1,
          ease: "power2.out",
          stagger: 0.1,
        },
        0.4
      );
    }

    if (document.querySelector(".contact-hero__title h1 span") != null) {
      this.introAnim.fromTo(
        ".contact-hero__title h1 span",
        { yPercent: 100 },
        { yPercent: 0, duration: 1, stagger: 0.1, ease: "power2.out" },
        0.4
      );
    }

    if (document.querySelector(".hero-desc") != null) {
      this.introAnim.fromTo(
        ".hero-desc",
        { autoAlpha: 0, yPercent: 50 },
        { autoAlpha: 1, yPercent: 0, duration: 1, ease: "power2.out" },
        0.8
      );
    }

    if (document.querySelector(".hero-btn") != null) {
      this.introAnim.fromTo(
        ".hero-btn",
        { autoAlpha: 0, yPercent: 50 },
        { autoAlpha: 1, yPercent: 0, duration: 1, ease: "power2.out" },
        0.9
      );
    }

    if (document.querySelector(".label-contact") != null) {
      this.introAnim.fromTo(
        ".label-contact",
        { autoAlpha: 0, yPercent: 50 },
        { autoAlpha: 1, yPercent: 0, duration: 1, ease: "power2.out" },
        0.9
      );
    }

    this.introAnim.to(
      ".header",
      { y: 0, autoAlpha: 1, duration: 1, ease: "power2.out" },
      0.8
    );

    if (document.querySelector(".scroll-down img") != null) {
      this.introAnim.to(
        ".scroll-down img",
        { y: 0, autoAlpha: 1, duration: 1, ease: "power2.out" },
        1
      );
    }

    if (document.querySelector(".scroll-down p") != null) {
      this.introAnim.to(
        ".scroll-down p",
        { y: 0, autoAlpha: 1, duration: 1, ease: "power2.out" },
        1.2
      );
    }

    if (document.querySelector(".scroll-down") != null) {
      this.introAnim.to(
        ".scroll-down",
        { autoAlpha: 1, duration: 1, ease: "power2.out" },
        1.2
      );
    }
  }

  scrollDown() {
    if (document.querySelector(".scroll-down") != null) {
      this.scrollTl = gsap.timeline({ paused: true });
      this.scrollTl.to(".scroll-down img", {
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.out",
      });
      this.scrollTl.to(
        ".scroll-down p",
        { autoAlpha: 0, duration: 0.5, ease: "power2.out" },
        0.1
      );
      this.scrollTl.to(
        ".scroll-down",
        { scale: 0, duration: 0.7, ease: "power2.out" },
        0.3
      );

      ScrollTrigger.create({
        start: "80",
        onEnter: () => this.scrollTl.play(),
        onLeaveBack: () => this.scrollTl.reverse(),
      });
    }
  }

  globeAnimation() {
	if (document.querySelector(".globe-svg") != null) {
    const lines = Array.from(document.querySelectorAll(".globe-line"));

    const paths = [
      "M283.948 81.8876C374.009 81.8876 447.017 70.0138 447.017 55.3667C447.017 40.7195 374.009 28.8457 283.948 28.8457C193.887 28.8457 120.879 40.7195 120.879 55.3667C120.879 70.0138 193.887 81.8876 283.948 81.8876Z",
      "M283.945 192.765C421.321 192.765 532.686 174.643 532.686 152.288C532.686 129.933 421.321 111.811 283.945 111.811C146.57 111.811 35.2051 129.933 35.2051 152.288C35.2051 174.643 146.57 192.765 283.945 192.765Z",
      "M283.951 332.561C440.201 332.561 566.867 310.752 566.867 283.849C566.867 256.946 440.201 235.137 283.951 235.137C127.701 235.137 1.03516 256.946 1.03516 283.849C1.03516 310.752 127.701 332.561 283.951 332.561Z",
      "M283.949 455.888C421.325 455.888 532.689 437.766 532.689 415.411C532.689 393.056 421.325 374.934 283.949 374.934C146.574 374.934 35.209 393.056 35.209 415.411C35.209 437.766 146.574 455.888 283.949 455.888Z",
      "M446.983 512.332C446.983 526.984 373.992 538.852 283.913 538.852C193.835 538.852 121.076 526.984 121.076 512.332C121.076 497.679 194.067 485.811 284.107 485.811C374.147 485.811 446.983 497.679 446.983 512.332Z",
      "M283.04 565.856C316.071 565.856 342.847 439.191 342.847 282.94C342.847 126.69 316.071 0.0244141 283.04 0.0244141C250.009 0.0244141 223.232 126.69 223.232 282.94C223.232 439.191 250.009 565.856 283.04 565.856Z",
      "M283.949 566.765C390.749 566.765 477.328 440.099 477.328 283.849C477.328 127.598 390.749 0.932617 283.949 0.932617C177.149 0.932617 90.5703 127.598 90.5703 283.849C90.5703 440.099 177.149 566.765 283.949 566.765Z",
      "M565.832 282.916C565.832 126.666 439.166 -0.000507478 282.916 -0.000500648C126.666 -0.000493818 -1.91966e-05 126.666 -1.23667e-05 282.916C-5.53675e-06 439.166 126.666 565.832 282.916 565.832C439.166 565.832 565.832 439.166 565.832 282.916Z",
    ];

    const svgTl = gsap.timeline({ paused: true });

    lines.forEach((line, i) => {
      svgTl.to(
        line,
        {
          attr: { d: paths[i] },
          duration: 1,
          ease: "power2.out",
        },
        0.1 * i
      );
    });

    svgTl.to(
      ".globe-svg",
      {
        rotate: -24,
        duration: 1,
        ease: "power3.out",
      },
      0.6
    );

    ScrollTrigger.create({
      trigger: ".globe-svg",
      start: "top 50%",
      animation: svgTl,
      once: true,
    });
}
  }

  create() {
    this.element = document.querySelector(this.selector);
    this.elements = {};

    each(this.selectorChildren, (value, key) => {
      if (
        value instanceof window.HTMLElement ||
        value instanceof window.NodeList ||
        Array.isArray(value)
      ) {
        // if value is already an actual element or array of any type, save it as is
        this.elements[key] = value;
      } else {
        // if value is a selector, get the element and save that
        this.elements[key] = document.querySelectorAll(value);

        if (this.elements[key].length === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].length === 1) {
          this.elements[key] = document.querySelector(value);
        }
      }
    });
    this.createAnimations();
    this.createSmoothScroll();
    this.scrollDown();
	this.globeAnimation();
  }

  show() {
    return new Promise((resolve) => {
      this.showAnimation(resolve);
      // Scroll to top of page
      window.scrollTo(0, 0);

      // Re-enable Lenis
      setTimeout(() => {
        if (this.lenis) {
          this.lenis.start();
        }
      }, 1000);

      //   gsap.from(this.element, {
      //     // autoAlpha: 0,
      //     duration: 0.5,
      //     onComplete: resolve,
      //   });
    });
  }

  hide() {
    return new Promise((resolve) => {
      this.destroy();

      gsap.to(".overlay span", {
        scaleY: 1,
        duration: 0.5,
        ease: "Power2.out",
        onComplete: resolve,
      });

      //   gsap.to(this.element, {
      //     autoAlpha: 0,
      //     duration: .5,
      //     onComplete: resolve,
      //   });
    });
  }

  update(time) {
    if (this.lenis) {
      this.lenis.raf(time);
    }
  }

  destroy() {
    // Disable Lenis
    if (this.lenis) {
      this.lenis.stop();
    }
  }
}

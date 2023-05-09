import Lenis from "@studio-freight/lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
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

    if (document.querySelector(".label") != null) {
      this.introAnim.fromTo(
        ".label",
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

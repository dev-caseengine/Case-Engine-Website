import Lenis from "@studio-freight/lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import gsap from "gsap";
import each from "lodash/each";
import map from "lodash/map";

import Text from "./Animations/Text";

export default class Page {
  constructor({ element, elements, id }) {
    this.id = id;
    this.selector = element;
    this.selectorChildren = {
      ...elements,
      //   animationsTitles: '[data-animation="title"]',
      //   animationTexts: '[data-animation="text"]',
    };

    gsap.registerPlugin(ScrollTrigger);
  }

  createSmoothScroll() {
    this.lenis = new Lenis({
      lerp: 0.6,
      smooth: true,
    });

    this.lenis.stop();
    this.lenis.on("scroll", () => ScrollTrigger.update());
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
  }
  createAnimations() {
    this.fadeText = new Text();
  }

  createPageAnimations() {
    console.log("create page animations");
  }

  show() {
    return new Promise((resolve) => {
      // Scroll to top of page
      window.scrollTo(0, 0);

      // Re-enable Lenis
      setTimeout(() => {
        this.lenis.start();
      }, 1000);

      gsap.from(this.element, {
        autoAlpha: 0,
        duration: 0.5,
        onComplete: resolve,
      });
    });
  }

  hide() {
    return new Promise((resolve) => {
      this.destroy();
      gsap.to(this.element, {
        autoAlpha: 0,
        duration: 0.5,
        onComplete: resolve,
      });
    });
  }

  update(time) {
    this.lenis.raf(time * 1.3);
  }

  destroy() {
    // Disable Lenis
    this.lenis.stop();
  }
}

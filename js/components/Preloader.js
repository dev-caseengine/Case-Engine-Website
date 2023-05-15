import gsap from "gsap";
import Component from "../classes/Component";
export default class Preloader extends Component {
  constructor({ resources }) {
    super({
      element: ".preloader",
      elements: {
        title: ".preloader__title p",
        percentage: ".preloader__percentage h2",
        bar: ".preloader__bar",
        bars: ".preloader__bars span",
      },
    });

    this.resources = resources;

    this.createLoader();
  }

  createLoader() {
    //animate the progress
    this.resources.on("progress", (loaded, toLoad) => {

      this.percentage = Math.round((loaded / toLoad) * 100);

      this.elements.percentage.firstChild.nodeValue = this.percentage;
      gsap.to(this.elements.percentage, {
        xPercent: this.percentage / 1.5,
        ease: "linear",
      });

      gsap.to(this.elements.bar, {
        scaleX: this.percentage / 100,
        ease: "linear",
      });

      //   gsap.set('.bg-anim', {autoAlpha: 0})
      //   gsap.to('.bg-anim', {autoAlpha: this.percentage / 100, ease: "linear",})

      if (loaded === toLoad) {
        this.onLoaded();
      }
    });
  }

  onLoaded() {
    // when assets are loaded animate out
    this.animateOut = gsap.timeline({
      delay: 0.5,
    });

    // this.animateOut.to(
    //   this.element,
    //   {
    //     yPercent: -100,
    //     duration: 1,
    //   },

    // );

    this.animateOut.to(
      this.elements.percentage,
      { yPercent: 100, duration: 1 },
      0
    );
    this.animateOut.to(this.elements.title, { yPercent: 100, duration: 1 }, 0);

    this.animateOut.to(this.elements.bars, { autoAlpha: 0, duration: 0.3 }, 0);

    this.animateOut.to(this.elements.bar, { autoAlpha: 0, duration: 0.3 }, 0);

    this.animateOut.call(() => {
      this.destroy();
    });

    this.trigger("loaded");
  }

  destroy() {
    this.element.parentNode.removeChild(this.element);
  }
}

import gsap from "gsap";
import "../../../styles/splitting.scss";
import "../../../styles/splitting-cells.scss";
import Splitting from "splitting";
import Animation from "./Animation";
export default class Title extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });
    Splitting();
  }

  animateIn() {
    const chars = this.element.querySelectorAll(".char");

    chars.forEach((char) => gsap.set(char.parentNode, { perspective: 1000 }));

    gsap.fromTo(
      chars,
      {
        "will-change": "opacity, transform",
        transformOrigin: "50% 0%",
        opacity: 0,
        rotationX: -90,
        z: -200,
      },
      {
        ease: "power1",
        opacity: 1,
        stagger: 0.03,
        rotationX: 0,
        z: 0,
        scrollTrigger: {
          trigger: this.element,
          start: "center bottom",
          end: "bottom top+=20%",
          scrub: true,
        },
      }
    );
  }

  animateOut() {
    // console.log("animateOut")
    // gsap.set(this.element, {y: 100})
  }
}

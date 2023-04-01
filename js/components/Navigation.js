import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Component from "../classes/Component";

export default class Navigation extends Component {
  constructor({ template }) {
    super({
      element: ".header",
      elements: {
        body: ".body",
        logo: ".header__logo",
        logoText: ".logo-text",
        blueSection: ".blue-section",
      },
    });
    gsap.registerPlugin(ScrollTrigger);
    this.onChange(template);
    // this.initHeader();
  }

  initHeader() {
    console.log("init header");
    ScrollTrigger.create({
      start: "100",
      markers: true,
      id: "header",
      toggleClass: {
        targets: this.elements.body,
        className: "has-scrolled",
      },
      end: "bottom bottom-=200",
      onEnter: ({ direction }) => this.navAnimation(direction),
      onLeaveBack: ({ direction }) => this.navAnimation(direction),
    });
  }

  navAnimation(direction) {
    const scrollDown = direction === 1;
    gsap.to(this.elements.logoText, { autoAlpha: () => (scrollDown ? 0 : 1) });
    gsap.to(this.elements.logoText, {
      y: () => (scrollDown ? 5 : 0),
      duration: 0.3,
    });
  }

  onChange(template) {
    if (template === "home") {
    //   this.elements.logo.classList.remove("logo-about");
    //   this.elements.logo.classList.add("logo-home");
    } else {
    //   this.elements.logo.classList.remove("logo-home");
    //   this.elements.logo.classList.add("logo-about");
    }
  }
}

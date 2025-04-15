import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
export default class Footer {
  constructor({ template }) {
    gsap.registerPlugin(ScrollTrigger);
    this.footer = document.querySelector(".footer");
    this.onChange(template);
  }

  onChange(template) {
    if (template === "home") {
      this.footer && this.footer.classList.add("white-bg");
    } else {
      this.footer && this.footer.classList.remove("white-bg");
    }

    if (template === "about") {
      this.footer && this.footer.classList.add("dark-footer");
    } else {
      this.footer && this.footer.classList.remove("dark-footer");
    }

    if (template === "resultsPage" || template === "contact" || template === "contactMeta" || template === "thankYouPage") {
      this.footer && (this.footer.style.display = "none");
    } else {
      this.footer && (this.footer.style.display = "block");
    }


  }
}

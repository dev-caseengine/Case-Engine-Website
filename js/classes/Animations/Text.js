import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Splitting from "splitting";

export default class Text {
  constructor() {
    gsap.registerPlugin(ScrollTrigger);
    this.fadeUp();
    this.opacity();
    this.label();
    this.border();
  }

  fadeUp() {
    setTimeout(() => {
      let revealText = [
        ...document.querySelectorAll(
          '[data-splitting][data-animation="fade-up"]'
        ),
      ];
      let results = Splitting({ target: revealText, by: "lines" });

      results.forEach((splitResult) => {
        const wrappedLines = splitResult.lines
          .map(
            (wordsArr) => `
			<span class="line"><div class="words">
			  ${wordsArr
          .map(
            (word) => `${word.outerHTML}<span class="whitespace"> 
				</span>`
          )
          .join("")}
			</div></span>`
          )
          .join("");
        splitResult.el.innerHTML = wrappedLines;
      });
      let revealLines = revealText.forEach((element) => {
        const lines = element.querySelectorAll(".line .words");

        gsap.from(lines, 1, {
          y: "100%",
          ease: "Power3.out",
          stagger: 0.25,
          delay: 0.2,
          scrollTrigger: {
            trigger: element,
			start: "top bottom-=20%",
            end: "center top+=40%",
            scrub: true,
			once: true,	
          },
        });
      });
    }, 500);
  }

  opacity() {
    const text = document.querySelectorAll('[data-animation="text"]');
    const results = Splitting({ target: text, by: "words" });

    results.forEach((result) => {
      gsap.fromTo(
        result.words,
        {
          "will-change": "opacity",
          opacity: 0.1,
        },
        {
          ease: "none",
          opacity: 1,
          stagger: 0.05,
          scrollTrigger: {
            trigger: result.el,
            start: "top bottom-=20%",
            end: "center top+=20%",
            scrub: true,
            once: true,
          },
        }
      );
    });
  }

  border() {
    const borders = document.querySelectorAll(".border");

    borders.forEach((border) => {
      gsap.set(border, { overflow: "hidden" }); // set overflow to hidden to hide the overflow of ::after element

      gsap.to(border, {
        "--widthline": "100%", // set the custom property to 100%
        duration: 1,
        ease: "power1.inOut",
        delay: 0.5,
        scrollTrigger: {
          trigger: border,
          start: "top bottom-=20%",
          end: "center top+=20%",
          scrub: true,
          once: true,
        },
      });
    });
  }

  label() {
    this.label = document.querySelectorAll(".label");

    this.label.forEach((label) => {
      gsap.fromTo(
        label,
        {
          "will-change": "opacity",
          opacity: 0,
        },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: label,
            start: "top bottom-=20%",
            end: "center top+=20%",
            scrub: true,
            once: true,
          },
        }
      );
    });
  }


}

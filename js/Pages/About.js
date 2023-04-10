import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Page from "../classes/Page";
import Swiper, {
  Autoplay,
  Pagination,
  Mousewheel,
  Navigation,
  EffectFade,
} from "swiper";

export default class About extends Page {
  constructor() {
    super({
      id: "about",
      element: ".about",
      elements: {
        blueSection: ".blue-section",
      },
    });
    gsap.registerPlugin(ScrollTrigger);
  }
  create() {
    super.create();
    this.videoModal();
    this.teamSlide();
    this.blueSection();
    this.moveImages();
  }


  moveImages() {
    const images = document.querySelectorAll(".about-gallery__img");
    images.forEach((image) => {
      const depth = parseFloat(image.getAttribute("data-depth"));
      const movement = -(image.clientHeight * depth);

      gsap.to(image, {
        y: movement,
        ease: "none",
        scrollTrigger: {
          trigger: image,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    gsap.to(".about-gallery__team-img img", {
      y: -50,
      scrollTrigger: {
        trigger: ".about-gallery__team-img",
        start: "top center",
        scrub: true,
      },
    });
  }

  videoModal() {
    const modalBtn = document.querySelector(".about-video__btn");
    const closeModalBtn = document.querySelector(".close-modal");
    const modal = document.querySelector(".about-video__modal");
    const videoIframe = document.querySelector(".vimeo-video");
    let player = null;

    const loadVimeoPlayerAPI = () => {
      const script = document.createElement("script");
      script.src = "https://player.vimeo.com/api/player.js";
      script.onload = createVimeoPlayerInstance;
      document.body.appendChild(script);
    };

    const createVimeoPlayerInstance = () => {
      player = new Vimeo.Player(videoIframe);
      player.play();
    };

    modalBtn.addEventListener("click", () => {
      document.body.style.overflow = "hidden";
      this.lenis.stop();
      modal.style.display = "flex"; // set display to block before animating opacity
      gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      if (player === null) {
        loadVimeoPlayerAPI();
      } else {
        player.play().catch((error) => {
          console.error(error);
        });
      }
    });

    closeModalBtn.addEventListener("click", () => {
      gsap.fromTo(
        modal,
        { opacity: 1 },
        {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            modal.classList.remove("about-video__modal-active");
            document.body.style.overflow = "auto";
            this.lenis.start();
            player.pause();
            modal.style.display = "none"; // set display to none after animating opacity
          },
        }
      );
    });
  }

  aboutGallery() {
    this.section = document.querySelector(".about-gallery");
    this.images = gsap.utils.toArray(".about-gallery__img");

    // create timeline for parallax animation
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: this.section,
        start: "top top",
        bottom: "bottom bottom",
        scrub: true,
        pin: true,
        markers: true,
        id: "parallax",
      },
    });

    // add animation to move images up
    this.images.forEach((image) => {
      const speed = parseFloat(image.dataset.parallax) || 1;
      const sectionHeight = this.section.offsetHeight;
      const yStart = -((sectionHeight * (speed - 1)) / 2); // use section height instead of image height

      tl.to(
        image,
        {
          yPercent: 100 + yStart, // subtract yStart from 100
        },
        0
      );
    });
  }

  teamSlide() {
    this.teamSlider = new Swiper(".about-team__slider", {
      modules: [Navigation],
      slidesPerView: 2.5,
      spaceBetween: 30,
      navigation: {
        nextEl: ".about-arrow-right",
        prevEl: ".about-arrow-left",
      },
    });
  }

  blueSection() {
    gsap.to(".logo-text", {
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

  destroy() {
    super.destroy();

    // Remove the blueSection ScrollTrigger
    ScrollTrigger.getById("parallax")?.kill();

    // Remove the blueSection ScrollTrigger
    ScrollTrigger.getById("blueSection")?.kill();

    if (this.teamSlider) {
      this.teamSlider.destroy();
    }

    // Reset the logo color to its default value
    gsap.set(".logo-symbol", { fill: "#3573FF" });

  }
}

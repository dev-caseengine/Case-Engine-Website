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
    modal.classList.add("about-video__modal-active");
    if (player === null) {
      loadVimeoPlayerAPI();
    } else {
      player.play().catch((error) => {
        console.error(error);
      });
    }
  });

  closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("about-video__modal-active");
	document.body.style.overflow = "auto";
	this.lenis.start();
    player.pause();


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
    const teamSlider = new Swiper(".about-team__slider", {
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
    ScrollTrigger.create({
      trigger: this.elements.blueSection,
      start: "top top",

      toggleClass: {
        targets: ".logo-about",
        className: "logo-color",
      },

      id: "blueSection",
    });
  }

  destroy() {
    super.destroy();

    // Remove the blueSection ScrollTrigger
    ScrollTrigger.getById("parallax")?.kill();

    // Remove the blueSection ScrollTrigger
    ScrollTrigger.getById("blueSection")?.kill();

    const teamSlider = document.querySelector(".about-team__slider").swiper;
    if (teamSlider) {
      teamSlider.destroy();
    }
  }
}

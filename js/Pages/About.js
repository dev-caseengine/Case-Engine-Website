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
    // this.pinSection();
    // this.aboutGallery();
    this.teamSlide();
    this.blueSection();
    // this.parallaxImages();

	this.moveImages();

  }


  moveImages() {

	const images = document.querySelectorAll('.about-gallery__img');
	images.forEach(image => {
		const depth = parseFloat(image.getAttribute('data-depth'));
		const movement = -(image.clientHeight * depth);
	  
		gsap.to(image, {
		  y: movement,
		  ease: "none",
		  scrollTrigger: {
			trigger: image,
			start: "top bottom",
			end: "bottom top",
			scrub: true,
		  }
		});
	  });

  }

  parallaxImages() {
    // Select all images with data-parallax attribute
    const images = document.querySelectorAll(
      ".about-gallery__img[data-parallax]"
    );

    // Get the tallest image height
    let maxHeight = 0;
    images.forEach((image) => {
      const height = image.offsetHeight;
      if (height > maxHeight) {
        maxHeight = height;
      }
    });

    // Set the height of the image container to the tallest image height
    const imgContainer = document.querySelector(".about-gallery__imgs");
    imgContainer.style.height = `${maxHeight}px`;

    // Loop through each image and create a ScrollTrigger animation
    images.forEach((image) => {
      gsap.to(image, {
        yPercent: -image.getAttribute("data-parallax") * 100,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-gallery__imgs",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
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

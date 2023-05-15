import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Swiper, {
  Autoplay,
  Pagination,
  Mousewheel,
  Navigation,
  EffectFade,
} from "swiper";
import Page from "../classes/Page";

export default class Home extends Page {
  constructor() {
    super({
      id: "home",
      element: ".home",
      elements: {
        results: ".results",
        blueSection: ".who-we-are",
        results_nav: ".results__nav span",
        results_headings: ".results__problem h2",
        results_text: ".results__problem p",
        results_result: ".results__result p",
        results_label_problem: ".results__label-problem p",
        results_label: ".results__label p",
        results_border: ".results__border",
        results_cursor: ".results__follow",
      },
    });

    gsap.registerPlugin(ScrollTrigger);
  }

  create() {
    super.create();
    this.initResults();
    this.eyeAnimation();
    this.pinSection();
    this.founders();
    // this.foundersSlider();
    this.whiteSection();
    this.clientSliderFirst();
    this.clientSliderSecond();
  }

  founders() {
    const wrapper = document.querySelector(".who-we-are__founders");
    const imageWrapper = document.querySelectorAll(
      ".who-we-are__founders__inner"
    );
    const foundersImgs = document.querySelectorAll(
      ".who-we-are__founders__img img"
    );

    const img = document.querySelector(".who-we-are__founders__img");
    const cursor = document.querySelector(".founders-cursor");

    const founderTl = gsap.timeline({ paused: true });

    founderTl.fromTo(
      img,
      { yPercent: 20, width: "50%" },
      { yPercent: 0, width: "100%", ease: "none" }
    );
    gsap.fromTo(
      [".who-we-are__founders__text h3", ".who-we-are__founders__text p"],
      { autoAlpha: 0, y: 20 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.03,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "30% 50%",
        },
      }
    );

    ScrollTrigger.create({
      trigger: wrapper,
      start: "top 90%",
      end: "90% bottom",
      animation: founderTl,
      scrub: true,
      once: true,
    });

    //Founders Slider

    let isImageUp = false;

    cursor.addEventListener("click", () => {
      imageWrapper.forEach((imageWrapper) => {
        if (isImageUp) {
          gsap.to(imageWrapper, {
            x: 0,
            duration: 1,
            ease: "Power3.out",
          });
          foundersImgs.forEach((foundersImg) => {
            gsap.to(foundersImg, {
              x: 0,
              duration: 2,
              ease: "Power2.out",
            });
          });
        } else {
          gsap.to(imageWrapper, {
            x: "-100%",
            duration: 1,
            ease: "Power3.out",
          });
          foundersImgs.forEach((foundersImg) => {
            gsap.to(foundersImg, {
              x: "-5%",
              duration: 2,
              ease: "Power2.out",
            });
          });
        }
      });
      isImageUp = !isImageUp; // toggle the state
    });




    //curor mouse ente
	
	gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    wrapper.addEventListener("mouseenter", () => {
      gsap.to(cursor, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.3,
        ease: "power3.out",
      });
    });

    wrapper.addEventListener("mouseleave", () => {
      gsap.to(cursor, {

        autoAlpha: 0,
        scale: 0,
        duration: 0.3,
        ease: "power3.out",
      });
    });

    //Mouse Follow
    this.pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.mouse = { x: this.pos.x, y: this.pos.y };
    this.speed = 0.2;

	this.xSet = gsap.quickSetter(cursor, "left", "px");
	this.ySet = gsap.quickSetter(cursor, "top", "px");




    wrapper.addEventListener("mousemove", (e) => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;

	  this.xSet(this.mouse.x);
	  this.ySet(this.mouse.y);

    });

    gsap.ticker.add(() => {
      this.pos.x += (this.mouse.x - this.pos.x) * this.speed;
      this.pos.y += (this.mouse.y - this.pos.y) * this.speed;

      this.xSet(this.pos.x);
      this.ySet(this.pos.y);
    });
  }

  //   foundersSlider() {
  //     // Get all the elements
  //     const bullets = document.querySelectorAll(".who-we-are__bulets span");
  //     const founders = document.querySelectorAll(".who-we-are__founders__inner");
  //     const activeBulletClass = "active-bullet";

  //     // Loop through the bullets and add click event listeners
  //     bullets.forEach((bullet, index) => {
  //       bullet.addEventListener("click", () => {
  //         // Remove the active class from all the bullets
  //         bullets.forEach((bullet) => {
  //           bullet.classList.remove(activeBulletClass);
  //         });

  //         // Add the active class to the selected bullet
  //         bullet.classList.add(activeBulletClass);

  //         // Remove the active class from all the founders
  //         founders.forEach((founder) => {
  //           founder.classList.remove("active-founder");
  //         });

  //         // Add the active class to the selected founder
  //         founders[index].classList.add("active-founder");

  //         // Use GSAP to add the fade transition
  //         gsap.fromTo(
  //           ".who-we-are__founders__inner",
  //           { opacity: 0, duration: 1 },
  //           { opacity: 1, duration: 1 }
  //         );
  //       });
  //     });
  //   }

  initResults() {
    const initTl = gsap.timeline({ paused: true });

    initTl.fromTo(
      this.elements.results_headings[0],
      { autoAlpha: "0", y: "100%" },
      { autoAlpha: "1", y: 0, duration: 1, ease: "Power2.out" },
      0
    );
    initTl.fromTo(
      this.elements.results_text[0],
      { autoAlpha: "0", y: "100%" },
      { autoAlpha: "1", y: 0, duration: 1, ease: "Power2.out" },
      0.2
    );

    // initTl.fromTo(
    //   this.elements.results_label_problem,
    //   { autoAlpha: "0", y: "100%" },
    //   { autoAlpha: "1", y: 0, duration: 1, ease: "Power2.out" },
    //   0.8
    // );

    initTl.fromTo(
      this.elements.results_result[0],
      { autoAlpha: "0", y: "100%" },
      { autoAlpha: "1", y: 0, duration: 1, ease: "Power2.out" },
      1
    );

    // initTl.fromTo(
    //   this.elements.results_label,
    //   { autoAlpha: "0", y: "100%" },
    //   { autoAlpha: "1", y: 0, duration: 1, ease: "Power2.out" },
    //   1
    // );
    initTl.fromTo(
      this.elements.results_nav,
      { autoAlpha: "0", y: 40 },
      { autoAlpha: "1", y: 0, duration: 1, ease: "Power2.out" },
      1
    );
    initTl.fromTo(
      this.elements.results_border,
      { scaleX: 0, y: 40 },
      { scaleX: 1, y: 0, duration: 1, ease: "Power2.out" },
      1
    );
    initTl.fromTo(
      this.elements.results_cursor,
      { autoAlpha: "0" },
      { autoAlpha: "1", duration: 1, ease: "Power2.out" },
      1.2
    );

    ScrollTrigger.create({
      trigger: ".result",
      start: "-20% top ",
      once: true,
      animation: initTl,
    });
  }

  modelAnimation() {
    this.scrollTl = gsap.timeline({ paused: true });
    this.scrollTl.to(this.handModel.rotation, { y: -Math.PI * 2 }, 0);
    this.scrollTl.to(this.handModel.children[3].material, { opacity: 0 }, 0);
    this.scrollTl.to(this.handModel.position, { x: 0.629 }, 0);
    this.scrollTl.to(this.handModel.children[4].material, { opacity: 1 }, 0);

    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      scrub: true,
      animation: this.scrollTl,
      id: "modelAnimation",
    });
  }

  pinSection() {
    const pinTl = gsap.timeline({ paused: true });
    pinTl.to(".results__overlay", { opacity: 1, delay: 1 });

    ScrollTrigger.create({
      trigger: ".results",
      invalidateOnRefresh: true,
      pin: true,
      start: "top top",
      end: "150%",
      scrub: true,
      pinSpacing: false,
      animation: pinTl,
      id: "pinSection",
    });
  }

  whiteSection() {
    this.whiteSections = document.querySelectorAll(".white-bg");
    this.whiteSections.forEach((section) => {
      this.whiteTl = gsap.timeline({ paused: true });
      this.whiteTl.to(".burger-btn *, .close-btn *", {
        background: "#000",
        duration: 0.3,
      });

      this.whiteTl.to(
        ".border-btn",
        {
          borderColor: "rgba(0,0,0,0.1)",
          color: "#000",
        },
        0
      );

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        toggleActions: "play reverse play reverse",
        animation: this.whiteTl,
        id: "whiteSection",
      });
    });
  }

  clientSliderFirst() {
    this.clientSldier = new Swiper(".client-slider", {
      modules: [Autoplay],
      slidesPerView: 2,
      spaceBetween: 30,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
      loop: true,
      speed: 6000,
      breakpoints: {
        920: {
          slidesPerView: 4,
          spaceBetween: 90,
        },
      },
    });
  }

  clientSliderSecond() {
    this.clientSldierSecond = new Swiper(".client-slider-bottom", {
      modules: [Autoplay],
      slidesPerView: 2,
      spaceBetween: 30,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
        reverseDirection: true,
      },
      loop: true,
      speed: 6000,
      breakpoints: {
        920: {
          slidesPerView: 4,
          spaceBetween: 90,
        },
      },
    });
  }

  eyeAnimation() {
    const lines = Array.from(document.querySelectorAll(".eye-line"));

    const paths = [
      "M202.613 311.917C249.802 132.884 345.572 66.2558 494.583 122.63C495.43 122.956 496.215 123.483 496.893 124.18C497.572 124.878 498.13 125.732 498.536 126.694C498.941 127.656 499.186 128.706 499.257 129.784C499.327 130.862 499.222 131.947 498.946 132.974C450.882 313.133 354.643 378.83 206.951 322.231C206.109 321.902 205.329 321.374 204.655 320.677C203.982 319.981 203.427 319.129 203.024 318.171C202.621 317.212 202.378 316.167 202.307 315.094C202.236 314.02 202.34 312.941 202.613 311.917Z",
      "M180.848 307.638C244.539 113.652 354.976 48.9005 516.52 125.468C517.442 125.896 518.285 126.546 518.998 127.377C519.712 128.209 520.281 129.207 520.672 130.311C521.064 131.415 521.27 132.603 521.279 133.806C521.287 135.008 521.098 136.201 520.723 137.313C455.959 332.485 345.129 396.186 185.038 319.513C184.119 319.075 183.281 318.419 182.571 317.582C181.862 316.746 181.296 315.747 180.906 314.642C180.516 313.537 180.311 312.349 180.301 311.147C180.291 309.945 180.477 308.752 180.848 307.638Z",
      "M157.001 300.837C239.942 91.8231 366.511 30.4342 540.663 130.527C541.651 131.098 542.536 131.901 543.268 132.89C544 133.88 544.563 135.036 544.927 136.292C545.29 137.548 545.445 138.879 545.384 140.209C545.323 141.539 545.046 142.84 544.57 144.039C460.359 354.224 333.47 414.412 160.895 314.304C159.913 313.732 159.033 312.929 158.306 311.943C157.579 310.956 157.018 309.805 156.656 308.554C156.295 307.303 156.139 305.978 156.198 304.653C156.257 303.329 156.53 302.032 157.001 300.837Z",
      "M131.009 291.033C236.245 67.2017 380.376 11.0973 567.098 138.484C568.156 139.213 569.085 140.188 569.832 141.356C570.579 142.523 571.13 143.859 571.451 145.286C571.773 146.714 571.86 148.204 571.707 149.673C571.555 151.141 571.165 152.558 570.561 153.843C463.859 378.8 319.371 433.599 134.46 306.332C133.409 305.604 132.485 304.63 131.743 303.467C131 302.304 130.453 300.974 130.133 299.554C129.812 298.133 129.725 296.649 129.875 295.187C130.026 293.725 130.411 292.314 131.009 291.033Z",
      "M102.812 277.732C233.694 39.5623 397.038 -9.02041 595.887 149.819C597.014 150.726 597.982 151.896 598.736 153.261C599.49 154.626 600.015 156.159 600.281 157.772C600.547 159.385 600.548 161.046 600.285 162.66C600.021 164.274 599.498 165.808 598.746 167.174C466.164 406.44 302.524 453.521 105.671 295.012C104.552 294.106 103.59 292.941 102.84 291.582C102.09 290.223 101.568 288.698 101.303 287.093C101.037 285.489 101.034 283.836 101.293 282.229C101.552 280.623 102.068 279.095 102.812 277.732Z",
      "M72.4207 260.316C232.634 8.69526 416.769 -29.7385 627.067 165.088C628.26 166.199 629.261 167.587 630.012 169.171C630.762 170.756 631.248 172.506 631.44 174.321C631.633 176.135 631.528 177.978 631.133 179.743C630.738 181.508 630.06 183.161 629.138 184.605C466.965 437.292 282.596 474.044 74.4787 279.758C73.2926 278.649 72.298 277.266 71.5522 275.687C70.8064 274.108 70.324 272.365 70.1328 270.558C69.9415 268.752 70.0451 266.917 70.4377 265.159C70.8304 263.402 71.5043 261.756 72.4207 260.316Z",
      "M39.8233 238.142C233.423 -25.6251 439.963 -50.8322 660.663 184.965C661.913 186.309 662.933 187.941 663.663 189.767C664.393 191.594 664.819 193.578 664.917 195.606C665.014 197.634 664.781 199.666 664.231 201.583C663.68 203.501 662.824 205.267 661.71 206.779C465.88 471.552 259.193 494.867 40.8709 259.866C38.3674 257.154 36.8505 253.342 36.6541 249.268C36.4576 245.194 37.5975 241.192 39.8233 238.142Z",
      "M5.16245 209.488C236.523 -64.5929 467.057 -73.0303 696.68 209.173C697.98 210.779 699.007 212.682 699.7 214.774C700.393 216.866 700.739 219.104 700.719 221.36C700.698 223.615 700.311 225.843 699.58 227.916C698.849 229.988 697.788 231.864 696.459 233.434C462.559 508.431 231.975 514.751 4.94055 233.674C3.65115 232.069 2.63408 230.169 1.94738 228.085C1.26069 226 0.917776 223.771 0.938376 221.525C0.958976 219.279 1.34267 217.06 2.06743 214.995C2.79219 212.929 3.84392 211.058 5.16245 209.488Z",
    ];

    const svgTl = gsap.timeline({ paused: true });

    lines.forEach((line, i) => {
      svgTl.to(
        line,
        {
          attr: { d: paths[i] },
          duration: 1,
          ease: "power2.out",
        },
        0.1 * i
      );
    });

    svgTl.to(
      ".eye-svg",
      {
        rotate: 45,
        duration: 1,
        ease: "power3.out",
      },
      0.5
    );

    svgTl.to(
      ".eye-circle",
      {
        ry: 21,
        duration: 1,
        ease: "power3.out",
      },
      0.8
    );

    svgTl.to(".eye-circle", {
      ry: 0,
      duration: 0.3,
      ease: "power3.out",
    });

    svgTl.to(".eye-circle", {
      ry: 21,
      duration: 0.8,
      ease: "power3.out",
    });

    ScrollTrigger.create({
      trigger: ".eye-svg",
      start: "top 50%",
      animation: svgTl,
      once: true,
    });
  }

  destroy() {
    super.destroy();
    // Kill the modelAnimation ScrollTrigger
    ScrollTrigger.getById("modelAnimation")?.kill();

    // Unpin the pinSection ScrollTrigger
    ScrollTrigger.getById("pinSection")?.disable();
    // Remove the blueSection ScrollTrigger
    ScrollTrigger.getById("whiteSection")?.kill();
    // Destroy the clientsSlider Swiper instance
    // Destroy the Swiper instance
    if (this.clientSldier) {
      this.clientSldier.destroy();
    }
    if (this.clientSldierSecond) {
      this.clientSldierSecond.destroy();
    }

    // Reset the logo color to its default value
    gsap.set(".burger-btn *, .close-btn *", { background: "#fff" });
    gsap.set(".border-btn, .close-btn *", {
      borderColor: "rgba(255,255,255,0.1)",
      color: "#fff",
    });
  }
}

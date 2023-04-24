import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Component from "../classes/Component";
import Page from "../classes/Page";

export default class Navigation extends Page {
  constructor() {
    super({
      element: ".header",
      elements: {
        body: ".body",
        logo: ".header__logo",
        logoText: ".logo-text",
        blueSection: ".blue-section",
        burgerBtn: ".burger-btn",
        burgerBtnLine1: ".burger-btn__line1",
        burgerBtnLine2: ".burger-btn__line2",
        menu: ".header__menu",
        menuLinks: ".header__menu__links a ",
        menuText: ".header__menu__links p ",
        menuSocial: ".header__menu__social *",
        closeMenu: ".close-btn",
        closeMenuLine1: ".close-btn .line-1",
        closeMenuLine2: ".close-btn .line-2",
      },
    });
    gsap.registerPlugin(ScrollTrigger);
  }

  create() {
    super.create();
    this.initHeader();
    this.initMenu();
  }

  initHeader() {
    ScrollTrigger.create({
      start: "100",
      id: "header",
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

  initMenu() {
    this.mql = window.matchMedia("(max-width: 600px)");

    // Burger btn click
    this.elements.burgerBtn.addEventListener("click", () => {
      if (!this.elements.menu.classList.contains("--active")) {
        this.elements.menu.classList.add("--active");

        if (this.mql.matches) {
          this.element.classList.add("--active");
        }

        this.showMenuAnimation();
      }
    });

    // Link item click
    this.elements.menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (this.elements.menu.classList.contains("--active")) {
        //   this.elements.menu.classList.remove("--active");
          this.hideMenuAnimation();

          if (this.mql.matches) {
            this.element.classList.remove("--active");
          }
        }
      });
    });

    // Add event listener to close the menu when clicking outside of it
    document.addEventListener("click", (event) => {
      const isClickInsideMenu = this.elements.menu.contains(event.target);
      const isClickOnBurgerBtn =
        event.target.closest(".burger-btn") === this.elements.burgerBtn;
      if (
        !isClickInsideMenu &&
        !isClickOnBurgerBtn &&
        this.elements.menu.classList.contains("--active")
      ) {
        this.hideMenuAnimation();
        if (this.mql.matches) {
          this.element.classList.remove("--active");
        }
      }
    });

    //Close menu on close button click

    this.elements.closeMenu.addEventListener("click", () => {
      if (this.elements.menu.classList.contains("--active")) {
        this.hideMenuAnimation();

        if (this.mql.matches) {
          this.element.classList.remove("--active");
        }
      }
    });
  }

  showMenuAnimation() {
    this.isAnimating = true;
    this.showTl = gsap.timeline();

    this.showTl.to(this.elements.burgerBtnLine1, { y: 5, duration: 0.1 });
    this.showTl.to(this.elements.burgerBtnLine2, { y: -5, duration: 0.1 }, 0);

    this.showTl.to(
      this.elements.burgerBtnLine1,
      { scaleX: 0, transformOrigin: "right", duration: 0.1 },
      0.3
    );
    this.showTl.to(
      this.elements.burgerBtnLine2,
      { scaleX: 0, transformOrigin: "left", duration: 0.1 },
      0.3
    );

    this.showTl.to(this.elements.burgerBtn, { display: "none" });
    this.showTl.to(this.elements.closeMenu, { display: "block" });

    this.showTl.fromTo(
      this.elements.closeMenuLine1,
      { scaleX: 0, rotate: 0 },
      { scaleX: 1, rotate: 45, duration: 0.5 },
      0.8
    );
    this.showTl.fromTo(
      this.elements.closeMenuLine2,
      { scaleX: 0, rotate: 0 },
      { scaleX: 1, rotate: -45, duration: 0.5 },
      0.8
    );

    this.showTl.fromTo(
      this.elements.menu,
      { autoAlpha: 0, scale: 0.5 },
      { autoAlpha: 1, scale: 1, duration: 0.8, ease: "power4.out" },
      0.2
    );

    this.showTl.fromTo(
      this.elements.menuText,
      { autoAlpha: 0, yPercent: 100 },
      {
        autoAlpha: 1,
        yPercent: 0,
        stagger: 0.05,
        duration: 1,
        ease: "power4.out",
      },
      0.4
    );

    this.showTl.fromTo(
      this.elements.menuSocial,
      { autoAlpha: 0, yPercent: 50 },
      {
        autoAlpha: 1,
        yPercent: 0,
        stagger: 0.05,
        duration: 0.5,
        ease: "power4.out",
      },
      0.6
    );
  }

  hideMenuAnimation() {
    this.hideTl = gsap.timeline({
      onComplete: () => {
        this.elements.menu.classList.remove("--active");
      },
    });

    this.hideTl.fromTo(
      this.elements.closeMenuLine1,
      { scaleX: 1, rotate: 45 },
      { scaleX: 0, rotate: 0, duration: 0.5 }
    );
    this.hideTl.fromTo(
      this.elements.closeMenuLine2,
      { scaleX: 1, rotate: -45 },
      { scaleX: 0, rotate: 0, duration: 0.5 },
      0
    );

    this.hideTl.fromTo(
      this.elements.menu,
      { autoAlpha: 1, scale: 1 },
      { autoAlpha: 0, scale: 0.4, duration: 0.4, ease: "power4.out" },
      0
    );

    this.hideTl.set(this.elements.closeMenu, { display: "none" });
    this.hideTl.set(this.elements.burgerBtn, { display: "block" });

    this.hideTl.to(this.elements.burgerBtnLine1, {
      scaleX: 1,
      transformOrigin: "right",
      duration: 0.1,
    });
    this.hideTl.to(
      this.elements.burgerBtnLine2,
      {
        scaleX: 1,
        transformOrigin: "left",
        duration: 0.1,
      },
      0.5
    );

    this.hideTl.to(this.elements.burgerBtnLine1, { y: 0, duration: 0.1 }, 0.7);
    this.hideTl.to(this.elements.burgerBtnLine2, { y: 0, duration: 0.1 }, 0.7);
  }

  destroy() {
    super.destroy();

    gsap.set(this.elements.logoText, { autoAlpha: 1, y: 0 });
    ScrollTrigger.getById("header").kill();
  }
}

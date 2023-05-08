import Page from "../classes/Page";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default class Contact extends Page {
  constructor() {
    super({
      id: "contact",
      element: ".contact",
      elements: {
        title: ".contact-hero__title",
        text: ".contact-hero__title h1 span",
        steps: ".contact-hero__steps",
        stepBtn: ".step__btn",
        backStepBtn: ".step-back button",
      },
    });
    gsap.registerPlugin(ScrollTrigger);
  }

  create() {
    super.create();
    this.titleAnim();
  }

  titleAnim() {
    this.titleTl = gsap.timeline({
      delay: 4.5,
      onComplete: () => {
        gsap.set(this.elements.title, { display: "none" });
        this.setupSteps();
      },
    });

    this.titleTl.fromTo(
      this.elements.text,
      { yPercent: 0 },
      { yPercent: -100, duration: 1, stagger: 0.1, ease: "power2.out" }
    );
  }

  setupSteps() {
    gsap.set(this.elements.steps, { display: "flex" });

    // first, get all the elements we'll need
    const steps = document.querySelectorAll(".step");
    const buttons = document.querySelectorAll(".step__btn");
    const backButton = document.querySelectorAll(".step-back");

    // add the 'active' class to the first step
    steps[0].classList.add("active-step");

    // initialize the timeline
    const timeline = gsap.timeline();

    // loop through each button
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        // get the current step and the next step
        const currentStep = button.closest(".step");
        const nextStep = currentStep.nextElementSibling;

        // add animations to hide the current step and show the next step

        const titleCurrent = currentStep.querySelector(".step__title h2");
        const titleNext = nextStep.querySelector(".step__title h2");

        const buttonsCurrent = currentStep.querySelectorAll(".step__form ");
        const buttonsNext = nextStep.querySelectorAll(".step__form ");

        timeline.to(currentStep, { display: "none" });
        timeline.to(nextStep, { display: "flex" });
      });
    });

    // add event listener to the back button
    backButton.forEach((button) => {
      button.addEventListener("click", () => {
        // get the current step and the previous step
        const currentStep = button.closest(".step");
        const previousStep = currentStep.previousElementSibling;

        const titleCurrent = currentStep.querySelector(".step__title h2");
        const buttonsCurrent = currentStep.querySelectorAll(".step__form ");

        const titlePrevious = previousStep.querySelector(".step__title h2");
        const buttonsPrevious = previousStep.querySelectorAll(".step__form ");

        // add animations to hide the current step and show the previous step

        timeline.to(currentStep, { display: "none" });
        timeline.to(previousStep, { display: "flex" });
      });
    });

    // add event listener to the continue button
    const inputField = document.querySelector(".step__form__input input");
    const continueButton = document.querySelector(
      '.step[data-step="3"] .step__form__continue'
    );

    // Hide the continue button by default
    continueButton.style.display = "none";

    // Add an event listener to the input field
    inputField.addEventListener("input", () => {
      // Check if the input field is empty
      if (inputField.value.trim() === "") {
        // If it is empty, hide the continue button
        continueButton.style.display = "none";
      } else {
        // Otherwise, show the continue button
        continueButton.style.display = "flex";
      }
    });

    continueButton.addEventListener("click", () => {
      const currentStep = continueButton.closest(".step");
      const nextStep = currentStep.nextElementSibling;

      // only proceed to next step if the continue button was clicked in step 3
      if (currentStep.dataset.step === "3") {
        timeline.to(currentStep, { display: "none" });
        timeline.to(nextStep, { display: "flex" });
      }
    });
  }
}

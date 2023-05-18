import Page from "../classes/Page";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import jQuery from "jquery";
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
    this.form();
    this.hideFormBtn();
  }

  show() {
    super.show();
    this.titleAnim();
  }

  form() {
    jQuery(".contact-hero__steps").on("submit", function (e) {
      var form = jQuery(this).serialize();

      e.preventDefault();
      jQuery.ajax({
        url: "/sendMail.php",
        data: form,
        type: "POST",
        success: function (data) {
          var res = JSON.parse(JSON.stringify(data));
          jQuery(".button-send-mail").hide();
          jQuery(".mail-response").html(res.message).show();
        },
      });
    });
  }

  titleAnim() {
    this.titleTl = gsap.timeline({
      onComplete: () => {
        gsap.set(this.elements.title, { display: "none" });
        this.setupSteps();
      },
    });

    this.titleTl.fromTo(
      this.elements.text,
      { yPercent: 100 },
      { yPercent: 0, duration: 1, stagger: 0.1, ease: "power2.out", delay: 1 }
    );

    this.titleTl.to(this.elements.text, {
      yPercent: -100,
      duration: 1,
      stagger: 0.1,
      ease: "power2.out",
      delay: 1.5,
    });
  }

  setupSteps() {
    gsap.set(this.elements.steps, { display: "flex" });

    // first, get all the elements we'll need
    const steps = document.querySelectorAll(".step");
    const buttons = document.querySelectorAll(".step__btn");
    const backButton = document.querySelectorAll(".step-back");
    const progress = document.querySelector(".contact-progress span");

    // gsap.to(progress, {scaleX: 1 / 8, duration: 1, ease: "power2.out"});

    if (steps[0] != null) {
      steps[0].style.display = "flex";

      // initialize the timeline
      gsap.fromTo(
        ".step__title h2",
        { yPercent: 100 },
        { yPercent: 0, duration: 1, ease: "power2.out" }
      );

      gsap.fromTo(
        ".step__btn",
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 1,
          stagger: 0.03,
          ease: "power2.out",
          delay: 0.5,
        }
      );
    }

    // loop through each button
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const tlNext = gsap.timeline();
        // get the current step and the next step
        const currentStep = button.closest(".step");
        const nextStep = currentStep.nextElementSibling;

        // add animations to hide the current step and show the next step

        const titleCurrent = currentStep.querySelector(".step__title h2");
        const buttonsCurrent = currentStep.querySelectorAll(".step__form *");

        const titleNext = nextStep.querySelector(".step__title h2");
        const buttonsNext = nextStep.querySelectorAll(".step__form * ");

        const totalSteps = document.querySelectorAll(".step").length;
        const progressPercentage =
          (1 / (totalSteps - 1)) * currentStep.dataset.step;

        gsap.to(progress, {
          scaleX: progressPercentage,
          duration: 1,
          ease: "power2.out",
        });

        tlNext.to(titleCurrent, {
          yPercent: -100,
          duration: 1,
          ease: "power2.out",
        });
        tlNext.to(
          buttonsCurrent,
          {
            autoAlpha: 0,
            duration: 1,
            stagger: 0.03,
            ease: "power2.out",
          },
          0
        );

        tlNext.set(currentStep, { display: "none" });
        tlNext.set(nextStep, { display: "flex" });

        tlNext.fromTo(
          titleNext,
          { yPercent: 100 },
          { yPercent: 0, duration: 1, ease: "power2.out" }
        );

        tlNext.fromTo(
          buttonsNext,
          {
            autoAlpha: 0,
          },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 1,
            stagger: 0.03,
            ease: "power2.out",
          },
          1.5
        );
      });
    });

    // add event listener to the back button
    backButton.forEach((button) => {
      button.addEventListener("click", () => {
        const tlBack = gsap.timeline();
        // get the current step and the previous step
        const currentStep = button.closest(".step");
        const previousStep = currentStep.previousElementSibling;

        const titleCurrent = currentStep.querySelector(".step__title h2");
        const buttonsCurrent = currentStep.querySelectorAll(".step__form *");

        const titlePrevious = previousStep.querySelector(".step__title h2");
        const buttonsPrevious = previousStep.querySelectorAll(".step__form *");

        const totalSteps = document.querySelectorAll(".step").length;

        const progressPercentage =
          (1 / (totalSteps - 1)) * (previousStep.dataset.step - 1);

        gsap.to(progress, {
          scaleX: progressPercentage,
          duration: 1,
          ease: "power2.out",
        });

        // add animations to hide the current step and show the previous step

        tlBack.to(titleCurrent, {
          yPercent: 100,
          duration: 1,
          ease: "power2.out",
        });

        tlBack.to(
          buttonsCurrent,
          {
            autoAlpha: 0,
            stagger: 0.03,
            duration: 1,
            ease: "power2.out",
          },
          0
        );

        tlBack.set(currentStep, { display: "none" });
        tlBack.set(previousStep, { display: "flex" });

        tlBack.to(titlePrevious, {
          yPercent: 0,
          duration: 1,
          ease: "power2.out",
        });

        tlBack.to(
          buttonsPrevious,
          {
            autoAlpha: 1,
            duration: 1,
            stagger: 0.03,
            ease: "power2.out",
          },
          1.5
        );
      });
    });

    // add event listener to the continue button
    const inputField = document.querySelector('.step[data-step="3"] input');
    const continueButton = document.querySelector(
      '.step[data-step="3"] .step__form__continue p'
    );

    // Hide the continue button by default
    if (continueButton != null) {
      continueButton.style.display = "none";
    }

	if (inputField != null) {
		// Add an event listener to the input field
		inputField.addEventListener("input", () => {
		  // Get the input value and remove leading/trailing whitespace
		  const inputValue = inputField.value.trim();
		  // Check if the input field has more than 3 characters and contains only letters
		  if (inputValue.length >= 3 && /^[A-Za-z]+$/.test(inputValue)) {
			// If it meets the conditions, show the continue button
			continueButton.style.display = "flex";
		  } else {
			// Otherwise, hide the continue button
			continueButton.style.display = "none";
		  }
		});
	  }

    if (continueButton != null) {
      continueButton.addEventListener("click", () => {
        const currentStep = continueButton.closest(".step");
        const nextStep = currentStep.nextElementSibling;
        const titleCurrent = currentStep.querySelector(".step__title h2");

        const buttonsCurrent = currentStep.querySelectorAll(".step__form *");

        const titleNext = nextStep.querySelector(".step__title h2");

        const buttonsNext = nextStep.querySelectorAll(".step__form *");

        const continueTl = gsap.timeline();

        const totalSteps = document.querySelectorAll(".step").length;
        const progressPercentage =
          (1 / (totalSteps - 1)) * currentStep.dataset.step;

        gsap.to(progress, {
          scaleX: progressPercentage,
          duration: 1,
          ease: "power2.out",
        });

        // only proceed to next step if the continue button was clicked in step 3
        if (currentStep.dataset.step === "3") {
          continueTl.to(titleCurrent, {
            yPercent: -100,
            duration: 1,
            ease: "power2.out",
          });

          continueTl.to(
            buttonsCurrent,
            {
              autoAlpha: 0,
              duration: 1,
              stagger: 0.03,
              ease: "power2.out",
            },
            0
          );

          continueTl.set(currentStep, { display: "none" });
          continueTl.set(nextStep, { display: "flex" });

          continueTl.fromTo(
            titleNext,
            { yPercent: 100 },
            { yPercent: 0, duration: 1, ease: "power2.out" }
          );

          continueTl.fromTo(
            buttonsNext,
            {
              autoAlpha: 0,
            },
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: 1,
              stagger: 0.03,
              ease: "power2.out",
            },
            1.5
          );
        }
      });
    }
  }

  hideFormBtn() {
    const firstNameInput = document.querySelector(
      '.step[data-step="8"] input[type="text"]'
    );
    const emailInput = document.querySelector(
      '.step[data-step="8"] input[type="email"]'
    );
    const phoneInput = document.querySelector(
      '.step[data-step="8"] input[type="number"]'
    );
    const submitButton = document.querySelector('.step[data-step="8"] .button');

    // hide submit button initially
    submitButton.style.display = "none";

    // function to show submit button if all fields are filled
	const showSubmitButton = () => {
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	  
		if (
		  firstNameInput.value &&
		  emailPattern.test(emailInput.value) &&
		  phoneInput.value
		) {
		  submitButton.style.display = "flex";
		} else {
		  submitButton.style.display = "none";
		}
	  };

    // add event listeners to input fields
    firstNameInput.addEventListener("input", showSubmitButton);
    emailInput.addEventListener("input", showSubmitButton);
    phoneInput.addEventListener("input", showSubmitButton);
  }
}

import { handleFormSubmit, setupSubmitButtonVisibility } from "../utils/contactHelpers";
import Page from "../classes/Page";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import jQuery from "jquery";
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
	handleFormSubmit();
    setupSubmitButtonVisibility();

  }

  show() {
    super.show();
    this.titleAnim();
  }

  form() {
    document
      .querySelector(".contact-hero__steps")
      .addEventListener("submit", function (e) {
        e.preventDefault();

        const form = new FormData(this);
        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          "https://caseengine.com/wp-json/api/v1/sendMail",
          true
        );
        document.querySelector(".button-send-mail").style.display = "none";

        xhr.onload = function () {
          if (xhr.status === 200) {
            var res = JSON.parse(xhr.responseText);
            if (res.status) {
                const currentPath = window.location.pathname;

				if (currentPath.includes("/contact-meta")) {
					window.location.href = "/thank-you-meta";
				  } else {
					window.location.href = "/thank-you";
				  }
            } else {
              // Fallback error if form didn't process correctly
              document.querySelector(".mail-response").innerHTML =
                res.message || "Something went wrong.";
              document.querySelector(".mail-response").style.display = "block";
            }

          }
        };

        xhr.send(form);
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

    this.titleTl.to(
      ".contact-hero__top",
      {
        yPercent: -100,
        duration: 1,
        opacity: 0,
        ease: "power2.out",
      },
      "<"
    );
  }

  setupSteps() {
    const step7 = document.querySelector(
      '.contact-hero__steps .step[data-step="7"]'
    );
    const step8 = document.querySelector(
      '.contact-hero__steps .step[data-step="8"]'
    );
    const nextButton = step7.querySelector(".step__form__next .button");
    const backButton = step8.querySelector(".step-back");
    const lawFirmNameInput = document.getElementById("law-firm-name");
    const lawFirmWebInput = document.getElementById("law-firm-web");
    const inputs7 = step7.querySelectorAll(".step__form__input");
    const inputs8 = step8.querySelectorAll(".step__form__input");

    gsap.set(this.elements.steps, { display: "flex" });
    step7.style.display = "flex";

    // gsap.to(
    // 	".calender-iframe",
    // 	{ opacity:1,duration: 1.5, ease: "power2.out", delay: 1, }
    //   );

    gsap.fromTo(
      ".step__title h2",
      { yPercent: 100, delay: 1 },
      { yPercent: 0, duration: 1, ease: "power2.out" }
    );

    gsap.fromTo(
      ".step__form__input",
      { yPercent: 20, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 1, ease: "power2.out" }
    );

    // Function to animate step transition
    function animateStep(fromStep, toStep, fromInputs, toInputs, forward) {
      // Animate out current step elements
      gsap.to(fromStep.querySelector(".step__title h2"), {
        yPercent: -100,
        duration: 1,
        ease: "power2.out",
      });
      gsap.to(fromInputs, { autoAlpha: 0, duration: 1, ease: "power2.out" });

      if (forward) {
        // Animate out the next button only when going forward
        gsap.to(nextButton, { autoAlpha: 0, duration: 1, ease: "power2.out" });
      }

      // Wait for the first part of the animation to complete
      gsap.to(
        {},
        {
          duration: 1,
          onComplete: () => {
            fromStep.style.display = "none";
            toStep.style.display = "flex";

            // Animate in next step
            gsap.fromTo(
              toStep.querySelector(".step__title h2"),
              { yPercent: 100 },
              { yPercent: 0, duration: 1, ease: "power2.out" }
            );
            gsap.fromTo(
              toInputs,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 1, ease: "power2.out", delay: 0.5 }
            );

            if (!forward) {
              // Ensure the next button fades in after the title and inputs when going backward
              gsap.fromTo(
                nextButton,
                { autoAlpha: 0 },
                { autoAlpha: 1, duration: 1, ease: "power2.out", delay: 1.5 }
              );
            }
          },
        }
      );
    }

    // Function to check if both inputs are filled
    const checkInputs = () => {
      return (
        lawFirmNameInput.value.trim() !== "" &&
        lawFirmWebInput.value.trim() !== ""
      );
    };

    gsap.set(nextButton, { display: "block" });
    gsap.fromTo(
      nextButton,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        delay: 1,
      }
    );

    // nextButton.style.display = "block";

    // Event listeners for inputs
    // lawFirmNameInput.addEventListener("input", () => {
    //   nextButton.style.display = checkInputs() ? "block" : "none";
    // });

    // lawFirmWebInput.addEventListener("input", () => {
    //   nextButton.style.display = checkInputs() ? "block" : "none";
    // });

    // Show step 8 and hide step 7
    nextButton.addEventListener("click", () => {
      animateStep(step7, step8, inputs7, inputs8, true);
    });

    // Show step 7 and hide step 8
    backButton.addEventListener("click", () => {
      animateStep(step8, step7, inputs8, inputs7, false);
    });
  }

  //   setupSteps() {
  //     gsap.set(this.elements.steps, { display: "flex" });

  //     // first, get all the elements we'll need
  //     const steps = document.querySelectorAll(".step");
  //     const buttons = document.querySelectorAll(".step__btn");
  //     const backButton = document.querySelectorAll(".step-back");
  //     // const progress = document.querySelector(".contact-progress span");

  //     // gsap.to(progress, {scaleX: 1 / 8, duration: 1, ease: "power2.out"});

  //     if (steps[0] != null) {
  //       steps[0].style.display = "flex";

  //       // initialize the timeline
  //       gsap.fromTo(
  //         ".step__title h2",
  //         { yPercent: 100 },
  //         { yPercent: 0, duration: 1, ease: "power2.out" }
  //       );

  //       gsap.fromTo(
  //         ".step__btn",
  //         { yPercent: 100 },
  //         {
  //           yPercent: 0,
  //           duration: 1,
  //           stagger: 0.03,
  //           ease: "power2.out",
  //           delay: 0.5,
  //         }
  //       );
  //     }

  //     // loop through each button
  //     buttons.forEach((button) => {
  //       button.addEventListener("click", () => {
  //         const tlNext = gsap.timeline();
  //         // get the current step and the next step
  //         const currentStep = button.closest(".step");
  //         const nextStep = currentStep.nextElementSibling;

  //         // add animations to hide the current step and show the next step

  //         const titleCurrent = currentStep.querySelector(".step__title h2");
  //         const buttonsCurrent = currentStep.querySelectorAll(".step__form *");

  //         const titleNext = nextStep.querySelector(".step__title h2");
  //         const buttonsNext = nextStep.querySelectorAll(".step__form * ");

  //         const totalSteps = document.querySelectorAll(".step").length;
  //         const progressPercentage =
  //           (1 / (totalSteps - 1)) * currentStep.dataset.step;

  //         // gsap.to(progress, {
  //         //   scaleX: progressPercentage,
  //         //   duration: 1,
  //         //   ease: "power2.out",
  //         // });

  //         tlNext.to(titleCurrent, {
  //           yPercent: -100,
  //           duration: 1,
  //           ease: "power2.out",
  //         });
  //         tlNext.to(
  //           buttonsCurrent,
  //           {
  //             autoAlpha: 0,
  //             duration: 1,
  //             stagger: 0.03,
  //             ease: "power2.out",
  //           },
  //           0
  //         );

  //         tlNext.set(currentStep, { display: "none" });
  //         tlNext.set(nextStep, { display: "flex" });

  //         tlNext.fromTo(
  //           titleNext,
  //           { yPercent: 100 },
  //           { yPercent: 0, duration: 1, ease: "power2.out" }
  //         );

  //         tlNext.fromTo(
  //           buttonsNext,
  //           {
  //             autoAlpha: 0,
  //           },
  //           {
  //             yPercent: 0,
  //             autoAlpha: 1,
  //             duration: 1,
  //             stagger: 0.03,
  //             ease: "power2.out",
  //           },
  //           1.5
  //         );
  //       });
  //     });

  //     // add event listener to the back button
  //     backButton.forEach((button) => {
  //       button.addEventListener("click", () => {
  //         const tlBack = gsap.timeline();
  //         // get the current step and the previous step
  //         const currentStep = button.closest(".step");
  //         const previousStep = currentStep.previousElementSibling;

  //         const titleCurrent = currentStep.querySelector(".step__title h2");
  //         const buttonsCurrent = currentStep.querySelectorAll(".step__form *");

  //         const titlePrevious = previousStep.querySelector(".step__title h2");
  //         const buttonsPrevious = previousStep.querySelectorAll(".step__form *");

  //         const totalSteps = document.querySelectorAll(".step").length;

  //         const progressPercentage =
  //           (1 / (totalSteps - 1)) * (previousStep.dataset.step - 1);

  //         // gsap.to(progress, {
  //         //   scaleX: progressPercentage,
  //         //   duration: 1,
  //         //   ease: "power2.out",
  //         // });

  //         // add animations to hide the current step and show the previous step

  //         tlBack.to(titleCurrent, {
  //           yPercent: 100,
  //           duration: 1,
  //           ease: "power2.out",
  //         });

  //         tlBack.to(
  //           buttonsCurrent,
  //           {
  //             autoAlpha: 0,
  //             stagger: 0.03,
  //             duration: 1,
  //             ease: "power2.out",
  //           },
  //           0
  //         );

  //         tlBack.set(currentStep, { display: "none" });
  //         tlBack.set(previousStep, { display: "flex" });

  //         tlBack.to(titlePrevious, {
  //           yPercent: 0,
  //           duration: 1,
  //           ease: "power2.out",
  //         });

  //         tlBack.to(
  //           buttonsPrevious,
  //           {
  //             autoAlpha: 1,
  //             duration: 1,
  //             stagger: 0.03,
  //             ease: "power2.out",
  //           },
  //           1.5
  //         );
  //       });
  //     });

  //     // add event listener to the continue button
  //     const inputField = document.querySelector('.step[data-step="3"] input');
  //     const continueButton = document.querySelector(
  //       '.step[data-step="3"] .step__form__continue p'
  //     );

  //     // Hide the continue button by default
  //     if (continueButton != null) {
  //       continueButton.style.display = "none";
  //     }

  // 	if (inputField != null) {
  // 		// Add an event listener to the input field
  // 		inputField.addEventListener("input", () => {
  // 		  // Get the input value and remove leading/trailing whitespace
  // 		  const inputValue = inputField.value.trim();
  // 		  // Check if the input field has more than 3 characters and contains only letters
  // 		  if (inputValue.length >= 3 && /^[A-Za-z]+$/.test(inputValue)) {
  // 			// If it meets the conditions, show the continue button
  // 			continueButton.style.display = "flex";
  // 		  } else {
  // 			// Otherwise, hide the continue button
  // 			continueButton.style.display = "none";
  // 		  }
  // 		});
  // 	  }

  //     if (continueButton != null) {
  //       continueButton.addEventListener("click", () => {
  //         const currentStep = continueButton.closest(".step");
  //         const nextStep = currentStep.nextElementSibling;
  //         const titleCurrent = currentStep.querySelector(".step__title h2");

  //         const buttonsCurrent = currentStep.querySelectorAll(".step__form *");

  //         const titleNext = nextStep.querySelector(".step__title h2");

  //         const buttonsNext = nextStep.querySelectorAll(".step__form *");

  //         const continueTl = gsap.timeline();

  //         const totalSteps = document.querySelectorAll(".step").length;
  //         const progressPercentage =
  //           (1 / (totalSteps - 1)) * currentStep.dataset.step;

  //         gsap.to(progress, {
  //           scaleX: progressPercentage,
  //           duration: 1,
  //           ease: "power2.out",
  //         });

  //         // only proceed to next step if the continue button was clicked in step 3
  //         if (currentStep.dataset.step === "3") {
  //           continueTl.to(titleCurrent, {
  //             yPercent: -100,
  //             duration: 1,
  //             ease: "power2.out",
  //           });

  //           continueTl.to(
  //             buttonsCurrent,
  //             {
  //               autoAlpha: 0,
  //               duration: 1,
  //               stagger: 0.03,
  //               ease: "power2.out",
  //             },
  //             0
  //           );

  //           continueTl.set(currentStep, { display: "none" });
  //           continueTl.set(nextStep, { display: "flex" });

  //           continueTl.fromTo(
  //             titleNext,
  //             { yPercent: 100 },
  //             { yPercent: 0, duration: 1, ease: "power2.out" }
  //           );

  //           continueTl.fromTo(
  //             buttonsNext,
  //             {
  //               autoAlpha: 0,
  //             },
  //             {
  //               yPercent: 0,
  //               autoAlpha: 1,
  //               duration: 1,
  //               stagger: 0.03,
  //               ease: "power2.out",
  //             },
  //             1.5
  //           );
  //         }
  //       });
  //     }
  //   }


 

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

export function handleFormSubmit() {
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
			  window.location.href = currentPath.includes("/contact-meta")
				? "/thank-you-meta"
				: "/thank-you";
			} else {
			  document.querySelector(".mail-response").innerHTML =
				res.message || "Something went wrong.";
			  document.querySelector(".mail-response").style.display = "block";
			}
		  }
		};
  
		xhr.send(form);
	  });
  }
  
  export function setupSubmitButtonVisibility() {
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
  
	submitButton.style.display = "none";
  
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
  
	firstNameInput.addEventListener("input", showSubmitButton);
	emailInput.addEventListener("input", showSubmitButton);
	phoneInput.addEventListener("input", showSubmitButton);
  }
  
import Page from "../classes/Page";
import { handleFormSubmit, setupSubmitButtonVisibility } from "../utils/contactHelpers";

export default class ContactMeta extends Page {
  constructor() {
	super({
		id: "contactMeta",
		element: ".contact-meta",
	});



  }


  create() {
    super.create();
	this.hideShowCalendar();
	handleFormSubmit();
    setupSubmitButtonVisibility();
	this.dragSlider();
  }

  onResize() {
    super.onResize();
  }

  destroy() {
    super.destroy();
  }


  hideShowCalendar() {
	const calendar = document.querySelector(".contact-meta__calendar");
    const form = document.querySelector(".form-meta");
    const sendMessageBtn = document.querySelector(".send-message-meta");
    const bookMeetingBtn = document.querySelector(".book-a-meeting-btn");
	const formStep = document.querySelector(".form-meta .step");

	sendMessageBtn.addEventListener("click", () => {
		calendar.style.display = "none";
		form.style.display = "flex";
		formStep.style.display = "flex";
	  });
  
	  // Show calendar, hide form
	  bookMeetingBtn.addEventListener("click", () => {
		form.style.display = "none";
		formStep.style.display = "none";
		calendar.style.display = "flex";
		
	  });
  }

  dragSlider() {
	// Select all drag-container elements
	const dragContainers = document.querySelectorAll('.drag-container');
  
	// Loop through each drag container
	dragContainers.forEach((container) => {
	  const dragHandle = container.querySelector('.drag-handle');
	  const afterImage = container.querySelector('.after-image');
  
	  if (!container || !dragHandle || !afterImage) {
		return; // Skip if any required element is missing
	  }
  
	  let isDragging = false;
  
	  // Add event listeners for mouse and touch events
	  dragHandle.addEventListener("mousedown", () => {
		isDragging = true;
	  });
  
	  dragHandle.addEventListener("touchstart", (e) => {
		isDragging = true;
		e.preventDefault(); // Prevent touch scrolling when starting drag
	  });
  
	  container.addEventListener("mousemove", (e) => {
		if (!isDragging) return;
  
		const rect = container.getBoundingClientRect();
		let offsetX = e.clientX - rect.left;
  
		if (offsetX < 0) offsetX = 0;
		if (offsetX > rect.width) offsetX = rect.width;
  
		dragHandle.style.left = offsetX + "px";
		afterImage.style.clipPath = `inset(0 ${rect.width - offsetX}px 0 0)`;
	  });
  
	  container.addEventListener("touchmove", (e) => {
		if (!isDragging) return;
		e.preventDefault();
  
		const rect = container.getBoundingClientRect();
		let offsetX = e.touches[0].clientX - rect.left;
  
		if (offsetX < 0) offsetX = 0;
		if (offsetX > rect.width) offsetX = rect.width;
  
		dragHandle.style.left = offsetX + "px";
		afterImage.style.clipPath = `inset(0 ${rect.width - offsetX}px 0 0)`;
	  });
  
	  // Add global event listeners to stop dragging
	  window.addEventListener("mouseup", () => {
		isDragging = false;
	  });
  
	  window.addEventListener("touchend", () => {
		isDragging = false;
	  });
	});
  }

}

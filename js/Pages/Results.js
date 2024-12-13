import Page from "../classes/Page";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default class Results extends Page {
  constructor() {
    super({
      id: "resultsPage",
      element: ".resuts-page",
      elements: {
        tabs: ".tab",
        contents: ".tab-content",
        canvas: "canvas",
        sliderInner: ".results-slider__inner",
        slides: ".results-slider__slide",
        prevBtn: ".results-slider__prev",
        nextBtn: ".results-slider__next",
        dragHandle: ".drag-handle",
        afterImage: ".after-image",
       
      },
    });
    gsap.registerPlugin(ScrollTrigger);
    this.isDragging = false;


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
  
  
  

  create() {
    super.create();
    this.dragSlider();
  }

  onResize() {
    super.onResize();
  }

  destroy() {
    super.destroy();
  }
}

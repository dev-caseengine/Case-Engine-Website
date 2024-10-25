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
        dragContainer: ".drag-container",
      },
    });
    gsap.registerPlugin(ScrollTrigger);
    this.isDragging = false;
  }

  dragSlider() {
	// Mouse and touch start event to start dragging
	this.elements.dragHandle.addEventListener("mousedown", (e) => {
	  this.isDragging = true;
	});
  
	this.elements.dragHandle.addEventListener("touchstart", (e) => {
	  this.isDragging = true;
	  e.preventDefault(); // Prevent touch scrolling when starting drag
	});
  
	// Mouse move event to adjust the reveal during dragging
	this.elements.dragContainer.addEventListener("mousemove", (e) => {
	  if (!this.isDragging) return;
  
	  // Get the container's bounds and calculate the new position of the slider
	  const rect = this.elements.dragContainer.getBoundingClientRect();
	  let offsetX = e.clientX - rect.left;
  
	  // Ensure the slider doesn't go outside the container
	  if (offsetX < 0) offsetX = 0;
	  if (offsetX > rect.width) offsetX = rect.width;
  
	  // Update the slider position and the after-image's reveal
	  this.elements.dragHandle.style.left = offsetX + "px";
	  this.elements.afterImage.style.clipPath = `inset(0 ${rect.width - offsetX}px 0 0)`;
	});
  
	// Touch move event to adjust the reveal during dragging
	this.elements.dragContainer.addEventListener("touchmove", (e) => {
	  if (!this.isDragging) return;
	  e.preventDefault(); // Prevent the page from scrolling when dragging
  
	  // Get the container's bounds and calculate the new position of the slider
	  const rect = this.elements.dragContainer.getBoundingClientRect();
	  let offsetX = e.touches[0].clientX - rect.left;
  
	  // Ensure the slider doesn't go outside the container
	  if (offsetX < 0) offsetX = 0;
	  if (offsetX > rect.width) offsetX = rect.width;
  
	  // Update the slider position and the after-image's reveal
	  this.elements.dragHandle.style.left = offsetX + "px";
	  this.elements.afterImage.style.clipPath = `inset(0 ${rect.width - offsetX}px 0 0)`;
	});
  
	// Mouse and touch end event to stop dragging
	window.addEventListener("mouseup", (e) => {
	  this.isDragging = false;
	});
  
	window.addEventListener("touchend", (e) => {
	  this.isDragging = false;
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

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
	// Check if the drag-container exists in the DOM
	if (!this.elements.dragContainer) {
	
	  return; // Exit the function if drag-container is missing
	}
  
	// Proceed with event listeners only if drag-container is present
	this.elements.dragHandle.addEventListener("mousedown", (e) => {
	  this.isDragging = true;
	});
  
	this.elements.dragHandle.addEventListener("touchstart", (e) => {
	  this.isDragging = true;
	  e.preventDefault(); // Prevent touch scrolling when starting drag
	});
  
	this.elements.dragContainer.addEventListener("mousemove", (e) => {
	  if (!this.isDragging) return;
  
	  const rect = this.elements.dragContainer.getBoundingClientRect();
	  let offsetX = e.clientX - rect.left;
  
	  if (offsetX < 0) offsetX = 0;
	  if (offsetX > rect.width) offsetX = rect.width;
  
	  this.elements.dragHandle.style.left = offsetX + "px";
	  this.elements.afterImage.style.clipPath = `inset(0 ${rect.width - offsetX}px 0 0)`;
	});
  
	this.elements.dragContainer.addEventListener("touchmove", (e) => {
	  if (!this.isDragging) return;
	  e.preventDefault();
  
	  const rect = this.elements.dragContainer.getBoundingClientRect();
	  let offsetX = e.touches[0].clientX - rect.left;
  
	  if (offsetX < 0) offsetX = 0;
	  if (offsetX > rect.width) offsetX = rect.width;
  
	  this.elements.dragHandle.style.left = offsetX + "px";
	  this.elements.afterImage.style.clipPath = `inset(0 ${rect.width - offsetX}px 0 0)`;
	});
  
	window.addEventListener("mouseup", () => {
	  this.isDragging = false;
	});
  
	window.addEventListener("touchend", () => {
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

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
    
    // Will be populated with project slugs dynamically
    this.projectSlugs = {};
    this.slugToSphereId = {};
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
    this.initializeProjectSlugs();
    this.handleDirectProjectAccess();
  }

  // Create URL-friendly slug from project title
  createSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim('-'); // Remove leading/trailing hyphens
  }

  // Initialize project slugs from DOM
  initializeProjectSlugs() {
    const sidebars = document.querySelectorAll('.sidebar');
    
    sidebars.forEach((sidebar) => {
      const modalId = sidebar.getAttribute('id');
      const sphereIdMatch = modalId.match(/modal-sphere-(\d+)/);
      
      if (sphereIdMatch) {
        const sphereId = parseInt(sphereIdMatch[1]);
        const clientNameElement = sidebar.querySelector('.sidebar__client div p');
        
        if (clientNameElement) {
          const projectTitle = clientNameElement.textContent.trim();
          const slug = this.createSlug(projectTitle);
          
          this.projectSlugs[sphereId] = slug;
          this.slugToSphereId[slug] = sphereId;
        }
      }
    });

    console.log('Initialized project slugs:', this.projectSlugs);
  }

  // Handle direct access to projects via URL hash
  handleDirectProjectAccess() {
    const hash = window.location.hash.replace('#', '');
    
    // Skip if it's the #grids hash
    if (hash === 'grids') return;
    
    // Check if hash matches a project slug
    if (hash && this.slugToSphereId[hash]) {
      const sphereId = this.slugToSphereId[hash];
      
      // Wait for the canvas/spheres to be initialized
      setTimeout(() => {
        this.openProjectModal(sphereId);
      }, 4000); // Adjust timing based on when spheres are ready
    }
  }

  // Open a specific project modal
  openProjectModal(sphereId) {
    // Find the corresponding slide and trigger click
    const slides = document.querySelectorAll('.results-slider__slide');
    const slideIndex = sphereId - 1;
    
    if (slides[slideIndex]) {
      slides[slideIndex].click();
    }
  }

  // Update URL hash when a project is opened
  updateProjectHash(sphereId) {
    const slug = this.projectSlugs[sphereId];
    if (slug) {
      // Update URL without triggering page reload
      history.replaceState(null, null, `#${slug}`);
    }
  }

  // Clear project hash when modal is closed
  clearProjectHash() {
    // Only clear if it's a project hash, not other hashes like #grids
    const hash = window.location.hash.replace('#', '');
    if (hash && this.slugToSphereId[hash]) {
      history.replaceState(null, null, window.location.pathname + window.location.search);
    }
  }

  onResize() {
    super.onResize();
  }

  destroy() {
    super.destroy();
  }
}

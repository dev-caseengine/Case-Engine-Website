import Page from "../classes/Page";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import jQuery from "jquery";
export default class Results extends Page {
  constructor() {
    super({
      id: "resultsPage",
      element: ".resuts-page",
      elements: {
        tabs: ".tab",
        contents: ".tab-content",
		canvas: "canvas",

      },
    });
    gsap.registerPlugin(ScrollTrigger);

  }

  createTabs() {

    this.elements.tabs.forEach((tab, index) => {
	
		tab.addEventListener("click", () => {
        // Remove active class from all tabs
        this.elements.tabs.forEach((innerTab) => {
          innerTab.classList.remove("active-tab");
        });

        // Hide all tab contents
        this.elements.contents.forEach((content) => {
          content.classList.remove("active-content");
        });

        // Set clicked tab to active
        tab.classList.add("active-tab");

        // Display associated content
        const tabContent = document.querySelector(
          `.tab-content[data-content="${tab.getAttribute("data-tab")}"]`
        );
        tabContent.classList.add("active-content");
      });
    });
  }



  create() {
    super.create();
    this.createTabs();

  }

  show() {
    super.show();
  }


  hide() {
	super.hide();

  }
}

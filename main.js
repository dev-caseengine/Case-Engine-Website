import { each } from "lodash";
import Canvas from "./js/components/Canvas/Canvas";
import Footer from "./js/components/Footer";

import Navigation from "./js/components/Navigation";
import Preloader from "./js/components/Preloader";

import About from "./js/Pages/About";
import Home from "./js/Pages/Home";
import Contact from "./js/Pages/Contact";
import Resources from "./js/utils/Resources";
import "./styles/main.scss";



class App {
  constructor() {

	this.resources = new Resources();

    this.createContent();
    this.createNavigation();
    this.createFooter();
    this.createCanvas();
	this.createPreloader();
    this.createPages();

    this.addEventListeners();
    this.addLinkListeners();
    this.onResize();
    this.update();
  }

  createPreloader() {
    this.preloader = new Preloader({
		resources: this.resources,
	});
    this.preloader.on("loaded", () => {
      this.onPreloaded();
    });
  }

  createNavigation() {
    this.navigation = new Navigation();
	this.navigation.create();
  }

  createCanvas() {
    this.canvas = new Canvas({
      template: this.template,
	  resources: this.resources,
    });
  }

  createFooter() {
    this.footer = new Footer({
      template: this.template,
    });
  }

  createContent() {
    this.content = document.querySelector(".content");
    this.template = this.content.getAttribute("data-template");
  }

  createPages() {
    this.pages = {
      home: new Home(),
      about: new About(),
	  contact: new Contact(),
    };

    this.page = this.pages[this.template];
    this.page.create();
  }

onPreloaded() {
	this.onResize();
	this.canvas.onPreloaded();
	// this.page.preloadInitAnimation();
	this.page.show();


  }

  onPopState() {
    this.onChange({
      url: window.location.pathname,
      push: false,
    });
  }

  async onChange({ url, push = true }) {
	this.canvas.onChangeStart(this.template, url);

    await this.page.hide(); // hide current page
	this.navigation.destroy();

    const request = await window.fetch(url); // fetch requested page

    if (request.status === 200) {
      const html = await request.text();
      const div = document.createElement("div"); // create fake div

      if (push) {
        window.history.pushState({}, "", url);
      }

      div.innerHTML = html; // save html response to fake div

      const divContent = div.querySelector(".content"); // select new content from fake div

      this.template = divContent.getAttribute("data-template"); // update template value

    //   this.navigation.onChange(this.template);
      this.canvas.onChangeEnd(this.template);
      this.footer.onChange(this.template);
      this.content.setAttribute("data-template", this.template);
      this.content.innerHTML = divContent.innerHTML; // apply fake div content to our page

      this.page = this.pages[this.template];
      this.page.create();
	  this.navigation.create();

      this.onResize();

      this.page.show();
	  
	  this.addLinkListeners();

    } else {
      console.log("error");
    }
  }

  onResize() {
    if (this.canvas && this.canvas.onResize) {
		this.canvas.onResize()
	  }
  }

  update() {
    if (this.page && this.page.update) {
      this.page.update(this.frame);
    }

    if (this.canvas && this.canvas.update) {
      this.canvas.update(this.frame);
    }

    this.frame = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    window.addEventListener("popstate", this.onPopState.bind(this));
    window.addEventListener("resize", this.onResize.bind(this));
  }

  addLinkListeners() {
    const links = document.querySelectorAll("a");

    each(links, (link) => {
      link.onclick = (event) => {
        event.preventDefault();

        const { href } = link;
        this.onChange({ url: href });
      };
    });
  }
}

new App();

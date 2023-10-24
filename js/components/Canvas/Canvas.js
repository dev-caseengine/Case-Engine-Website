import * as THREE from "three";
import Sizes from "../../utils/Sizes";
import Time from "../../utils/Time";
import CameraParallax from "../../utils/CameraParallax";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

import Model from "./Model";
import Plane from "./Plane";
export default class Canvas {
  constructor({ template, resources }) {
    this.template = template;
	this.resources = resources;
    this.sizes = new Sizes();

    // this.time = new Time();

    this.createScene();
    this.createCamera();
	this.createRenderer();
	this.setupPostProcessing();


	
	// this.createControls(); 
    // this.createParallaxCamera();
	// this.createPlane();

    this.onResize();
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(this.sizes.pixelRatio);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.9;

	this.renderer.physicallyBasedShading = true;
	this.renderer.physicallyCorrectLights = true;

	// this.renderer.outputEncoding = THREE.sRGBEncoding;

	this.renderer.colorSpace = THREE.sRGBColorSpace;
    //apend render to body
    document.body.appendChild(this.renderer.domElement);
	this.composer = new EffectComposer(this.renderer);
	// Create the effect composer after initializing the renderer
	
  }

  setupPostProcessing() {
    // Create the render pass
    const renderPass = new RenderPass(this.scene, this.camera);
    renderPass.clear = true;
    this.composer.addPass(renderPass);

    // Initialize the bloom pass (but don't add it to the composer just yet)
    this.bloomPass = new UnrealBloomPass(
        new THREE.Vector2(this.sizes.width, this.sizes.height),
        1.5, 0.1, 0.1
    );
}


  createScene() {
    this.scene = new THREE.Scene();
	this.scene.background = new THREE.Color('#00000f'); // Black color

  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );

    const laptopQuery = window.matchMedia("(max-width: 1440px)");
    const tabletQuery = window.matchMedia("(max-width: 1024px)");

    const handleMediaQuery = () => {
      if (tabletQuery.matches) {
        this.camera.position.z = 3.3;
      } else if (laptopQuery.matches) {
        this.camera.position.z = 3.2;
      } else {
        this.camera.position.z = 3;
      }
    };

    handleMediaQuery();
    laptopQuery.addEventListener("change", handleMediaQuery);
    tabletQuery.addEventListener("change", handleMediaQuery);
	

    this.scene.add(this.camera);
  }

//   createControls() {
// 	this.controls = new OrbitControls(this.camera, this.renderer.domElement);
//     this.controls.enableDamping = true;
//     this.controls.dampingFactor = 0.05;
//   }

//   createParallaxCamera() {
//     this.parallaxCamera = new CameraParallax(this.camera);
//   }

  createPlane() {
    this.plane = new Plane({
      scene: this.scene,
      renderer: this.renderer,
      camera: this.camera,
      sizes: this.sizes,
    });
  }

  destroyPlane() {
    if (!this.plane) return;
    // If there are additional cleanup actions specific to your Plane, add them here
    this.plane.destroy(); 
    this.plane = null;
}

  createHome() {
    this.home = new Model({
      name: "phone",
      file: this.resources.items.handModel,
      scene: this.scene,
      renderer: this.renderer,
      camera: this.camera,
      resources: this.resources,
    });
  }

  destroyHome() {
    if (!this.home) return;
    this.home.destroy();
    this.home = null;
  }

  createAbout() {
    this.about = new Model({
      name: "logo",
      file: this.resources.items.logoModel,
      //   file: this.resources.sources[2].path,
      scene: this.scene,
      renderer: this.renderer,
      camera: this.camera,
      resources: this.resources,
    });
  }
  destroyAbout() {
    if (!this.about) return;
    this.about.destroy();
    this.about = null;
  }

  createResults() {
	this.results = new Model({
	  name: "city",
	  file: this.resources.items.cityModel,
	  scene: this.scene,
	  renderer: this.renderer,
	  camera: this.camera,
	  resources: this.resources,
	});

 // Initialize the parallax camera
//  this.parallaxCamera = new CameraParallax(this.camera);

  }
  destroyResults() {
	if (!this.results) return;
    this.results.destroy();
    this.resutls = null;

    // Destroy the parallax camera
    // this.parallaxCamera = null;

  }

  

  // Events
  onPreloaded() {
    this.onChangeEnd(this.template);
  }

  onChangeStart(template, url) {
    if (template === "home" && this.home) {
      this.home.hide();
    }
    if (template === "about" && this.about) {
      this.about.hide();
    }

	if (template === "resultsPage" && this.results) {
		console.log("results page leave");
		this.results.hide();
		document.querySelector("canvas").style.zIndex = "-1";

	  }
  }

  onChangeEnd(template) {
    if (template === "home") {
        // this.createHome();
        if (!this.plane) this.createPlane(); // Create the plane if it doesn't exist
    } else {
        this.destroyHome();
    }
    if (template === "about") {
        this.createAbout();
        if (!this.plane) this.createPlane(); // Create the plane if it doesn't exist
    } else if (this.about) {
        this.destroyAbout();
    }

	if (template === "resultsPage") {
        this.createResults();
		document.querySelector("canvas").style.zIndex = "1";
        if (this.plane) this.destroyPlane(); // Destroy the plane if it exists
        
        // Add bloom pass if it's not already added
        if (!this.composer.passes.includes(this.bloomPass)) {
            this.composer.addPass(this.bloomPass);
        }

    } else {
        if (this.results) {
            this.destroyResults();
        }

        // Remove bloom pass if it's present
        const index = this.composer.passes.indexOf(this.bloomPass);
        if (index !== -1) {
            this.composer.passes.splice(index, 1);
        }
    }

	if (template === "contact") {      
        if (!this.plane) this.createPlane(); // Create the plane if it doesn't exist
    }

    // Add similar logic for the 'contact' page when it's added.
}


  //   onChange(template) {
  //     if (template === "home") {
  //       this.createHome();
  //     } else {
  //       this.destroyHome();
  //     }

  //     if (template === "about") {
  //       this.createAbout();
  //     } else {
  //       this.destroyAbout();
  //     }
  //   }

  onResize() {
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(this.sizes.pixelRatio);
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();

  }

  onMouseMove(event) {
	if (this.home) this.home.onMouseMove(event);
	if (this.about) this.about.onMouseMove(event);
	if (this.results) this.results.onMouseMove(event);
  }

  update(time) {
	this.composer.render();
    // this.renderer.render(this.scene, this.camera);
    // this.controls.update(); 

    // Update parallax camera only if resultsPage is active and parallaxCamera exists
    // if (this.results && this.parallaxCamera) {
    //     this.parallaxCamera.update();
    // }

    if (this.home) this.home.update(time);
    if (this.about) this.about.update(time);
    if (this.plane) this.plane.update(time);
    if (this.results) this.results.update(time);
}

}

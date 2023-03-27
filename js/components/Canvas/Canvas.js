import * as THREE from "three";
import Resources from "../../utils/Resources";
import Sizes from "../../utils/Sizes";
import Time from "../../utils/Time";
import CameraParallax from "../../utils/CameraParallax";
// import sources from "../../sources";
import Model from "./Model";
import Plane from "./Plane";
export default class Canvas {
  constructor({ template, resources }) {
	this.template = template;
    this.sizes = new Sizes();
    this.createRenderer();
    this.time = new Time();
    this.resources = resources;
    this.createScene();
    this.createCamera();
	this.createParallaxCamera();

	this.createPlane();

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
    this.renderer.toneMappingExposure = 1;

    //apend render to body
    document.body.appendChild(this.renderer.domElement);
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );

    this.camera.position.z = 3;
    this.scene.add(this.camera);
  }

  createParallaxCamera() {
	this.parallaxCamera = new CameraParallax(this.camera);
	// this.parallaxCamera.init();
  }

  createPlane() {
	this.plane = new Plane({
		scene: this.scene,
		renderer: this.renderer,
		camera: this.camera,
		sizes: this.sizes,
	});
  }

  createHome() {
      this.home = new Model({
        name: "phone",
        file: this.resources.items.handModel,
		// file: this.resources.sources[1].path,
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


  // Events
  onPreloaded() {
    this.onChangeEnd(this.template);
  }

  onChangeStart(template, url) {
	if (template === 'home' && this.home) {
	  this.home.hide();
	}
	if (template === 'about' && this.about) {
	  this.about.hide();
	}
  }

  onChangeEnd(template) {
	if (template === 'home') {
		this.createHome();
	  } else {
		this.destroyHome();
	  }
	  if (template === 'about') {
		this.createAbout();
	  } else if (this.about) {
		this.destroyAbout();
	  }

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

  update(time) {
    this.renderer.render(this.scene, this.camera);

	this.parallaxCamera.update();


    if (this.home) this.home.update(time);

    if (this.about) this.about.update(time);
	if (this.plane) this.plane.update(time);
  }
}

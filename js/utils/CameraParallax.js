class CameraParallax {
	constructor(camera) {
	  this.camera = camera;
	  this.bind();
	  this.active = true;
	  this.mousePos = { x: 0, y: 0 };
	  this.params = {
		intensity: 0.00015, // Reduced intensity for smoother and more subtle movement
		ease: 0.03, // Reduced ease for even less abrupt movement
	  };
	  this.init();
	}
  
	init() {
	  if (this.isMobile()) {
		window.addEventListener("deviceorientation", this.onDeviceOrientation, true);
	  } else {
		window.addEventListener("mousemove", this.onMouseMove);
	  }
	}
  
	onDeviceOrientation = (event) => {
	  const beta = event.beta;
	  const gamma = event.gamma;
	 
	  this.mousePos.y = this.mapBetaToCamera(beta);
	  this.mousePos.x = this.mapGammaToCamera(gamma);
	}
  
	mapBetaToCamera(beta) {
	  // Convert beta value to a value suitable for your camera position
	  return (beta - 90) * this.params.intensity;
	}
  
	mapGammaToCamera(gamma) {
	  // Convert gamma value to a value suitable for your camera position
	  return gamma * this.params.intensity;
	}
  
	isMobile() {
	  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}
  
	onMouseMove = (e) => {
	  this.mousePos.x = (e.clientX - window.innerWidth / 2) * this.params.intensity;
	  this.mousePos.y = (e.clientY - window.innerHeight / 2) * this.params.intensity;
	}
  
	update() {
	  if (!this.active) return;
  
	  // Smoothly update camera position for more cinematic movement
	  this.camera.position.x += (this.mousePos.x - this.camera.position.x) * this.params.ease;
	  this.camera.position.y += (this.mousePos.y - this.camera.position.y) * this.params.ease;
  
	  // Make the camera look at the origin for a more immersive effect
	  this.camera.lookAt(0, 0, 0);
	}
  
	bind() {
	  this.onMouseMove = this.onMouseMove.bind(this);
	  this.onDeviceOrientation = this.onDeviceOrientation.bind(this);
	}
  }
  
  export default CameraParallax;
  


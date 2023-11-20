class CameraParallax {
	constructor(camera) {
	  this.camera = camera;
	  this.bind();
	  this.active = true;
	  this.mousePos = { x: 0, y: 0 };
	  this.params = {
		intensity: 0.0003,
		ease: 0.08,
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
		console.log(`Device orientation beta value: ${beta}`); // Debugging line
		this.mousePos.y = this.mapBetaToCamera(beta);
	  }

	  mapBetaToCamera(beta) {
		// Convert beta value to a value suitable for your camera position
		// This conversion might involve scaling and adjusting the range
		return (beta - 90) * this.params.intensity; // Example conversion
	  }
	
	  isMobile() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	  }
  
	onMouseMove = (e) => {
	//   this.mousePos.x =
	// 	(e.clientX - window.innerWidth / 2) * this.params.intensity;
	  this.mousePos.y =
		(e.clientY - window.innerHeight / 2) * this.params.intensity;
	}
  
	update() {
	  if (!this.active) return;
	//   this.camera.position.x +=
	// 	(this.mousePos.x - this.camera.position.x) * this.params.ease;
	  this.camera.position.y +=
		(this.mousePos.y - this.camera.position.y) * this.params.ease;


	  // this.camera.position.z +=
	  //   (this.initZ - this.camera.position.z) * this.params.ease;
	  this.camera.lookAt(0, 0, 0);
	}
  
	bind() {
	  this.onMouseMove = this.onMouseMove.bind(this);
	}
  }
  
  export default CameraParallax;
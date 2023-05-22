import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
export default class Model {
  constructor(obj) {
    this.name = obj.name;
    this.file = obj.file;
    this.scene = obj.scene;
    this.renderer = obj.renderer;
    this.resources = obj.resources;
    this.camera = obj.camera;
    gsap.registerPlugin(ScrollTrigger);

    this.loader = this.resources.loaders.gltfLoader;
    this.resource = this.file;
    this.currentVideoTexture = null;
    this.videoTextureAdded = false;

    this.init();
  }

  init() {
    this.showModel();

    this.model = this.resource.scene;
    // this.loader.load(this.file, (response) => {
    this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.pmremGenerator.compileEquirectangularShader();

    this.environmentMap = this.pmremGenerator.fromEquirectangular(
      this.resources.items.environmentMapTexture
    ).texture;

    this.model.children[0].material = new THREE.MeshBasicMaterial({
      map: this.resources.items.environmentMapTexture,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
    });

    this.m = new THREE.MeshStandardMaterial({
      metalness: 0.7,
      roughness: 0.25,
      userData: {},
    });

    this.m.envMap = this.environmentMap;

    this.model.children[0].material = this.m;

    if (this.name === "phone") {
      this.setHomeModel();
      setTimeout(() => {
        this.modelAnimation();
        this.resultsSection();
      }, 500);
    }

    if (this.name === "logo") {
      this.setAboutModel();
      setTimeout(() => {
        this.logoAnimation();
      }, 500);
    }
    //   });
  }

  setAboutModel() {
    this.model.scale.set(0.9, 0.9, 0.9);

    this.x = window.innerWidth < 920 ? 0.2 : 1;

    this.model.position.set(this.x, 0, 0);
    this.model.rotation.set(0, 0, 0);

    this.m.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };

      shader.fragmentShader =
        `
				uniform float uTime;
				mat4 rotationMatrix(vec3 axis, float angle) {
					axis = normalize(axis);
					float s = sin(angle);
					float c = cos(angle);
					float oc = 1.0 - c;
					
					return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
								oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
								oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
								0.0,                                0.0,                                0.0,                                1.0);
				}
				
				vec3 rotate(vec3 v, vec3 axis, float angle) {
					mat4 m = rotationMatrix(axis, angle);
					return (m * vec4(v, 1.0)).xyz;
				}
		
				` + shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
        `#include <envmap_physical_pars_fragment>`,
        `
					#if defined( USE_ENVMAP )
			vec3 getIBLIrradiance( const in vec3 normal ) {
				#if defined( ENVMAP_TYPE_CUBE_UV )
					vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
					vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
					return PI * envMapColor.rgb * envMapIntensity;
				#else
					return vec3( 0.0 );
				#endif
			}
			vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
				#if defined( ENVMAP_TYPE_CUBE_UV )
					vec3 reflectVec = reflect( - viewDir, normal );
					// Mixing the reflection with the normal is more accurate and keeps rough objects from gathering light from behind their tangent plane.
					reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
					reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
		
					reflectVec = rotate(reflectVec, vec3(0.3, 0.0, 1.0), uTime * 0.01 / 15.0);
					vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
					return envMapColor.rgb * envMapIntensity;
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
					`
      );

      this.m.userData.shader = shader;
    };

    //look at camera

    this.scene.add(this.model);
  }

  setHomeModel() {
    this.model.updateMatrixWorld();
    this.model.scale.set(3, 3, 3);

    // const tabletQuery = window.matchMedia("(max-width: 920px)");

    // const handleMediaQuery = (e) => {
    //   if (tabletQuery.matches) {
    //     this.model.position.set(0.6, -1.3, 0);
    //   } else {
    //     this.model.position.set(1.5, -0.8, 0);
    //   }
    // };

    this.x = window.innerWidth < 920 ? 0.6 : 1.5;
    this.y = window.innerWidth < 920 ? -1.2 : -0.8;

    this.model.position.set(this.x, this.y, 0);

    // handleMediaQuery();
    // tabletQuery.addEventListener("change", handleMediaQuery);

    this.model.rotation.set(0, -0.08, 0);

    this.m.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };

      shader.fragmentShader =
        `
				uniform float uTime;
				mat4 rotationMatrix(vec3 axis, float angle) {
					axis = normalize(axis);
					float s = sin(angle);
					float c = cos(angle);
					float oc = 1.0 - c;
					
					return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
								oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
								oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
								0.0,                                0.0,                                0.0,                                1.0);
				}
				
				vec3 rotate(vec3 v, vec3 axis, float angle) {
					mat4 m = rotationMatrix(axis, angle);
					return (m * vec4(v, 1.0)).xyz;
				}
		
				` + shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
        `#include <envmap_physical_pars_fragment>`,
        `
					#if defined( USE_ENVMAP )
			vec3 getIBLIrradiance( const in vec3 normal ) {
				#if defined( ENVMAP_TYPE_CUBE_UV )
					vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
					vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
					return PI * envMapColor.rgb * envMapIntensity;
				#else
					return vec3( 0.0 );
				#endif
			}
			vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
				#if defined( ENVMAP_TYPE_CUBE_UV )
					vec3 reflectVec = reflect( - viewDir, normal );
					// Mixing the reflection with the normal is more accurate and keeps rough objects from gathering light from behind their tangent plane.
					reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
					reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
		
					reflectVec = rotate(reflectVec, vec3(0.0, 1.0, 0.0), uTime * 0.01 / 15.0);
					vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
					return envMapColor.rgb * envMapIntensity;
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
					`
      );

      this.m.userData.shader = shader;
    };

    this.model.children[1].traverse((o) => {
      if (o.isMesh) {
        o.material = this.m;
      }
    });

    this.model.traverse((child) => {
      if (child.isMesh) {
        child.material.side = THREE.DoubleSide;


        if (child.name === "phoneScreen" && !this.videoTextureAdded) {
          // Find the "phoneScreen" child mesh
          let phoneScreenMesh = child;

          // Add the video texture to the "phoneScreen" mesh
          if (phoneScreenMesh) {
            this.videoTexture = {};
            this.video = this.resources.items.notificationVideo;


            this.video.muted = true;
            this.video.loop = true;
            this.video.controls = true;
			this.video.setAttribute('playsinline', true)
            this.video.autoplay = true;
            this.video.play();

            this.videoTexture = new THREE.VideoTexture(this.video);
            this.videoTexture.flipY = false;
            this.videoTexture.encoding = THREE.SRGBColorSpace;

			this.videoTexture.needsUpdate = true;


            phoneScreenMesh.material = new THREE.MeshBasicMaterial({
              map: this.videoTexture,
              transparent: true,
              opacity: 1,
              side: THREE.DoubleSide,
            });

            phoneScreenMesh.material.needsUpdate = true;

            phoneScreenMesh.scale.set(0.45, 0.45, 0.46);

            phoneScreenMesh.position.z = 0.073;
          }

          // Clone the "phoneScreen" mesh three times and add other images to the clones
          if (phoneScreenMesh) {
            this.clone1 = phoneScreenMesh.clone();
            this.clone2 = phoneScreenMesh.clone();
            this.clone3 = phoneScreenMesh.clone();

            this.clone1.name = "red";
            this.clone2.name = "blue";
            this.clone3.name = "green";

            // Position the clones however you want
            this.clone1.scale.set(0.45, 0.45, 0.46);
            this.clone2.scale.set(0.45, 0.45, 0.46);
            this.clone3.scale.set(0.45, 0.45, 0.46);

            this.clone1.position.z = 0.0722;
            this.clone2.position.z = 0.0721;
            this.clone3.position.z = 0.072;

            this.clone1.rotation.y = Math.PI;
            this.clone2.rotation.y = Math.PI;
            this.clone3.rotation.y = Math.PI;

            this.clone1.rotation.z = Math.PI;
            this.clone2.rotation.z = Math.PI;
            this.clone3.rotation.z = Math.PI;

            // Add other images to the clones
            // For example, you could create new materials with the other images and assign them to the clones' meshes

            this.videoTexture2 = {};
			// this.video2 = this.resources.items.problemOne;
			this.video2 = document.createElement('video');
            this.video2.src = '../../../assets/videos/problem-1-final.mp4'
            this.video2.muted = true;
            this.video2.loop = true;
            this.video2.controls = true;
         
			this.video2.setAttribute('playsinline', true)
            this.video2.autoplay = true;

            this.video2.play();

            this.videoTexture2 = new THREE.VideoTexture(this.video2);
            this.videoTexture2.flipY = true;
            this.videoTexture2.encoding = THREE.SRGBColorSpace;
			this.videoTexture2.needsUpdate = true;

            this.clone1.material = new THREE.MeshBasicMaterial({
              map: this.videoTexture2,
              transparent: true,
              opacity: 0,
              side: THREE.DoubleSide,
            });

    
            this.videoTexture3 = {};
			// this.video3 = this.resources.items.problemTwo;
			this.video3 = document.createElement('video');
            this.video3.src = '../../../assets/videos/problem-2.mp4'


            this.video3.muted = true;
            this.video3.loop = true;
            this.video3.controls = true;
       
			this.video3.setAttribute('playsinline', true)
            this.video3.autoplay = true;

            // this.video3.play();

            this.videoTexture3 = new THREE.VideoTexture(this.video3);
            this.videoTexture3.flipY = true;
            this.videoTexture3.encoding = THREE.SRGBColorSpace;
			this.videoTexture3.needsUpdate = true;

            this.clone2.material = new THREE.MeshBasicMaterial({
              map: this.videoTexture3,
              transparent: true,
              opacity: 0,
              side: THREE.DoubleSide,
            });


			this.videoTexture4 = {};
            // this.video4 = this.resources.items.problemThree;
			this.video4 = document.createElement('video');
            this.video4.src = '../../../assets/videos/problem-3.mp4'


            this.video4.muted = true;
            this.video4.loop = true;
            this.video4.controls = true;
        
			this.video4.setAttribute('playsinline', true)
            this.video4.autoplay = true;

            // this.video4.play();

            this.videoTexture4 = new THREE.VideoTexture(this.video4);
            this.videoTexture4.flipY = true;
            this.videoTexture4.encoding = THREE.SRGBColorSpace;
            this.videoTexture4.minFilter = THREE.LinearFilter;
            this.videoTexture4.magFilter = THREE.LinearFilter;


            this.clone3.material = new THREE.MeshBasicMaterial({
			  map: this.videoTexture4,
              transparent: true,
              opacity: 0,
              side: THREE.DoubleSide,
            });

            // Add the clones to the scene
            this.clones = [this.clone1, this.clone2, this.clone3];
            this.clones.forEach((clone) => this.model.add(clone));
          }

          // Set the videoTextureAdded flag to true so that we don't add the video texture again if this code is called again
          this.videoTextureAdded = true;
        }
      }
    });

    this.scene.add(this.model);
  }

  modelAnimation() {
    this.scrollTl = gsap.timeline({ paused: true });
    this.scrollTl.to(this.model.rotation, { y: -Math.PI * 2 }, 0);

    this.scrollTl.to(
      this.model.children.find((child) => child.name === "phoneScreen")
        .material,
      { opacity: 0 },
      0
    );

    this.scrollTl.to(this.model.position, { x: 0.629 }, 0);

    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      scrub: true,
      animation: this.scrollTl,
    });
  }

  resultsSection() {
    const navEl = document.querySelector(".results__nav span");
    const sections = document.querySelectorAll(".result");
    const headingEls = document.querySelectorAll(".results__problem h2");
    const textEls = document.querySelectorAll(".results__problem p");
    const resultEls = document.querySelectorAll(".results__result p");
    this.ball = document.querySelector(".results__follow");
    this.triggerEl = document.querySelector(".results__trigger");
    gsap.set(this.ball, { xPercent: -50, yPercent: -50 });

    //Mouse Follow
    this.pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.mouse = { x: this.pos.x, y: this.pos.y };
    this.speed = 0.2;

    this.xSet = gsap.quickSetter(this.ball, "x", "px");
    this.ySet = gsap.quickSetter(this.ball, "y", "px");

    this.triggerEl.addEventListener("mousemove", (e) => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
    });

    gsap.ticker.add(() => {
      this.pos.x += (this.mouse.x - this.pos.x) * this.speed;
      this.pos.y += (this.mouse.y - this.pos.y) * this.speed;

      this.xSet(this.pos.x);
      this.ySet(this.pos.y);
    });

    // Set initial state for animation
    gsap.set([headingEls, textEls, resultEls], { y: "-101%" });
    gsap.set([headingEls[0], textEls[0], resultEls[0]], { y: "0%" });

    //set the red to have 1 opacity
    ScrollTrigger.create({
      trigger: ".result",
      start: "-50% top ",
      once: true,
      onEnter: () => {
        gsap.to(
          this.model.children.find((child) => child.name === "red").material,
          { opacity: 1 },
          "<"
        );
      },
    });

    //hide model when entering the blue section
    ScrollTrigger.create({
      trigger: ".results",
      start: "top top",
      end: "150%",
      invalidateOnRefresh: true,
      onEnter: () => {
        this.model.visible = true;
      },
      onLeave: () => {
        this.model.visible = false;
      },
      onEnterBack: () => {
        this.model.visible = true;
      },
    });

    const tl = gsap.timeline({ paused: true });

    // Add active class to first section
    sections[0].classList.add("active-result");

    // Initialize flag variable to track animation status
    let isAnimating = false;

    this.ball.addEventListener("click", () => {
      if (isAnimating) {
        return; // If animation is already playing, do nothing
      }

      isAnimating = true; // Set flag variable to true before starting the animation

      // Find current active section
      const currentActiveIndex = Array.from(sections).findIndex((section) =>
        section.classList.contains("active-result")
      );

      // Remove active class from current section
      sections[currentActiveIndex].classList.remove("active-result");

      // Determine next section to make active
      const nextIndex =
        currentActiveIndex === sections.length - 1 ? 0 : currentActiveIndex + 1;

      const currentActiveH2 = headingEls[currentActiveIndex];
      const nextActiveH2 = headingEls[nextIndex];

      const currentActiveP = textEls[currentActiveIndex];
      const nextActiveP = textEls[nextIndex];

      const currentResult = resultEls[currentActiveIndex];
      const nextResult = resultEls[nextIndex];

      // Add active class to next section
      sections[nextIndex].classList.add("active-result");

      // Animate the text
      gsap.set([currentActiveH2, currentActiveP, currentResult], { y: "0%" });
      gsap.set([nextActiveH2, nextActiveP, nextResult], { y: "-100%" });

      tl.to([currentActiveH2, currentActiveP, currentResult], {
        y: "100%",
        duration: 1,
        ease: "power2.inOut",
      });

      tl.to(
        [nextActiveH2, nextActiveP, nextResult],
        { y: "0%", duration: 1, ease: "power2.inOut" },
        "<"
      );

      if (currentActiveIndex === 0) {
        navEl.textContent = "2 / 3";

        tl.to(
          this.model.children.find((child) => child.name === "red").material,
          { opacity: 0 },
          "<"

        );
		this.video2.pause();
        tl.to(
          this.model.children.find((child) => child.name === "blue").material,
          { opacity: 1 },
          "<"
        );
		this.video3.play();
      }

      if (currentActiveIndex === 1) {
        navEl.textContent = "3 / 3";

        tl.to(
          this.model.children.find((child) => child.name === "blue").material,
          { opacity: 0 },
          "<"
        );
		this.video3.pause();
        tl.to(
          this.model.children.find((child) => child.name === "green").material,
          { opacity: 1 },
          "<"
        );
		this.video4.play();
      }

      if (currentActiveIndex === 2) {
        navEl.textContent = "1 / 3";

        tl.to(
          this.model.children.find((child) => child.name === "green").material,
          { opacity: 0 },
          "<"
        );
		this.video4.pause();
        tl.to(
          this.model.children.find((child) => child.name === "red").material,
          { opacity: 1 },
          "<"
        );
		this.video2.play();
      }

      //animate ball

      tl.to(".results__follow p", { yPercent: 100, ease: "power2.inOut" }, "<");
      tl.to(".results__follow p", { yPercent: 0, ease: "power2.inOut" });

      tl.play();

      tl.then(() => {
        isAnimating = false; // Set flag variable to false after animation is complete
      });
    });
  }

  logoAnimation() {
    this.scrollTl = gsap.timeline({ paused: true });
    this.scrollTl.to(this.model.position, { x: -1 }, 0);
    this.scrollTl.to(this.model.rotation, { y: -3.1 }, 0);

    ScrollTrigger.create({
      trigger: ".about-hero",
      start: "top top",
      end: "65%",
      scrub: true,
      animation: this.scrollTl,
    });

    ScrollTrigger.create({
      trigger: ".about-video",
      start: "top top",
      end: "10px",
      scrub: true,
      onEnter: () => {
        this.model.visible = false;
      },

      onEnterBack: () => {
        this.model.visible = true;
      },
    });
  }

  // Model Mouse Move
  onMouseMove(e) {
    // const x = e.clientX;
    // const y = e.clientY;
    // gsap.to(this.scene.rotation, {
    //   y: gsap.utils.mapRange(0, window.innerWidth, 0.2, -0.2, x),
    //   x: gsap.utils.mapRange(0, window.innerHeight, 0.2, -0.2, y),
    // });
  }

  //Hide Model
  hide() {
    if (!this.model) return;
    this.model.visible = false;
  }

  // Destroy
  async destroy() {
    if (!this.model) return;

    // Remove the clones from the scene and dispose of their materials and geometries
    if (this.clones) {
      this.clones.forEach((clone) => {
        this.model.remove(clone);
        clone.traverse((child) => {
          if (child.material) {
            child.material.dispose();
            if (child.material.map) {
              child.material.map.dispose();
            }
          }
          if (child.geometry) {
            child.geometry.dispose();
          }
        });
      });
      this.clones = null;
    }

    // Remove the main model from the scene and dispose of its materials, geometries, and textures
    this.scene.remove(this.model);
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    await new Promise((resolve) => {
      this.model.traverse((child) => {
        if (child.material) {
          child.material.dispose();
          if (child.material.map) {
            child.material.map.dispose();
          }
        }
        if (child.geometry) {
          child.geometry.dispose();
        }
        if (
          child instanceof THREE.Mesh &&
          child.material.map instanceof THREE.VideoTexture
        ) {
          // pause and dispose of the video texture
          child.material.map.dispose();
          child.material.map.image.pause();
          child.material.map.image.currentTime = 0;
          child.material.dispose();
        }
      });
      resolve();
    });

    // set loader to null to remove any references to it
    this.loader = null;
  }

  async showModel() {
    await this.destroy();
    this.model.visible = true;

    this.showTl = gsap.timeline({ delay: 1 });

    if (this.name === "phone") {
      this.showTl.fromTo(
        this.model.rotation,
        { x: 0.5 },
        { x: 0, duration: 1 }
      );
      this.showTl.fromTo(
        this.model.position,
        { y: -3 },
        { y: () => (window.innerWidth < 920 ? -1.3 : -0.8), duration: 1 },
        0
      );
    }

    if (this.name === "logo") {
      this.showTl.fromTo(this.model.rotation, { x: 2 }, { x: 0, duration: 1 });
      this.showTl.fromTo(
        this.model.position,
        { y: -2.3 },
        { y: 0, duration: 1 },
        0
      );
    }
  }

  // Update
  update(time) {
    if (!this.model) return;
    if (this.m.userData) {
      this.m.userData.shader.uniforms.uTime.value = time;
    }
  }
}

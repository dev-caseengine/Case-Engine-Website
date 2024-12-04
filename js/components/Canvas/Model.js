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
    this.eventEmitter = obj.eventEmitter;

    this.loader = this.resources.loaders.gltfLoader;
    this.resource = this.file;
    this.currentVideoTexture = null;
    this.videoTextureAdded = false;
    // this.gui = new dat.GUI();
    this.selectedSphere = null;

    gsap.registerPlugin(ScrollTrigger);

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
      metalness: 0.8,
      roughness: 0.2,
      userData: {},
    });

    this.m.envMap = this.environmentMap;
    this.m.envMapIntensity = 0.4;
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

    if (this.name === "city") {
      this.setCityModel();
      this.createSlider();
	//   this.setGridModel();
    }
  }

  createTabs(modal) {
    const tabs = modal.querySelectorAll(".tab");
    const contents = modal.querySelectorAll(".tab-content");

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        // Remove active class from all tabs
        tabs.forEach((innerTab) => {
          innerTab.classList.remove("active-tab");
        });

        // Hide all tab contents
        contents.forEach((content) => {
          content.classList.remove("active-content");
        });

        // Set clicked tab to active
        tab.classList.add("active-tab");

        // Display associated content
        const tabContent = modal.querySelector(
          `.tab-content[data-content="${tab.getAttribute("data-tab")}"]`
        );
        tabContent.classList.add("active-content");
      });
    });
  }

  addSphereClickListener() {
    this.renderer.domElement.addEventListener(
      "mousedown",
      this.onMouseDown.bind(this), // Bind the context of the class to the function
      false
    );
  }

  updateSlidePosition() {
    // Calculate the total distance that needs to be moved, considering slideWidth and the gap.
    let offset = -(this.slideWidth * this.currentSlide);

    // Calculate maximum offset to keep the last slide centered
    const maxOffset =
      -(this.slides.length - this.visibleSlides) * this.slideWidth;

    // Ensure offset doesn't exceed the maximum
    offset = Math.max(offset, maxOffset);

    this.sliderInner.style.transform = `translateX(${offset}px)`;

    // Remove active class from all slides
    this.slides.forEach((slide) => {
      slide.classList.remove("active");
    });

    // Add active class to the current slide
    this.slides[this.currentSlide].classList.add("active");
  }

  createSlider() {
    this.currentSlide = 0;
    this.visibleSlides = 4;
    // Set initial slideWidth
    this.sliderInner = document.querySelector(".results-slider__inner");
    this.slides = document.querySelectorAll(".results-slider__slide");

    this.slides.forEach((slide, index) => {
      slide.addEventListener("click", () => {
        // Remove active class from all slides
        this.slides.forEach((slide) => {
          slide.classList.remove("active");
        });

        // Add active class to clicked slide
        slide.classList.add("active");

        // Update currentSlide index
        this.currentSlide = index;

        // Update slide position
        // this.updateSlidePosition();
        this.onSlideClick(index);
      });
    });
  }

  onSlideClick(index) {
    // Deactivate all slides
    this.slides.forEach((slide) => {
      slide.classList.remove("active");
    });

    // Activate the clicked slide
    this.slides[index].classList.add("active");

    // Trigger the onClick function of the corresponding sphere
    this.correspondingSphere = this.spheres[index];
    this.correspondingSphere.onClick();
    // ... (add any additional behavior you want when a slide is clicked)
  }

  onMouseDown(event) {
    event.preventDefault();
    this.mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(this.mouse, this.camera);

    if (this.spheres && this.spheres.length > 0) {
      // Check if spheres array is defined and not empty
      const intersects = raycaster.intersectObjects(this.spheres);

      if (intersects.length > 0) {
        const intersectedSphere = intersects[0].object;
        const sphereIndex = this.spheres.indexOf(intersectedSphere); // Get the index of the intersected sphere
        intersectedSphere.onClick(sphereIndex); // Pass the index to the onClick method
      }
    }
  }

  createGlowingSpheres(positions, textures) {
    const glowShader = {
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }`,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float intensity;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
            // Calculate glow intensity based on the angle of the normal
            float normalIntensity = max(0.0, pow(0.5 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0));

            // Final intensity calculation combining normal intensity and the provided intensity uniform
            float finalIntensity = normalIntensity * intensity;

            // Set the glow color with the calculated intensity
            gl_FragColor = vec4(glowColor, finalIntensity);
        }`,
      uniforms: {
        glowColor: { value: new THREE.Color(0.3, 0.6, 1.0) },
        intensity: { value: 3.0 }, // Increased the intensity for a stronger glow effect
      },
    };

    const spheres = [];
    const glowingSpheres = [];
    const glowMaterial = new THREE.ShaderMaterial({
      vertexShader: glowShader.vertexShader,
      fragmentShader: glowShader.fragmentShader,
      uniforms: glowShader.uniforms,
      blending: THREE.AdditiveBlending, // Ensures the glow effect appears correctly
      side: THREE.BackSide,
      transparent: true, // Ensures the glow effect appears correctly
    });

    let sphereIndex = 1; // Start the index for sphere identification

    const textureLoader = new THREE.TextureLoader();

    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];
      const texturePath = textures[i];

      const circleGeometry = new THREE.CircleGeometry(1, 32);
      const texture = textureLoader.load(texturePath);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 16;
      texture.flipY = false;

      const circleMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
      circleMaterial.needsUpdate = true;

      const circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);
      circleMesh.position.copy(position);
      circleMesh.userData.sphereId = sphereIndex;
      sphereIndex++;
      circleMesh.userData.isSelected = false;

      circleMesh.rotation.set(1.5, 0, 0);

      // Create the glowing circle mesh
      const glowingCircle = new THREE.Mesh(circleGeometry, glowMaterial);
      // Position it slightly below the original mesh
      glowingCircle.rotation.set(1.5, 0, 3.2);
      glowingCircle.position.set(position.x, position.y - 0.05, position.z); // Adjust the '0.05' value as needed
      // Scale it up a bit
      // glowingCircle.scale.set(0.8, 0.8, 0.8);

      gsap.to(glowingCircle.scale, {
        x: window.innerWidth < 920 ? 0.62 : 0.42,
        y: window.innerWidth < 920 ? 0.62 : 0.42,
        z: window.innerWidth < 920 ? 0.62 : 0.42,
        duration: 1.5,
        ease: "power2.out",
      });

      // Link the glowingCircle to the circleMesh
      circleMesh.userData.glowingSphere = glowingCircle;



      circleMesh.onClick = () => {
        let tl = gsap.timeline(); // Create a new timeline

        document.querySelector(".results-swipe").style.display = "flex";

        if (this.selectedSphere && this.selectedSphere !== circleMesh) {
          // this.selectedSphere.scale.set(0.5, 0.5, 0.5);

          gsap.to(this.selectedSphere.scale, {
            x: window.innerWidth < 920 ? 0.45 : 0.3,
            y: window.innerWidth < 920 ? 0.45 : 0.3,
            z: window.innerWidth < 920 ? 0.45 : 0.3,
            duration: 0.5,
            ease: "power2.out",
          });

          // Remove the glowing sphere of the previously selected circle
          this.model.remove(this.selectedSphere.userData.glowingSphere);
          this.selectedSphere.userData.isSelected = false;

          // Get the current modal and slide it out to the left
          const currentModal = document.getElementById(
            "modal-sphere-" + this.selectedSphere.userData.sphereId
          );

          if (window.innerWidth < 920) {
            tl.to(currentModal, {
              translateY: "20%",
              duration: 0.5,
              ease: "power2.out",
              onComplete: function () {
                currentModal.style.display = "none";
              },
            });
          } else {
            tl.to(currentModal, {
              translateX: "-130%",
              duration: 0.5,
              ease: "power2.out",
              onComplete: function () {
                currentModal.style.display = "none";
              },
            });
          }
        }

        if (!circleMesh.userData.isSelected) {
          // circleMesh.scale.set(0.7, 0.7, 0.7);
          gsap.to(circleMesh.scale, {
            x: window.innerWidth < 920 ? 0.55 : 0.4,
            y: window.innerWidth < 920 ? 0.55 : 0.4,
            z: window.innerWidth < 920 ? 0.55 : 0.4,
            duration: 0.5,
            ease: "power2.out",
          });
          circleMesh.userData.isSelected = true;
          this.selectedSphere = circleMesh;

          // Add the glowing sphere of the clicked circle
          this.model.add(circleMesh.userData.glowingSphere);

          const modalId = "modal-sphere-" + circleMesh.userData.sphereId;
          const modalToShow = document.getElementById(modalId);
          modalToShow.style.display = "block";
          const innerElement = modalToShow.querySelector(".sidebar__inner");
          innerElement.scrollTop = 0;

          // Slide in the new modal from the left, after the previous animation completes

          if (window.innerWidth < 920) {
            tl.fromTo(
              modalToShow,
              { translateY: "20%" },
              { translateY: "0%", duration: 0.7, ease: "power2.out" }
            );
          } else {
            tl.fromTo(
              modalToShow,
              { translateX: "-130%" },
              { translateX: "0%", duration: 0.7, ease: "power2.out" }
            );
          }

          const sphereIndex = circleMesh.userData.sphereId - 1;

          const correspondingSlide = document.querySelectorAll(
            ".results-slider__slide"
          )[sphereIndex];
          correspondingSlide.click();
        }
      };

      spheres.push(circleMesh);
      glowingSpheres.push(glowingCircle);
      this.glowMaterial = glowMaterial;
    }

    gsap.fromTo(
      spheres.map((mesh) => mesh.scale), // Map to the scale property of each mesh
      { x: 0, y: 0, z: 0 },
      {
        x: window.innerWidth < 920 ? 0.45 : 0.3,
        y: window.innerWidth < 920 ? 0.45 : 0.3,
        z: window.innerWidth < 920 ? 0.45 : 0.3,
        duration: 1,
        stagger: 0.5,
        ease: "power2.out",
        delay: 3,
      }
    );
    this.glowingSpheres = glowingSpheres;
    return [...spheres];
  }



  setGridModel() {
	console.log("setGridModel");
  }


  setCityModel() {
	const textureLoader = new THREE.TextureLoader();
const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying float vViewZ;
    varying float vYPosition;
    
    void main() {
        vUv = uv;
        vPosition = position;
        vNormal = normal;
        vViewZ = -(modelViewMatrix * vec4(position, 1.0)).z;
        vYPosition = position.y;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform sampler2D matcap;
    uniform vec2 mouse;
    uniform vec3 lightColor;
    uniform float lightRadius;
    uniform vec2 resolution;
    uniform float fogDensity;
    uniform vec3 fogColor;
    uniform bool isSmallScreen;
    uniform float time;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying float vViewZ;
    varying float vYPosition;
    
    void main() {
        vec2 screenPosition = gl_FragCoord.xy / resolution;
        vec2 centeredMouse = mouse - 0.5;
        vec2 centeredScreen = screenPosition - 0.5;

        float morphFactor = 0.05 * sin(time * 1.0);
        vec2 morphedUv = vUv + vec2(morphFactor * cos(time + vPosition.y), morphFactor * sin(time + vPosition.x));

        float distance = length(centeredScreen - centeredMouse);

        vec2 edgeFactor;
        float lightIntensityMultiplier;
        float matcapMultiplier;
        
        if (isSmallScreen) {
            // Mobile-specific adjustments
            edgeFactor = vec2(1.1 - abs(screenPosition.x - 0.5), 1.1 - abs(screenPosition.y - 0.3));
            lightIntensityMultiplier = 0.5; // Reduced light intensity for mobile
            matcapMultiplier = 35.0; // Reduced matcap brightness for mobile
            distance *= 1.2; // Increase effective light radius on mobile
        } else {
            edgeFactor = 1.0 - abs(2.0 * screenPosition - 1.0);
            lightIntensityMultiplier = 1.0;
            matcapMultiplier = 30.0;
        }
        
        float edgeFalloff = pow(edgeFactor.x * edgeFactor.y, 1.0);

        float lightIntensity = 1.0 - smoothstep(0.0, lightRadius, distance);
        lightIntensity = mix(lightIntensity, 1.0, isSmallScreen ? 0.9 : 0.65); // More ambient light on mobile
        lightIntensity *= clamp(1.0 - vYPosition * 0.004, 0.0, 1.0);
        lightIntensity *= edgeFalloff * lightIntensityMultiplier;

        vec3 viewDir = normalize(vPosition - cameraPosition);
        vec3 reflectDir = reflect(viewDir, normalize(vNormal));
        vec2 matcapUV = (reflectDir.xy + vec2(0.1 + morphFactor, -0.1 - morphFactor)) * 0.5 + 0.5;

        vec4 matcapColor = texture2D(matcap, matcapUV);

        vec3 finalColor = mix(
            matcapColor.rgb * matcapMultiplier, 
            lightColor * lightIntensity * (isSmallScreen ? 5.0 : 10.0), 
            0.5
        );

        // Increase fog on mobile for a softer look
        float adjustedFogDensity = isSmallScreen ? fogDensity * 1.2 : fogDensity;
        float fogFactor = clamp(exp(-vViewZ * adjustedFogDensity * (0.65 - lightIntensity)), 0.0, 1.0);

        finalColor = mix(fogColor, finalColor, fogFactor);
        
        // Additional brightness adjustment for mobile
        if (isSmallScreen) {
            finalColor *= 0.7; // Reduce overall brightness
        }

        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

// Load texture and create shader material
textureLoader.load(
    `${import.meta.env.VITE_ASSETS_PATH}environment-map-2.jpg`,
    (texture) => {
        const dpr = window.devicePixelRatio || 1;
        
        // Create the extended matcap material
		const extendedMatcapMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                matcap: { value: texture },
                mouse: { value: new THREE.Vector2(0.5, 0.5) },
                lightColor: { value: new THREE.Color("blue") },
                lightRadius: { value: 0.15 },
                resolution: {
                    value: new THREE.Vector2(
                        window.innerWidth * dpr,
                        window.innerHeight * dpr
                    ),
                },
                fogDensity: { value: 1.0 },
                fogColor: { value: new THREE.Color(0x00000f) },
                isSmallScreen: { value: window.innerWidth < 500 },
                time: { value: 0.0 },
            },
        });

        // Check if the model and its first child exist
        if (this.model && this.model.children[0]) {
            this.model.children[0].material = extendedMatcapMaterial;
            this.cityMaterial = this.model.children[0].material;
        }
    }
);

this.scene.add(this.model);

// Handle window resize
const handleResize = () => {
    const dpr = window.devicePixelRatio || 1;
    if (this.model && this.model.children[0] && this.model.children[0].material) {
        this.model.children[0].material.uniforms.resolution.value.set(
            window.innerWidth * dpr,
            window.innerHeight * dpr
        );
        this.model.children[0].material.uniforms.isSmallScreen.value = window.innerWidth < 500;
    }
};

window.addEventListener('resize', handleResize);

// Mouse move handler with proper coordinate normalization
if (window.innerWidth > 500) {
    const handleMouseMove = (event) => {
        if (this.model && this.model.children[0] && this.model.children[0].material) {
            // Get the bounding rectangle of the canvas
            const rect = event.target.getBoundingClientRect();
            
            // Calculate normalized coordinates (0 to 1)
            const x = (event.clientX - rect.left) / rect.width;
            const y = 1 - (event.clientY - rect.top) / rect.height;
            
            this.model.children[0].material.uniforms.mouse.value.set(x, y);
        }
    };
    window.addEventListener("mousemove", handleMouseMove);
}
    //Add glowing spheres

    const texturePaths = [
      `${import.meta.env.VITE_ASSETS_PATH}mvp.png`,
      `${import.meta.env.VITE_ASSETS_PATH}amaro.png`,
      `${import.meta.env.VITE_ASSETS_PATH}lem-garcia-law.png`,
      `${import.meta.env.VITE_ASSETS_PATH}JR.png`,
      `${import.meta.env.VITE_ASSETS_PATH}tj-logo.png`,
      `${import.meta.env.VITE_ASSETS_PATH}friedland-logo.png`,

      //... add more paths as needed
    ];

    // Adding random glowing spheres
    // Define your manual positions
    const spherePositions = [
      new THREE.Vector3(
        window.innerWidth < 920 ? -6.5 : -5,
        5,
        window.innerWidth < 920 ? -4.0 : -4
      ),
      new THREE.Vector3(
        window.innerWidth < 920 ? -4 : -2.5,
        5,
        window.innerWidth < 920 ? -1.7 : -1.5
      ),
      new THREE.Vector3(
        window.innerWidth < 920 ? -4.1 : -1,
        5,
        window.innerWidth < 920 ? -5.8 : -3.5
      ),
      new THREE.Vector3(
        window.innerWidth < 920 ? -4.5 : -5.5,
        5,
        window.innerWidth < 920 ? -3.5 : -2
      ),
      new THREE.Vector3(
        window.innerWidth < 920 ? -7 : -6.5,
        5,
        window.innerWidth < 920 ? -1.5 : -3.5
      ),
      new THREE.Vector3(
        window.innerWidth < 920 ? -8 : -3,
        5,
        window.innerWidth < 920 ? -6.0 : -3.5
      ),
    ];

    this.spheres = this.createGlowingSpheres(spherePositions, texturePaths);
    this.spheres.forEach((sphere) => {
      this.model.add(sphere);
    });

    if (window.innerWidth < 920) {
      this.model.scale.set(0.7, 0.7, 0.7);
    } else {
      this.model.scale.set(0.8, 0.8, 0.8);
    }

    this.model.position.set(window.innerWidth < 920 ? 4 : 5, -4, -12);
    this.model.rotation.set(1.07, 0, 0);
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
            this.video.setAttribute("playsinline", true);
            this.video.autoplay = true;
            this.video.play();

            this.videoTexture = new THREE.VideoTexture(this.video);
            this.videoTexture.flipY = false;

            this.videoTexture.format = THREE.RGBFormat;

            //change color brightness

            this.videoTexture.minFilter = THREE.LinearFilter;
            this.videoTexture.magFilter = THREE.LinearFilter;

            this.videoTexture.generateMipmaps = false;

            this.videoTexture.colorSpace = THREE.SRGBColorSpace;

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
            // this.video2 = document.createElement('video');
            // this.video2.src = '../../../assets/videos/problem-1-final.mp4'
            // this.video2.muted = true;
            // this.video2.loop = true;
            // this.video2.controls = true;

            // this.video2.setAttribute('playsinline', true)
            // this.video2.autoplay = true;

            // this.video2.play();

            // this.videoTexture2 = new THREE.VideoTexture(this.video2);
            // this.videoTexture2.flipY = true;
            // this.videoTexture2.encoding = THREE.SRGBColorSpace;
            // this.videoTexture2.needsUpdate = true;

            // this.clone1.material = new THREE.MeshBasicMaterial({
            //   map: this.videoTexture2,
            //   transparent: true,
            //   opacity: 0,
            //   side: THREE.DoubleSide,
            // });

            this.video2 = document.createElement("video");
            this.video2.src = `${
              import.meta.env.VITE_ASSETS_PATH
            }videos/problem-1-final.mp4`;
            this.video2.muted = true;
            this.video2.loop = true;
            this.video2.controls = true;
            this.video2.setAttribute("playsinline", true);
            this.video2.autoplay = true;

            // Listen to the 'loadeddata' event to ensure the video has loaded
            this.video2.addEventListener("loadeddata", () => {
              this.videoTexture2 = new THREE.VideoTexture(this.video2);
              this.videoTexture2.flipY = true;

              this.videoTexture2.colorSpace = THREE.SRGBColorSpace;

              this.videoTexture2.needsUpdate = true;

              this.clone1.material = new THREE.MeshBasicMaterial({
                map: this.videoTexture2,
                transparent: true,
                opacity: 0,
                side: THREE.DoubleSide,
              });
            });

            this.videoTexture3 = {};
            // this.video3 = this.resources.items.problemTwo;
            this.video3 = document.createElement("video");
            this.video3.src = `${
              import.meta.env.VITE_ASSETS_PATH
            }videos/problem-2.mp4`;

            this.video3.muted = true;
            this.video3.loop = true;
            this.video3.controls = true;

            this.video3.setAttribute("playsinline", true);
            this.video3.autoplay = true;

            this.video3.addEventListener("loadeddata", () => {
              this.videoTexture3 = new THREE.VideoTexture(this.video3);
              this.videoTexture3.flipY = true;
              this.videoTexture3.colorSpace = THREE.SRGBColorSpace;

              this.videoTexture3.needsUpdate = true;

              this.clone2.material = new THREE.MeshBasicMaterial({
                map: this.videoTexture3,
                transparent: true,
                opacity: 0,
                side: THREE.DoubleSide,
              });
            });

            // this.video3.play();

            this.videoTexture4 = {};
            // this.video4 = this.resources.items.problemThree;
            this.video4 = document.createElement("video");
            this.video4.src = `${
              import.meta.env.VITE_ASSETS_PATH
            }videos/problem-3.mp4`;

            this.video4.muted = true;
            this.video4.loop = true;
            this.video4.controls = true;

            this.video4.setAttribute("playsinline", true);
            this.video4.autoplay = true;

            // this.video4.play();

            this.video4.addEventListener("loadeddata", () => {
              this.videoTexture4 = new THREE.VideoTexture(this.video4);
              this.videoTexture4.flipY = true;
              this.videoTexture4.colorSpace = THREE.SRGBColorSpace;

              this.videoTexture4.minFilter = THREE.LinearFilter;
              this.videoTexture4.magFilter = THREE.LinearFilter;

              this.clone3.material = new THREE.MeshBasicMaterial({
                map: this.videoTexture4,
                transparent: true,
                opacity: 0,
                side: THREE.DoubleSide,
              });
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
        this.video2.play();
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
      end: window.innerWidth < 920 ? "95%" : "65%",
      scrub: true,
      animation: this.scrollTl,
    });

    ScrollTrigger.create({
      trigger: ".about-video",
      start: "top top",
      end: "bottom bottom",
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

    // Handle spheres
    if (this.spheres) {
      this.spheres.forEach((sphere) => {
        this.model.remove(sphere); // remove the sphere from the model
        sphere.traverse((child) => {
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
      this.spheres = null; // reset the spheres array
    }

    if (this.glowingSpheres) {
      this.glowingSpheres.forEach((glowingSphere) => {
        this.model.remove(glowingSphere); // remove the glowing sphere from the model
        glowingSphere.traverse((child) => {
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
      this.glowingSpheres = null; // reset the glowingSpheres array
    }

    if (this.glowMaterial) {
      this.glowMaterial.dispose();
      this.glowMaterial = null;
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

    if (this.name === "city") {
      //   this.showTl.fromTo(
      //   	this.model.position,
      //   	{ z: -30 },
      //   	{ z: -13.5, duration: 3, ease: "power2.out" }
      //     );
      //     this.showTl.fromTo(
      //   	this.model.rotation,
      //   	{ x: 0.3 },
      //   	{ x: 1.07, duration: 3, ease: "power2.out" },
      //   	1.4
      //     );

      this.showTl.fromTo(
        this.model.position,
        { z: -11.5 },
        { z: -7, duration: 2, ease: "power2.out" }
      );
      this.showTl.fromTo(
        this.model.rotation,
        { x: -0.09 },
        {
          x: window.innerWidth < 920 ? 1.15 : 1.07,
          duration: 3,
          ease: "power2.out",
        },
        0.5
      );
      this.showTl.to(
        this.model.position,
        {
          z: window.innerWidth < 920 ? -8.5 : -8,
          duration: 2,
          ease: "power2.out",
          onComplete: () => {
            this.addSphereClickListener();
            this.eventEmitter.trigger("animationComplete");
          },
        },
        1
      );

      this.showTl.fromTo(
        ".results-slider h1",
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out" },
        3.5
      );
      this.showTl.fromTo(
        ".results-slider__slide",
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out", stagger: 0.2 },
        3.5
      );
      this.showTl.fromTo(
        ".mob-heading h1",
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, ease: "power2.out" },
        3.5
      );
    }
  }

  // Update
  update(time) {


    if (!this.model) return;
    if (
      this.m &&
      this.m.userData &&
      this.m.userData.shader &&
      this.m.userData.shader.uniforms
    ) {
      this.m.userData.shader.uniforms.uTime.value = time;
	  
    }

	
	


    // this.model.traverse(child => {
    //     if (child.isPoints && child.geometry instanceof THREE.BufferGeometry) {
    //         let positions = child.geometry.attributes.position.array;
    //         for (let i = 0; i < positions.length; i += 3) {
    //             positions[i] += (Math.random() - 0.5) * 0.001;     // Adjust X position
    //             positions[i + 1] += (Math.random() - 0.5) * 0.001; // Adjust Y position
    //             positions[i + 2] += (Math.random() - 0.5) * 0.001; // Adjust Z position
    //         }
    //         child.geometry.attributes.position.needsUpdate = true;

    //     }
    // });
  }
}

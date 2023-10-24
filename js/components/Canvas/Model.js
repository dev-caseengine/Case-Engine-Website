import * as THREE from "three";
import * as dat from "dat.gui";
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
      console.log("city model");
    }
  }

  addSphereClickListener() {
    this.renderer.domElement.addEventListener(
      "mousedown",
      this.onMouseDown.bind(this), // Bind the context of the class to the function
      false
    );
  }

  onMouseDown(event) {
    event.preventDefault();
    this.mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(this.mouse, this.camera); // Assuming your camera is named 'camera'
    const intersects = raycaster.intersectObjects(this.spheres); // This will check for intersections with your spheres

    if (intersects.length > 0) {
      const intersectedSphere = intersects[0].object;
      intersectedSphere.onClick(); // This will call the onClick method of the sphere
    }
  }

  createGlowingSpheres(positions, textures) {

	const glowShader = {
		vertexShader: `
			  varying vec3 vertexNormal;
  
			  void main() {
				  vertexNormal = normalize(normalMatrix * normal);
				  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 0.9 );
			  }`,
		fragmentShader: `
		  
			  varying vec3 vertexNormal;
  
			  void main() {
  
				  float intensity = pow(0.2 - dot( vertexNormal, vec3( 0.0, 0.0, 1.0 )), 3.0 );
  
				  gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0 ) * intensity;	
			  }`,
	  };

    const spheres = [];
	const glowingSpheres = [];
	const glowMaterial = new THREE.ShaderMaterial({
        vertexShader: glowShader.vertexShader,
        fragmentShader: glowShader.fragmentShader,
		blending: THREE.AdditiveBlending, // Ensures the glow effect appears correctly
        side: THREE.BackSide,
        transparent: true ,// Ensures the glow effect appears correctly
	
    });

    let sphereIndex = 1; // Start the index for sphere identification

    const textureLoader = new THREE.TextureLoader();

  

    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];
      const texturePath = textures[i];

      const circleGeometry = new THREE.CircleGeometry(1, 32);
      const texture = textureLoader.load(texturePath);
      texture.encoding = THREE.sRGBEncoding;
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

			gsap.to(glowingCircle.scale, { x: 0.8, y: 0.8, z: 0.8, duration: 1.5, ease: "power2.out"})
  
		    // Link the glowingCircle to the circleMesh
			circleMesh.userData.glowingSphere = glowingCircle;
	

	

			circleMesh.onClick = () => {
				let tl = gsap.timeline();  // Create a new timeline
			
				if (this.selectedSphere && this.selectedSphere !== circleMesh) {
					// this.selectedSphere.scale.set(0.5, 0.5, 0.5);

					gsap.to(this.selectedSphere.scale, { x: 0.5, y: 0.5, z: 0.5, duration: 0.5, ease: "power2.out"})
			
					// Remove the glowing sphere of the previously selected circle
					this.model.remove(this.selectedSphere.userData.glowingSphere);
					this.selectedSphere.userData.isSelected = false;
			
					// Get the current modal and slide it out to the left
					const currentModal = document.getElementById("modal-sphere-" + this.selectedSphere.userData.sphereId);
					tl.to(currentModal, {
						translateX: '-130%',
						duration: .5,
						ease: "power2.out",
						onComplete: function() {
							currentModal.style.display = "none";
						}
					});
				}
			
				if (!circleMesh.userData.isSelected) {
					// circleMesh.scale.set(0.7, 0.7, 0.7);
					gsap.to(circleMesh.scale, { x: 0.7, y: 0.7, z: 0.7, duration: 0.5, ease: "power2.out"})
					circleMesh.userData.isSelected = true;
					this.selectedSphere = circleMesh;
			
					// Add the glowing sphere of the clicked circle
					this.model.add(circleMesh.userData.glowingSphere);
			
					const modalId = "modal-sphere-" + circleMesh.userData.sphereId;
					const modalToShow = document.getElementById(modalId);
					modalToShow.style.display = "block";
			
					// Slide in the new modal from the left, after the previous animation completes
					tl.fromTo(modalToShow,
						{translateX: '-130%'},
						{translateX: '0%', duration: .7, ease: "power2.out"}
					);
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
        x: 0.5,
        y: 0.5,
        z: 0.5,
        duration: 1,
        stagger: 0.5,
        ease: "power2.out",
        delay: 3,
      }
    );
	this.glowingSpheres = glowingSpheres;
    return [...spheres];
  }

  setCityModel() {
	
    // this.model.children[0].material = this.m;

	console.log(this.model.children);

    // add fog
    // this.scene.fog = new THREE.Fog("#00000f", 14, 30);

    this.scene.fog = new THREE.Fog("#00000f", 2, 22);
    // this.scene.fog = new THREE.FogExp2('#00000f', 0.2);
    this.renderer.setClearColor(this.scene.fog.color);


	const textureLoader = new THREE.TextureLoader();

    // Load the matcap texture
    // textureLoader.load('../../../assets/matcap.png', (texture) => {
    //     // Create the Matcap material
    //     const matcapMaterial = new THREE.MeshMatcapMaterial({ matcap: texture });

    //     // Check if the model and its first child exist
    //     if (this.model && this.model.children[0]) {
    //         // Assign the matcap material to the first child of the model
    //         this.model.children[0].material = matcapMaterial;
    //     }
    // });




	// add point light
	// const pointLight = new THREE.PointLight('#ffffff', 0.1);
	// pointLight.position.set(0, 0, 20);
	// this.scene.add(pointLight);



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
		
					reflectVec = rotate(reflectVec, vec3(0.0, 0.0, 0.5), uTime * 0.01 / 15.0);
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

    this.scene.add(this.model);

    const texturePaths = [
      "../../../assets/person-1.png",
      "../../../assets/person-2.png",
      "../../../assets/person-3.png",
	  "../../../assets/person-4.png",
	  "../../../assets/person-5.png",
      //... add more paths as needed
    ];

    // Adding 3 random glowing spheres
    // Define your manual positions
    const spherePositions = [
      new THREE.Vector3(-1, 3, -5),
      new THREE.Vector3(-0.5, 3, -3),
      new THREE.Vector3(1.5, 3, -5),
	  new THREE.Vector3(-3.2, 3, -3.5),
	  new THREE.Vector3(-2, 3, -1),
    ];

	this.spheres = this.createGlowingSpheres(spherePositions, texturePaths);
	this.spheres.forEach((sphere) => {
	  this.model.add(sphere);
	});

    this.addSphereClickListener();

    this.model.scale.set(0.9, 0.9, 0.9);

    this.model.position.set(4, -4, -12);
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
            this.videoTexture.colorSpace = THREE.sRGBColorSpace;
            this.videoTexture.encoding = THREE.sRGBEncoding;

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
            this.video2.src = "../../../assets/videos/problem-1-final.mp4";
            this.video2.muted = true;
            this.video2.loop = true;
            this.video2.controls = true;
            this.video2.setAttribute("playsinline", true);
            this.video2.autoplay = true;

            // Listen to the 'loadeddata' event to ensure the video has loaded
            this.video2.addEventListener("loadeddata", () => {
              this.videoTexture2 = new THREE.VideoTexture(this.video2);
              this.videoTexture2.flipY = true;
              this.videoTexture2.colorSpace = THREE.sRGBColorSpace;
              this.videoTexture2.encoding = THREE.sRGBEncoding;
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
            this.video3.src = "../../../assets/videos/problem-2.mp4";

            this.video3.muted = true;
            this.video3.loop = true;
            this.video3.controls = true;

            this.video3.setAttribute("playsinline", true);
            this.video3.autoplay = true;

            this.video3.addEventListener("loadeddata", () => {
              this.videoTexture3 = new THREE.VideoTexture(this.video3);
              this.videoTexture3.flipY = true;
              this.videoTexture3.colorSpace = THREE.sRGBColorSpace;
              this.videoTexture3.encoding = THREE.sRGBEncoding;
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
            this.video4.src = "../../../assets/videos/problem-3.mp4";

            this.video4.muted = true;
            this.video4.loop = true;
            this.video4.controls = true;

            this.video4.setAttribute("playsinline", true);
            this.video4.autoplay = true;

            // this.video4.play();

            this.video4.addEventListener("loadeddata", () => {
              this.videoTexture4 = new THREE.VideoTexture(this.video4);
              this.videoTexture4.flipY = true;
              this.videoTexture4.colorSpace = THREE.sRGBColorSpace;
              this.videoTexture4.encoding = THREE.sRGBEncoding;
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
	console.log('hide')
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
        { z: -15.3 },
        { z: -7, duration: 3, ease: "power2.out" }
      );
      this.showTl.fromTo(
        this.model.rotation,
        { x: -0.09 },
        { x: 1.07, duration: 3, ease: "power2.out" },
        1
      );
      this.showTl.to(
        this.model.position,
        { z: -12.5, duration: 2, ease: "power2.out" },
        2
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

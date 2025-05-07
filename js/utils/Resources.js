import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import EventEmitter from "./EventEmitter";
import sources from "../sources";

export default class Resources extends EventEmitter {
  constructor() {
    super();
    //Options
    this.sources = sources;
    //Setup

    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.dracoLoader = new DRACOLoader();
    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
    this.loaders.dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.5/");
    this.loaders.dracoLoader.setDecoderConfig({ type: "js" });
    this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
  }

  startLoading() {
    //load each source
    for (const source of this.sources) {
      if (source.type === "gltfModel") {
        this.loaders.gltfLoader.load(
          source.path,
          (file) => {
            this.sourceLoaded(source, file);
          },
          undefined,
        );
      } else if (source.type === "texture") {
        this.loaders.textureLoader.load(
          source.path,
          (file) => {
            this.sourceLoaded(source, file);
          },
          undefined,
        );
      } else if (source.type === "cubeTexture") {
        this.loaders.cubeTextureLoader.load(
          source.path,
          (file) => {
            this.sourceLoaded(source, file);
          },
          undefined,
        );
      } else if (source.type === "video") {
		const video = document.createElement("video");
		video.id = source.name;
		video.src = source.path;
	  
		// Attributes (required for iOS/Instagram)
		video.autoplay = true;
		video.muted = true;
		video.loop = true;
		video.playsInline = true;
		video.setAttribute("autoplay", "");
		video.setAttribute("muted", "");
		video.setAttribute("loop", "");
		video.setAttribute("playsinline", "");
		video.setAttribute("webkit-playsinline", "");
		video.setAttribute("preload", "auto");
	  
		// Hide video element but keep in DOM for compliance
		video.style.display = "none";
		document.body.appendChild(video);
	  
		// iOS autoplay fallback — wait for gesture if needed
		const tryPlay = () => {
		  const playPromise = video.play();
		  if (playPromise !== undefined) {
			playPromise
			  .then(() => {
				this.sourceLoaded(source, video);
			  })
			  .catch(() => {
				const onUserGesture = () => {
				  video.play().then(() => {
					this.sourceLoaded(source, video);
					window.removeEventListener("touchstart", onUserGesture);
					window.removeEventListener("click", onUserGesture);
				  });
				};
				window.addEventListener("touchstart", onUserGesture);
				window.addEventListener("click", onUserGesture);
			  });
		  } else {
			this.sourceLoaded(source, video);
		  }
		};
	  
		// Wait for metadata or data before trying to play
		video.addEventListener("loadeddata", tryPlay);
		video.load();
	  } else if (source.type === "image") {
        const image = new Image();
        image.src = source.path;
        image.addEventListener("load", () => {
          this.sourceLoaded(source, image);
        });
      }
    }
  }
  sourceLoaded(source, file) {
    this.items[source.name] = file;
    this.loaded++;
	
    this.trigger("progress", [this.loaded, this.toLoad]);
  }

}

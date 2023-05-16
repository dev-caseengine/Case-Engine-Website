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
    // this.loaders.dracoLoader.setDecoderPath(
    //   "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
    // );
    this.loaders.dracoLoader.setDecoderPath("../../assets/draco/");
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
          (error) => {
            this.sourceError(source, error);
          }
        );
      } else if (source.type === "texture") {
        this.loaders.textureLoader.load(
          source.path,
          (file) => {
            this.sourceLoaded(source, file);
          },
          undefined,
          (error) => {
            this.sourceError(source, error);
          }
        );
      } else if (source.type === "cubeTexture") {
        this.loaders.cubeTextureLoader.load(
          source.path,
          (file) => {
            this.sourceLoaded(source, file);
          },
          undefined,
          (error) => {
            this.sourceError(source, error);
          }
        );
      } else if (source.type === "video") {
        const video = document.createElement("video");
        video.id = source.name;
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
          video.autoplay = true;
          video.muted = true;
          video.loop = true;
          video.playsinline = true;d
        }

        video.src = source.path;
        video.addEventListener("loadeddata", () => {
          this.sourceLoaded(source, video);
        });
        video.addEventListener("error", (error) => {
          this.sourceError(source, error);
        });
      } else if (source.type === "image") {
        const image = new Image();
        image.src = source.path;
        image.addEventListener("load", () => {
          this.sourceLoaded(source, image);
        });
        image.addEventListener("error", (error) => {
          this.sourceError(source, error);
        });
      }
    }
  }
  sourceLoaded(source, file) {
    this.items[source.name] = file;
    this.loaded++;

    console.log(source.name, (this.loaded / this.toLoad) * 100);

    // console.log(source.name, this.loaded / this.toLoad * 100);

    this.trigger("progress", [this.loaded, this.toLoad]);
  }

  sourceError(source, error) {
    console.error(`Error loading asset: ${source.name}`, error);
  }
}

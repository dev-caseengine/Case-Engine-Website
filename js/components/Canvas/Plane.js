import * as THREE from "three";
const vertexShader = `
  uniform float time;
  varying vec2 vUv;
  varying vec3 vPosition;

  void main () {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                * 43758.5453123);
}

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

void main() {
	float n = noise(vPosition * vec3(2.0, 0.4, 2.0) + time);
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0 - n);
}
`;
export default class Plane {
  constructor(obj) {
    this.scene = obj.scene;
    this.camera = obj.camera;
    this.renderer = obj.renderer;
    this.sizes = obj.sizes;
    this.init();
  }

  init() {
    const { width, height } = this.sizes;
    const aspectRatio = width / height;

    // Create the plane geometry
    this.geometry = new THREE.SphereGeometry(aspectRatio * 2, 32, 32);

    // Create the material with the provided vertexShader and fragmentShader
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector4() },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      //   wireframe: true
    });

    // Create the mesh
    this.mesh = new THREE.Mesh(this.geometry, this.material);
	this.mesh.name = "backgroundPlane";
	

    // Set position and scale
    this.mesh.position.set(0, 0, -6);
    this.mesh.scale.set(width, height, 1);

	this.mesh.userData.isBackground = true;

    // Add the mesh to the scene
    this.scene.add(this.mesh);



  }

  // Update function
  update(time) {
    // Update the time uniform of the material
    this.material.uniforms.time.value = time * 0.001;

  }
}

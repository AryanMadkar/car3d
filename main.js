import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.z = 6;
camera.position.y = 2;
const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  shadowMap: THREE.PCFSoftShadowMap,
  shadowMapBias: 0.0005,
  shadowMapRadius: 0.05,
  physicallyCorrectLights: true,
  toneMapping: THREE.ACESFilmicToneMapping,
  toneMappingExposure: 1,
  outputEncoding: THREE.sRGBEncoding,
  gammaFactor: 2.2,
  toneMappingWhitePoint: 1.1,
  maxSamples: 4,
  maxAnisotropy: 16,
  minFilter: THREE.LinearMipmapLinearFilter,
  magFilter: THREE.LinearMipmapLinearFilter,
  alpha: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;

const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

new RGBELoader().load("./sam.hdr", function (texture) {
  const envmap = pmremGenerator.fromEquirectangular(texture).texture;
  scene.background = envmap;
  scene.environment = envmap;
  texture.dispose();
  pmremGenerator.dispose();
  const loader = new GLTFLoader();
  loader.load(
    "./scene.gltf",
    (gltf) => {
      scene.add(gltf.scene);
    },
    undefined,
    (error) => {
      console.error("error adding model", error);
    }
  );
});

let swim = 0;
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const loader = new GLTFLoader();
loader.load(
  "./scene.gltf",
  (gltf) => {
    scene.add(gltf.scene);
  },
  undefined,
  (error) => {
    console.error("error adding model", error);
  }
);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  swim += 0.01;

  renderer.render(scene, camera);
}

animate();

import './scss/app.scss';
import * as THREE from 'three';
import {gsap} from 'gsap';
import * as dat from 'dat.gui';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import basecolor from './assets/carbon/basecolor.jpg';
import normal from './assets/carbon/normal.jpg';
import roughness from './assets/carbon/roughness.jpg';
import metallic from './assets/carbon/metallic.jpg';
import ambient from './assets/carbon/ambientOcclusion.jpg';
import height from './assets/carbon/height.png';

// Create a canvas
const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl');
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
// Handle window resize
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  // Update Renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
// Init a THREE scene
const scene = new THREE.Scene();

// Textures
const textureLoader = new THREE.TextureLoader();
const baseTexture = textureLoader.load(basecolor);
const heightTexture = textureLoader.load(height);
const normalTexture = textureLoader.load(normal);
const roughnessTexture = textureLoader.load(roughness);
const ambientTexture = textureLoader.load(ambient);
const metallicTexture = textureLoader.load(metallic);

// Add geometries & material
const geometry = new THREE.SphereGeometry(0.075, 64, 64);
const material = new THREE.MeshPhysicalMaterial({
  color: 'lightblue',
  map: baseTexture,
  roughness: 0.75,
  metalness: 0.2,
  aoMap: ambientTexture,
  aoMapIntensity: 20,
  normalMap: normalTexture,
  displacementMap: heightTexture,
  displacementScale: 0.01,
  reflectivity: 1,
  clearcoat: 1,
  clearcoatMap: normalTexture,
  clearcoatRoughness: 0.25,
  metalnessMap: metallicTexture,
  roughnessMap: roughnessTexture,
  clearcoatNormalMap: normalTexture,
  clearcoatNormalScale: new THREE.Vector2(2, 2),
  sheen: new THREE.Color('lightblue'),
});
geometry.setAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv.array, 2));
const group = new THREE.Group();
const grid = 4;
for (let i = 0; i < grid; i++) {
  for (let j = 0; j < grid; j++) {
    for (let k = 0; k < grid; k++) {
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = i * 0.4;
      cube.position.y = j * 0.4;
      cube.position.z = k * 0.4;
      cube.castShadow = true;
      cube.receiveShadow = true;
      group.add(cube);
    }
  }
}

const center = new THREE.Vector3();
new THREE.Box3().setFromObject(group).getCenter(center);
group.position.copy(center).multiplyScalar(-1);

const axesHelper = new THREE.AxesHelper(5);

// lights
const ambientLight = new THREE.AmbientLight('white', 0.2);
const directionalLight = new THREE.DirectionalLight('white', 0.4);
directionalLight.castShadow = true;
directionalLight.position.set(1, 2, 1);
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 4;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.radius = 8;

const lightHelper = new THREE.DirectionalLightHelper(directionalLight);
const lightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
lightHelper.visible = false;
lightCameraHelper.visible = false;
axesHelper.visible = false;

// Add to scene
scene.add(axesHelper, group, ambientLight, directionalLight, lightHelper, lightCameraHelper);
// Add camera and define it's Z axis and FOV
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 100);
camera.position.z = 6;

// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = true;

// Render scene & camera
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.render(scene, camera);
renderer.setClearColor('#01062D');

const clock = new THREE.Clock();

const childrens = group.children.map((child) => child.scale);
const rotations = group.children.map((child) => child.rotation);

console.log(gsap.ticker.time);
gsap.to(childrens, {
  y: 2,
  x: 2,
  z: 2,
  duration: 1.75,
  stagger: {
    yoyo: true,
    repeat: -1,
    grid: [4, 4],
    from: 'start',
    amount: 1.75,
  },
});

gsap.ticker.add((time) => {
  gsap.to(rotations, {
    y: Math.PI + time / 2,
    x: Math.cos(time),
  });
  renderer.render(scene, camera);
  controls.update();
});

// const tick = () => {
//   const elapsedTime = clock.getElapsedTime();
//   gsap.to(childrens, {
//     y: Math.sin(elapsedTime),
//     //z: Math.sin(2),
//     yoyo: true,
//     stagger: {
//       from: 'start',
//       amount: 1.25
//     },
//   })
//   renderer.render(scene, camera);
//   controls.update();
//   window.requestAnimationFrame(tick);
// };

// tick();

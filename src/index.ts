import './scss/app.scss';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

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

// Add geometries & material
const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshNormalMaterial();
let mesh: THREE.Mesh = null;
//const mesh = new THREE.Mesh(geometry, material);
const radius = 9;
const xRad = 9;
const yRad = 6;
const base = 0;
let angle = 0;
const total = 20;
const slice = (Math.PI * 2) / total;

for (let i = 0; i < total; i++) {
  angle = i * slice;
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = base + Math.cos(angle) * radius;
  mesh.position.y = base + Math.sin(angle) * radius;
  scene.add(mesh);
}
//

// const center = new THREE.Vector3();
// new THREE.Box3().setFromObject(group).getCenter(center);
// group.position.copy(center).multiplyScalar(-1);

const axesHelper = new THREE.AxesHelper(5);

// lights
axesHelper.visible = true;

// Add to scene
scene.add(axesHelper);
// Add camera and define it's Z axis and FOV
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 100);
camera.position.z = 45;

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

const tick = () => {
  const time = clock.getElapsedTime();
  // const x = base + Math.cos(angle + time * 4) * radius;
  // const y = base + Math.sin(angle + time * 4) * radius;
  // const x = base + Math.cos(angle + time * 2) * xRad;
  // const y = base + Math.sin(angle + time * 6) * yRad;
  // mesh.position.y = y;
  // mesh.position.x = x;
  // mesh.scale.x = y;
  // mesh.scale.y = y;
  // mesh.scale.z = y;

  renderer.render(scene, camera);
  controls.update();
  window.requestAnimationFrame(tick);
};

tick();

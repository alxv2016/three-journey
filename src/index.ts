import './scss/app.scss';
import * as THREE from 'three';
import {gsap} from 'gsap';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

interface DocumentFullScreen extends HTMLDocument {
  webkitFullscreenElement?: Element;
}

// Canvas
const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl');
// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
// full screen resizing
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
// Toggle fullscreen
window.addEventListener('dblclick', () => {
  const webkitDoc = document as DocumentFullScreen;
  !document.fullscreenElement ? canvas.requestFullscreen() : document.exitFullscreen();
  //!webkitDoc.webkitFullscreenElement ? canvas.requestFullscreen() : document.exitFullscreen();
});
// Scene
const scene = new THREE.Scene();
// Groups
// const group = new THREE.Group();
// scene.add(group);

// const cube1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));

// const cube2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0x0ff000}));
// cube2.position.x = -2;

// const cube3 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
// cube3.position.x = 2;

// group.add(cube1);
// group.add(cube2);
// group.add(cube3);

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: false});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// // Positions
// mesh.position.set(0.7, -0.6, 1);
// mesh.scale.set(2, 0.5, 0.5);

// mesh.rotation.reorder('YXZ');
// mesh.rotation.y = Math.PI * 0.25;
// mesh.rotation.x = Math.PI * 0.25;
// Axes helper
// const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);

// Camera
// last two values is camera's field of view to reduce rendering of far away objects
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
//const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1 , 100)
camera.position.z = 5;
// camera.position.y = 2;
// camera.position.z = 2;
// console.log(camera.position.length())
//camera.lookAt(mesh.position);
scene.add(camera);

// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;

// Renderer
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height);
// Set pixel ratio to render only between 1 - 2 for performant only on high densitity displays
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

// Animations
const clock = new THREE.Clock();
// gsap.to(mesh.rotation, {
//   duration: 4,
//   ease: 'none',
//   y: Math.PI * 2,
//   repeat: -1,
// });
gsap.ticker.add(() => {
  const elapsedTime = clock.getElapsedTime();
  controls.update();
  renderer.render(scene, camera);
});

// tick();

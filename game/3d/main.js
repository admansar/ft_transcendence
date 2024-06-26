// import * as THREE from 'three';

const width = window.innerWidth
const height = window.innerHeight

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('#00b140')

// Camera
const fov = 45 // AKA Field of View
const aspect = width / height
const near = 0.1 // the near clipping plane
const far = 100 // the far clipping plane
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.set(0, 0, 10)

// Renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(width, height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Creating a cube
const geometry = new THREE.BoxGeometry(2, 2, 2)
const material = new THREE.MeshBasicMaterial({ wireframe: true })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// Rendering the scene
function animate() {
    requestAnimationFrame(animate)
    cube.rotation.x += 0.005
    cube.rotation.y += 0.01
    renderer.render(scene, camera)
  }
const container = document.querySelector('#threejs-container')
container.append(renderer.domElement)
renderer.render(scene, camera)
animate()
// import * as THREE from 'three';

const width = window.innerWidth
const height = window.innerHeight


// Cube details
const cube_dimensions = { x: 2, y: 2, z: 2 }
const cube_position = { x: 0, y: 0, z: 0 }

// light details
const light_position = { x: 2.5, y: 2, z: 2 }
const light_color = 0xffffff
const light_intensity = 0.3

// Camera details
const camera_position = { x: 0, y: 0, z: 10 }
const camera_fov = 45
const camera_aspect = width / height
const camera_near = 0.1
const camera_far = 100

// plane details
const plane_position = { x: 0, y: -1.75, z: 0 }
const plane_color = 0xffffff
const plane_dimensions = { x: 100, y: 20 }

// sphere details
const sphere_dimensions = { radius: 1, widthSegments: 32, heightSegments: 32 }
const sphere_position = { x: 0, y: 0, z: 0 }
const sphere_color = 0xff0000

const point_light_position = { x: 10, y: 5, z: 5 }



const scene_color = '#000000'


function init_scene(scene_color)
{
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(scene_color)

    return scene
}

// Creating a cube
function create_cube (cube_dimensions, cube_position, cube_color)
{
    const geometry = new THREE.BoxGeometry(cube_dimensions.x, cube_dimensions.y, cube_dimensions.z)
    const material = new THREE.MeshStandardMaterial({ color: cube_color })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.set(cube_position.x, cube_position.y, cube_position.z)
    cube.castShadow = true
    cube.receiveShadow = true
    scene.add(cube)
    return cube
}

function create_sphere(sphere_dimensions, sphere_position, sphere_color)
{
    const geometry = new THREE.SphereGeometry(sphere_dimensions.radius, sphere_dimensions.widthSegments, sphere_dimensions.heightSegments)
    const material = new THREE.MeshStandardMaterial({ color: sphere_color })
    const sphere = new THREE.Mesh(geometry, material)
    sphere.position.set(sphere_position.x, sphere_position.y, sphere_position.z)
    sphere.castShadow = true
    sphere.receiveShadow = true
    scene.add(sphere)
    return sphere
}

// Creating a light
function create_light(light_position, light_color, light_intensity, point_light_position)
{
    const ambientLight = new THREE.AmbientLight(light_color, light_intensity)
    scene.add(ambientLight)

    const light = new THREE.DirectionalLight(light_color, light_intensity)
    const pointLight = new THREE.PointLight(light_color, 0.5)
    pointLight.position.set(point_light_position.x, point_light_position.y, point_light_position.z)
    scene.add(pointLight)
    light.position.set(light_position.x, light_position.y, light_position.z)
    light.castShadow = true
    light.shadow.mapSize.width = 512
    light.shadow.mapSize.height = 512
    light.shadow.camera.near = 0.5
    light.shadow.camera.far = 100
    scene.add(light)
    return {light: light, point_light_position: pointLight.position, ambientLight: ambientLight}
}

function camera_init(camera_position, fov, aspect, near, far)
{
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(camera_position.x, camera_position.y, camera_position.z)
    return camera
}

function light_helper(light)
{
    const helper = new THREE.DirectionalLightHelper(light)
    scene.add(helper)
    return helper
}

function create_plane(plane_position, plane_color, plane_dimensions)
{
    const planeGeometry = new THREE.PlaneGeometry(plane_dimensions.x, plane_dimensions.y)
    const plane = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial({ color: plane_color }))
    plane.rotateX(-Math.PI / 2)  // rotate the plane to be horizontal
    plane.position.y = plane_position.y
    plane.receiveShadow = true
    scene.add(plane)
    return plane
}

function create_renderer(width, height)
{
    const renderer = new THREE.WebGL1Renderer()
    renderer.setSize(width, height)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    return renderer
}


// init Scene
const scene = init_scene(scene_color)
const camera = camera_init(camera_position, camera_fov, camera_aspect, camera_near, camera_far)
const renderer = create_renderer(width, height)
const light = create_light(light_position, light_color, light_intensity, point_light_position)
// const helper = light_helper(light)
const plane = create_plane(plane_position, plane_color, plane_dimensions)
// const cube = create_cube(cube_dimensions, cube_position, 0x87ce00)
const sphere = create_sphere(sphere_dimensions, sphere_position, '#00ffff')



// Rendering the scene
function animate() {
    requestAnimationFrame(animate)
    // cube.rotation.x += 0.005
    // cube.rotation.y += 0.01
    // cube.rotation.z += 0.01
    sphere.position.y += Math.sin(Date.now() * 0.002) * 0.01
    renderer.render(scene, camera)
}

const container = document.querySelector('#threejs-container')
container.append(renderer.domElement)
renderer.render(scene, camera)


animate()

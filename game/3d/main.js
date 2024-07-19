import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const width = window.innerWidth
const height = window.innerHeight


//Ball

const GRAVITY = 9.8
const BOUNCE = 0.9
const vector_directeur = {x: 0, y: 1, z: -3}

const ball_init_pos = {x: 0, y: 0.3, z: 1.5}


// paddle hand details
const paddle_hand_dimensions = { radiusTop: 0.02, radiusBottom: 0.02, height: 0.13, radialSegments: 32 }
const paddle_hand_position = { x: 0, y: 0.05, z: 0 }
const paddle_hand_color = 0xD5A35E
const paddle_hand_rotation = { x: 0, y: 0, z: 0 }

// paddle head details
const paddle_head_dimensions = { radiusTop: 0.1, radiusBottom: 0.1, height: 0.02, radialSegments: 32 }
const paddle_head_position = { x: 0, y: 0.17, z: 0 }
const paddle_head_color = 0xff0000
const paddle_head_rotation = { x: 1.55, y: 0, z: 0 }


// Cube details
const table_dimensions = { x: 1.52, y: 0.03, z: 2.74 }
const table_position = { x: 0, y: 0, z: 0 }
const table_rotation = { x: 0, y: 0, z: 0 }

const net_dimensions = { x: table_dimensions.x, y: 0.152, z: 0.03 }
const net_position = { x: 0, y: 0.06, z: 0 }
const net_rotation = { x: 0, y: 0, z: 0 }

// light details
const light_position = { x: 10, y: 10, z: -10 }
const light_color = 0xffffff
const light_intensity = 0.3

// Camera details
const camera_position = { x: 0, y: 1, z: 3 }
const camera_fov = 45
const camera_aspect = width / height
const camera_near = 0.1
const camera_far = 100

// plane details
// const plane_color = 0xffffff
// const plane_dimensions = { x: 100, y: 20 }

// sphere details
// const sphere_dimensions = { radius: 1, widthSegments: 32, heightSegments: 32 }
// const sphere_position = { x: 0, y: 0, z: 0 }
// const sphere_color = 0xff0000

const point_light_position = { x: 10, y: 5, z: 5 }



const scene_color = 0x000000


function init_scene(scene_color)
{
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(scene_color)

    return scene
}

// Creating a cube
function create_cube (cube_dimensions, cube_position, cube_rotation, cube_color)
{
    const geometry = new THREE.BoxGeometry(cube_dimensions.x, cube_dimensions.y, cube_dimensions.z)
    const material = new THREE.MeshStandardMaterial({ color: cube_color })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.set(cube_position.x, cube_position.y, cube_position.z)
    cube.rotation.set(cube_rotation.x, cube_rotation.y, cube_rotation.z)
    cube.castShadow = true
    cube.receiveShadow = true
    scene.add(cube)
    return cube
}

function create_net(net_dimensions, net_position, net_rotation, net_color)
{
    const geometry = new THREE.BoxGeometry(net_dimensions.x, net_dimensions.y, net_dimensions.z)
    const material = new THREE.MeshStandardMaterial({ color: net_color, opacity: 0.7, transparent : true})
    const net = new THREE.Mesh(geometry, material)
    net.position.set(net_position.x, net_position.y, net_position.z)
    net.rotation.set(net_rotation.x, net_rotation.y, net_rotation.z)
    net.castShadow = true
    net.receiveShadow = true
    scene.add(net)
    return net

}

function create_sphere(sphere_dimensions, sphere_position, sphere_color)
{
    const geometry = new THREE.SphereGeometry(sphere_dimensions.radius, sphere_dimensions.widthSegments, sphere_dimensions.heightSegments)
    const material = new THREE.MeshStandardMaterial({ color: sphere_color, transparent : true})
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
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    return renderer
}

function create_table_cadre (cube_dimensions, cube_position, cube_rotation, cube_color)
{
    const middle_line_dimensions = { x: cube_dimensions.x / 100, y: cube_dimensions.y, z: cube_dimensions.z }
    const middle_line_position = { x: cube_position.x, y: cube_position.y, z: cube_position.z }
    const middle_line  = create_cube(middle_line_dimensions, middle_line_position, cube_rotation, cube_color)
    scene.add(middle_line)

	const front_line_dimensions = { x: cube_dimensions.x + 0.015, y: cube_dimensions.y, z: cube_dimensions.z / 100 }
	const front_line_position = { x: cube_position.x , y: cube_position.y, z: cube_position.z + table_dimensions.z / 2}
	const front_line  = create_cube(front_line_dimensions, front_line_position, cube_rotation, cube_color)
	scene.add(front_line)


	const left_side_line_dimensions = {...middle_line_dimensions}
	const left_side_line_position = { x: cube_position.x - table_dimensions.x / 2, y: cube_position.y, z: cube_position.z }

	const left_side_line  = create_cube(left_side_line_dimensions, left_side_line_position, cube_rotation, cube_color)
	scene.add(left_side_line)

	const right_side_line_dimensions = {...middle_line_dimensions}
	const right_side_line_position = { x: cube_position.x + table_dimensions.x / 2, y: cube_position.y, z: cube_position.z }

	const right_side_line  = create_cube(right_side_line_dimensions, right_side_line_position, cube_rotation, cube_color)
	scene.add(right_side_line)

	const back_line_dimensions = {...front_line_dimensions}
	const back_line_position = { x: cube_position.x , y: cube_position.y , z: cube_position.z - table_dimensions.z / 2 }
	const back_line  = create_cube(back_line_dimensions, back_line_position, cube_rotation, cube_color)
	scene.add(back_line)

	 return {middle_line: middle_line, front_line: front_line, left_side_line: left_side_line, right_side_line: right_side_line, back_line: back_line}
}

function create_cylinder (cylinder_dimensions, cylinder_position, cylinder_color, cylinder_rotation)
{
    const cylinder = new THREE.CylinderGeometry(cylinder_dimensions.radiusTop, cylinder_dimensions.radiusBottom, cylinder_dimensions.height, cylinder_dimensions.radialSegments)
    const material = new THREE.MeshStandardMaterial({ color: cylinder_color })
    const cylinder_mesh = new THREE.Mesh(cylinder, material)
    cylinder_mesh.position.set(cylinder_position.x, cylinder_position.y, cylinder_position.z)
    cylinder_mesh.rotation.set(cylinder_rotation.x, cylinder_rotation.y, cylinder_rotation.z)
    scene.add(cylinder_mesh)
    cylinder_mesh.castShadow = true
    cylinder_mesh.receiveShadow = true
    return cylinder_mesh
}

function create_paddle_hand (paddle_hand_dimensions, paddle_hand_position, paddle_hand_color, paddle_hand_rotation)
{
    const paddle_hand = create_cylinder(paddle_hand_dimensions, paddle_hand_position, paddle_hand_color, paddle_hand_rotation)
    return paddle_hand
}

function create_paddle_head (paddle_head_dimensions, paddle_head_position, paddle_head_color, paddle_head_rotation)
{
    const paddle_head = create_cylinder(paddle_head_dimensions, paddle_head_position, paddle_head_color, paddle_head_rotation)
    return paddle_head
}


// init Scene
const scene = init_scene(scene_color)

const camera = camera_init(camera_position, camera_fov, camera_aspect, camera_near, camera_far)
const renderer = create_renderer(width, height)
const light = create_light(light_position, light_color, light_intensity, point_light_position)
//const helper = light_helper(light)

const axisHelper = new THREE.AxesHelper(100, 100, 100);
scene.add(axisHelper);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

//const plane = create_plane(plane_position, plane_color, plane_dimensions)
const table = create_cube(table_dimensions, table_position, table_rotation,  0x51E338)
const table_cadre = create_table_cadre(table_dimensions, table_position, table_rotation,  0xffffff)
const net = create_net(net_dimensions, net_position, net_rotation,  0xffffff) // dak l3iba li bkhit f lwest d table
//const sphere = create_sphere(sphere_dimensions, sphere_position, '#00ffff')




let ping_pong_table = new THREE.Object3D()

ping_pong_table.add (table)
ping_pong_table.add (table_cadre.middle_line)
ping_pong_table.add (table_cadre.front_line)
ping_pong_table.add (table_cadre.left_side_line)
ping_pong_table.add (table_cadre.right_side_line)
ping_pong_table.add (table_cadre.back_line)
ping_pong_table.add (net)

scene.add (ping_pong_table)

const paddle_hand = create_paddle_hand(paddle_hand_dimensions, paddle_hand_position, paddle_hand_color, paddle_hand_rotation)
const paddle_head = create_paddle_head(paddle_head_dimensions, paddle_head_position, paddle_head_color, paddle_head_rotation)

let paddle = new THREE.Object3D()
paddle.add(paddle_hand)
paddle.add(paddle_head)
//scene.add(paddle)

//paddle.position.set(0, 0.1, 1)



let opp_paddle = paddle.clone()
scene.add (opp_paddle)


opp_paddle.position.set(0, 0.1, -1)


// WORLD
const world = new CANNON.World();
world.gravity.set(0, -GRAVITY,0);
world.broadphase = new CANNON.NaiveBroadphase();
world.solver.iterations = 10;

// Ball
const radius = 0.02;// m
const ballGeometry = new THREE.SphereGeometry(radius, 32, 32);
const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
ballMesh.castShadow = true;
ballMesh.receiveShadow = true;
scene.add(ballMesh);

const ballBody = new CANNON.Body({
    mass: 1e-6, // kg
    position: new CANNON.Vec3(ball_init_pos.x, ball_init_pos.y, ball_init_pos.z), //m
    shape: new CANNON.Sphere(radius),
	material : ballMaterial
});
ballBody.material.restitution = BOUNCE; // bounce
world.addBody(ballBody);

const initialVelocity = new CANNON.Vec3(vector_directeur.x, vector_directeur.y, vector_directeur.z); 
ballBody.velocity.copy(initialVelocity);

// Table


const tableShape = new CANNON.Box(new CANNON.Vec3(table_dimensions.x / 2, table_dimensions.y / 2, table_dimensions.z / 2));
const tableMaterial = new CANNON.Material();
const tableBody = new CANNON.Body({
    mass: 0, // Static object
    position: new CANNON.Vec3(table_position.x, table_position.y, table_position.z),
    shape: tableShape,
    material: tableMaterial
});
tableBody.material.restitution = BOUNCE; // Adjust bounciness
world.addBody(tableBody);

// net 
const netShape = new CANNON.Box (new CANNON.Vec3(net_dimensions.x / 2, net_dimensions.y / 2, net_dimensions.z / 2))
const netMaterial = new CANNON.Material();
const netBody = new CANNON.Body({
	mass : 0,
	position : new CANNON.Vec3(net_position.x, net_position.y, net_position.z),
	shape : netShape,
	material :  netMaterial
});
net.material.restitution = BOUNCE / 2
world.addBody(netBody)


//paddle


const ball_table_inter = new CANNON.ContactMaterial(ballMaterial, tableMaterial, {friction: 0.0, restitution: BOUNCE}); // intersect
world.addContactMaterial(ball_table_inter);

const ball_net_inter = new CANNON.ContactMaterial(ballMaterial, netMaterial, {friction: 0.0, restitution: BOUNCE}); // intersect
world.addContactMaterial(ball_net_inter);
///////

// x is the red 
// y is the green
// z is the blue


// Rendering the scene
function animate()
{
    requestAnimationFrame(animate)

  //  paddle.position.y = Math.sin(Date.now() * 0.001) * 0.05 + 0.1
    //opp_paddle.position.y = Math.cos((Date.now()) * 0.001) * 0.05 + 0.1
    //paddle.rotation.y += 0.01
    //opp_paddle.rotation.y -= 0.01


///////
    world.step(1 / 60);

	ballMesh.position.copy(ballBody.position);
    //ballMesh.quaternion.copy(ballBody.quaternion);

//////
    renderer.render(scene, camera)
}

function onWindowResize()
{
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
}
window.addEventListener('resize', onWindowResize, false)

const container = document.querySelector('#threejs-container')
container.append(renderer.domElement)
renderer.render(scene, camera)


animate()

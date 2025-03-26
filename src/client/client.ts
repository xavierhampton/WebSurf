import * as THREE from 'three';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls'
import * as CANNON from 'cannon-es'

import pMove from './components/pMove';
import pEvents from './components/pEvents';
import SceneBuilder from './components/helpers/sceneBuilder';
import Stats from 'three/examples/jsm/libs/stats.module';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import pLevels from './components/pLevels';

//Initalize Global Variables
const $ : any = {}

//////////////////////////////////
//Initialize Three.js Scene
const scene = new THREE.Scene(); $['scene'] = scene

//Initialize Cannon.js World
const world = new CANNON.World(); $['world'] = world
world.gravity.set(0, -20, 0);

//Initialize Renderer
const renderer = new THREE.WebGLRenderer(); $['renderer'] = renderer
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true

//Initialize Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
); $['camera'] = camera
camera.position.set(0,2,5)

/////////////////////////////////
//Initalize Controls
const controls = new PointerLockControls(camera, renderer.domElement); $['controls'] = controls
controls.pointerSpeed = 0.5

///////////////////
//Initalize Global Objects
let ground : any = []; $['ground'] = ground
const clock = new THREE.Clock()

//Initialize Global Objects
const stats = new Stats()
const pmove = new pMove($)
const sceneBuilder = new SceneBuilder($)
const plevels = new pLevels($)

//Initalize Player
initPlayer()

//Insert DOM Elements
document.body.appendChild(stats.dom)
document.body.appendChild(renderer.domElement);

////////////////////////////
//Generate Scene
$['levelSize'] = 10

// sceneBuilder.generatePlane()
sceneBuilder.createCube(new THREE.Vector3(0,-15,0), new THREE.Vector3(30,30,30), new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('./assets/cookieTexture.png')}))

plevels.generateLevelEasy()
plevels.generateLevelMedium()
plevels.generateLevelHard()



const loader = new GLTFLoader();

loader.load( 'assets/karambit/scene.gltf', function ( gltf : any ) {
    const model = gltf.scene
    $['karambit'] = gltf.scene
    
    model.scale.set(.002, .002, .002);  
	scene.add(model);

}, undefined, function ( error: unknown ) {

	console.error( error );

} );


// sceneBuilder.createPlane(new THREE.Vector3(70,-10,0), new THREE.Vector3(100,3,30), new THREE.TextureLoader().load('./assets/cookieTexture.png'), -Math.PI / 3)
// sceneBuilder.createPlane(new THREE.Vector3(70,-10,0), new THREE.Vector3(100,3,30), new THREE.TextureLoader().load('./assets/cookieTexture.png'), Math.PI / 3)


////////////////////////////
//Initalize Events
const pevents = new pEvents($)
//Run Process
animate();

///////////////////////////////////

function animate() {
    let delta = clock.getDelta()
    stats.update()
    pmove.Move(delta)

    world.step(Math.min(delta, 0.1))
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function initPlayer() {
    //Player
    const player = new THREE.Mesh(new THREE.BoxGeometry(1,3,1), new THREE.MeshLambertMaterial({color: 0x005555}))
    player.position.y = 2
    player.castShadow = true
    scene.add(player)

    const playerShape = new CANNON.Box(new CANNON.Vec3(0.5, 1.5, 0.5))
    const playerBody = new CANNON.Body({mass: 12, material: new CANNON.Material({friction: 0})})
    playerBody.addShape(playerShape)
    playerBody.position.set(
        player.position.x,
        player.position.y,
        player.position.z
    )
    world.addBody(playerBody)

    $['player'] = player
    $['playerBody'] = playerBody
}

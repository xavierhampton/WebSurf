import * as THREE from 'three';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls'
import * as CANNON from 'cannon-es'
import pMove from './components/pMove';
import Stats from 'three/examples/jsm/libs/stats.module';

//Initialize Global Objects
const stats = new Stats()
const pmove = new pMove()

//Initalize Global Variables
let meshes : any = []
const clock = new THREE.Clock()

//////////////////////////////////
//Initialize Three.js Scene
const scene = new THREE.Scene();

//Initialize Cannon.js World
const world = new CANNON.World();
world.gravity.set(0, -20, 0);

//Initialize Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(0,2,5)

//Initialize Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true

/////////////////////////////////
//Initalize Controls
const controls = new PointerLockControls(camera, renderer.domElement)
controls.pointerSpeed = 0.5

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

//Set Scene Background
const spaceTexture = new THREE.TextureLoader().load('assets/spaceTexture.png')
spaceTexture.wrapS = THREE.RepeatWrapping
spaceTexture.wrapT = THREE.RepeatWrapping
spaceTexture.repeat.set(2,2)
scene.background = spaceTexture

// Lighting
const light = new THREE.DirectionalLight(0xffffff, Math.PI)
light.position.x = 25
light.position.y = 25
light.castShadow = true
light.shadow.camera.scale.x = light.shadow.camera.scale.y = 10
const ambLight = new THREE.AmbientLight(0xffffff, .5)
light.shadow.mapSize.width = light.shadow.mapSize.height = 1024
scene.add(light, ambLight)

//Browser Events
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight)
    render();
}, false);

const menuPanel = document.getElementById("menuPanel") as HTMLDivElement
const startButton = document.getElementById("startButton") as HTMLInputElement
startButton.addEventListener('click', () => {
    controls.lock()
}, false)

controls.addEventListener('change', () => {console.log('controls change')})
controls.addEventListener('lock', () => {menuPanel.style.display = 'none'})
controls.addEventListener('unlock', () => {menuPanel.style.display = 'block'})

//Insert DOM Elements
document.body.appendChild(stats.dom)
document.body.appendChild(renderer.domElement);

////////////////////////////
////////////////////////////

//Plane
const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(100,100,50,50),
    new THREE.MeshLambertMaterial()
)
planeMesh.rotateX(-Math.PI / 2)
planeMesh.receiveShadow = true
meshes.push(planeMesh)
scene.add(planeMesh)

const planeShape = new CANNON.Plane()
const planeBody = new CANNON.Body({mass: 0, material: new CANNON.Material({friction: 0})})
planeBody.addShape(planeShape)
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -Math.PI / 2)
world.addBody(planeBody)


// const cubeTexture = new THREE.TextureLoader().load('./assets/cookieTexture.png')
// const cubeMaterial = new THREE.MeshLambertMaterial({
//     map: cubeTexture
// });

//Cube Generator 
// for (let i = 0; i < 100; i++) {
//     const geometry = new THREE.BoxGeometry(
//         Math.max(Math.random() * 10, 1),
//         Math.max(Math.random() * 5, 1),
//         Math.max(Math.random() * 10, 1),
//     );

//     const cube = new THREE.Mesh(geometry, cubeMaterial);
    
//     meshes.push(cube)

//     let xPos = Math.random() * 100 - 50
//     let zPos = Math.random() * 100 - 50

//     if (xPos < 10 && xPos > -10 && zPos < 10 && zPos > -10) {
//         if (Math.random() * .5) {xPos += (xPos > 0) ? 10: -10}
//         else {zPos += (zPos > 0) ? 10 : -10}
//     }

//     cube.position.x = xPos
//     cube.position.z = zPos

//     cube.geometry.computeBoundingBox()

//     cube.position.y =  ((cube.geometry.boundingBox as THREE.Box3).max.y - (cube.geometry.boundingBox as THREE.Box3).min.y) / 2
//     cube.castShadow = true
//     cube.receiveShadow = true
//     scene.add(cube);

//     const size = new THREE.Vector3()
//     cube.geometry.boundingBox?.getSize(size)
//     const cubeShape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2))
//     const cubeBody = new CANNON.Body({mass: 0, material: new CANNON.Material({friction: 0})})
//     cubeBody.addShape(cubeShape)

//     cubeBody.position.x = cube.position.x
//     cubeBody.position.y = cube.position.y
//     cubeBody.position.z = cube.position.z
    

//     world.addBody(cubeBody)
// }



//Movement
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let jumping = false;
let isGrounded = false;



const onKeyDown = (event: KeyboardEvent) => {
    switch(event.code) {
        case 'KeyW': moveForward = true; break;
        case 'KeyS': moveBackward = true; break;
        case 'KeyA': moveLeft = true; break;
        case 'KeyD': moveRight = true; break;
        case 'Space': jumping = true; break;
    }
}

const onKeyUp = (event: KeyboardEvent) => {
    switch(event.code) {
        case 'KeyW': moveForward = false; break;
        case 'KeyS': moveBackward = false; break;
        case 'KeyA': moveLeft = false; break;
        case 'KeyD': moveRight = false; break;
        case 'Space': jumping = false; break;
    }
}

document.addEventListener('keydown', onKeyDown, false)
document.addEventListener('keyup', onKeyUp, false)


function move(delta: number) {
    isGrounded = pmove.CheckGrounded(playerBody, meshes)

    const lookVector: THREE.Vector3 = controls.getDirection(new THREE.Vector3(0,0,0)).clone()
    const wishDir = new THREE.Vector3(0,0,0)

    if (moveLeft) {
        wishDir.add((new THREE.Vector3(0,1,0).cross(lookVector)))
    }
    if (moveRight) {
        wishDir.add((lookVector.clone().cross(new THREE.Vector3(0,1,0))))
    }
    if (moveForward) {
        wishDir.add(new THREE.Vector3(lookVector.x,0,lookVector.z))
    }
    if (moveBackward) {
        wishDir.add(new THREE.Vector3(-lookVector.x,0,-lookVector.z))
    }
    wishDir.y = 0
    wishDir.normalize()

    if (jumping && isGrounded) {
        playerBody.velocity.y = 7
        isGrounded = false;
    }

       let velocity: THREE.Vector3 = new THREE.Vector3(playerBody.velocity.x, 0, playerBody.velocity.z)

       if (isGrounded) {
        velocity = pmove.MoveGround(wishDir.clone(), velocity, delta)
       } else {

        if ((!moveForward && !moveBackward)) {
            velocity = pmove.MoveAir(wishDir.clone(), velocity, delta, true)
        } else {
            velocity = pmove.MoveAir(wishDir.clone(), velocity, delta, false)
        }


        velocity = pmove.MoveAir(wishDir.clone(), velocity, delta, true)
       }

       playerBody.velocity.x = velocity.x
       playerBody.velocity.z = velocity.z


    playerBody.position.set(
        camera.position.x,
        camera.position.y,
        camera.position.z
    )
}


function animate() {
    let delta = clock.getDelta()
    requestAnimationFrame(animate);
    stats.update()
    
    move(delta)
    world.step(Math.min(delta, 0.1))

    player.position.set(
        playerBody.position.x,
        playerBody.position.y,
        playerBody.position.z
    )
    camera.position.set(
        playerBody.position.x,
        playerBody.position.y,
        playerBody.position.z
    )
    playerBody.quaternion.set(
        player.quaternion.x,
        player.quaternion.y,
        player.quaternion.z,
        player.quaternion.w
    )


    render();
}

function render() {
    renderer.render(scene, camera);
}

// render();
animate();
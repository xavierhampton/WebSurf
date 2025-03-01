import * as THREE from 'three';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls'
import * as CANNON from 'cannon-es'

const spaceTexture = new THREE.TextureLoader().load('assets/spaceTexture.png')
spaceTexture.wrapS = THREE.RepeatWrapping
spaceTexture.wrapT = THREE.RepeatWrapping
spaceTexture.repeat.set(2,2)

const scene = new THREE.Scene();
scene.background = spaceTexture


const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(0,2,5)

//Mesh List
let meshes : any = []

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight)
    render();
}

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement);
const controls = new PointerLockControls(camera, renderer.domElement)
const menuPanel = document.getElementById("menuPanel") as HTMLDivElement
const startButton = document.getElementById("startButton") as HTMLInputElement
startButton.addEventListener('click', () => {
    controls.lock()
}, false)

controls.addEventListener('change', () => {console.log('controls change')})
controls.addEventListener('lock', () => {menuPanel.style.display = 'none'})
controls.addEventListener('unlock', () => {menuPanel.style.display = 'block'})


// Lighting
const light = new THREE.DirectionalLight(0xffffff, Math.PI)
light.position.x = 25
light.position.y = 25
light.castShadow = true
light.shadow.camera.scale.x = light.shadow.camera.scale.y = 10

const ambLight = new THREE.AmbientLight(0xffffff, .5)


//How pixelated shadows are smaller = more
light.shadow.mapSize.width = light.shadow.mapSize.height = 1024
scene.add(light, ambLight)


//Physics

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
const clock = new THREE.Clock()

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
const planeBody = new CANNON.Body({mass: 0})
planeBody.addShape(planeShape)
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -Math.PI / 2)
world.addBody(planeBody)


const cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0x5c646b
});


//Cube Generator
for (let i = 0; i < 100; i++) {
    const geometry = new THREE.BoxGeometry(
        Math.max(Math.random() * 10, 1),
        Math.max(Math.random() * 5, 1),
        Math.max(Math.random() * 10, 1),
    );

    const cube = new THREE.Mesh(geometry, cubeMaterial);
    meshes.push(cube)

    let xPos = Math.random() * 100 - 50
    let zPos = Math.random() * 100 - 50

    if (xPos < 10 && xPos > -10 && zPos < 10 && zPos > -10) {
        if (Math.random() * .5) {xPos += (xPos > 0) ? 10: -10}
        else {zPos += (zPos > 0) ? 10 : -10}
    }

    cube.position.x = xPos
    cube.position.z = zPos

    cube.geometry.computeBoundingBox()

    cube.position.y =  ((cube.geometry.boundingBox as THREE.Box3).max.y - (cube.geometry.boundingBox as THREE.Box3).min.y) / 2
    cube.castShadow = true
    cube.receiveShadow = true
    scene.add(cube);

    const size = new THREE.Vector3()
    cube.geometry.boundingBox?.getSize(size)
    const cubeShape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2))
    const cubeBody = new CANNON.Body({mass: 0})
    cubeBody.addShape(cubeShape)

    cubeBody.position.x = cube.position.x
    cubeBody.position.y = cube.position.y
    cubeBody.position.z = cube.position.z
    

    world.addBody(cubeBody)
}

//Player

const player = new THREE.Mesh(new THREE.BoxGeometry(1,3,1), new THREE.MeshLambertMaterial({color: 0x005555}))
player.position.y = 2
player.castShadow = true
scene.add(player)

const playerShape = new CANNON.Box(new CANNON.Vec3(0.5, 1.5, 0.5))
const playerBody = new CANNON.Body({mass: 3})
playerBody.addShape(playerShape)
playerBody.position.set(
    player.position.x,
    player.position.y,
    player.position.z
)
world.addBody(playerBody)

//Movement

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let jumping = false;
let isGrounded = false;

function checkGrounded() {
    // Ray starts from the sphere's current position
    const rayStart = new THREE.Vector3(playerBody.position.x, playerBody.position.y, playerBody.position.z);
    
    // Ray is cast downwards
    const rayDirection = new THREE.Vector3(0, -1, 0); // Negative Y direction
    
    // Create a Raycaster for Three.js
    const raycaster = new THREE.Raycaster(rayStart, rayDirection, 0, 2); // Maximum distance of 2 units
    
    // Check if the ray hits something
    const intersects = raycaster.intersectObjects(meshes)
    
    // If the ray hits the ground, we consider the object as grounded
    isGrounded = (intersects.length > 0) ? true : false
  }


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

function move() {
    checkGrounded()
    if (moveLeft) {
        controls.moveRight(-0.1)
    }
    if (moveRight) {
        controls.moveRight(0.1)
    }
    if (moveForward) {
        controls.moveForward(0.1)
    }
    if (moveBackward) {
        controls.moveForward(-0.1)
    }

    if (jumping && isGrounded) {
        playerBody.velocity.set(0,7,0)
        jumping = false;
    }

    playerBody.position.set(
        camera.position.x,
        camera.position.y,
        camera.position.z
    )
}



function animate() {
    requestAnimationFrame(animate);


    move()
    world.step(Math.min(clock.getDelta(), 0.1))


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
import * as THREE from 'three';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls'
import * as CANNON from 'cannon-es'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x5aa0e5)

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(0,2,5)

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

const controls = new OrbitControls(camera, renderer.domElement)

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

//Plane
const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(100,100,50,50),
    new THREE.MeshLambertMaterial()
)
planeMesh.rotateX(-Math.PI / 2)
planeMesh.receiveShadow = true
scene.add(planeMesh)

const geometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0x5c646b
});


//Cube Generator
for (let i = 0; i < 100; i++) {
    const cube = new THREE.Mesh(geometry, cubeMaterial);

    let xPos = Math.random() * 100 - 50
    let zPos = Math.random() * 100 - 50

    cube.position.x = xPos
    cube.position.z = zPos
    cube.position.y = 1

    cube.castShadow = true
    cube.receiveShadow = true
    scene.add(cube);
}

function animate() {
    requestAnimationFrame(animate);


    controls.update()
    render();
}

function render() {
    renderer.render(scene, camera);
}

// render();
animate();
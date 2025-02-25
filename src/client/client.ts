import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'dat.gui';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight)
    render();
}

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({
    color: 0x53c4f5
});

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);


const stats = new Stats();
document.body.appendChild(stats.dom);


const gui = new GUI();

const cubeFolder = gui.addFolder('Cube');
const rotationFolder = cubeFolder.addFolder('Rotation');
rotationFolder.add(cube.rotation, 'x', 0, Math.PI * 2);
rotationFolder.add(cube.rotation, 'y', 0, Math.PI * 2);
rotationFolder.add(cube.rotation, 'z', 0, Math.PI * 2);
rotationFolder.open();

const scaleRotation = cubeFolder.addFolder('Scale');
scaleRotation.add(cube.scale, 'x', 0, 5);
scaleRotation.add(cube.scale, 'y', 0, 5);
scaleRotation.add(cube.scale, 'z', 0, 5);
scaleRotation.open();

var cubeData = {
    color: cube.material.color.getHex()
}

cubeFolder.addColor(cubeData, 'color').onChange(()=> {
    cube.material.color.setHex(Number(cubeData.color))
})

cubeFolder.add(cube.material, 'wireframe');

cubeFolder.open();

const cameraFolder = gui.addFolder('Camera');
cameraFolder.add(camera.position, 'z', 0, 10);
cameraFolder.open();


function animate() {
    requestAnimationFrame(animate);

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    stats.update();

    render();
}

function render() {
    renderer.render(scene, camera);
}

// render();
animate();
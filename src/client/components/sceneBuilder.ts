import * as THREE from 'three'
import * as CANNON from 'cannon-es'
class SceneBuilder {
    $: any;
    constructor($: any) {
        this.$ = $;
        this.generateLighting()
        this.generateSceneBackground()
    }

    generateSceneBackground() {
        const scene = this.$['scene']

        //Set Scene Background
        const spaceTexture = new THREE.TextureLoader().load('assets/spaceTexture.png')
        spaceTexture.wrapS = THREE.RepeatWrapping
        spaceTexture.wrapT = THREE.RepeatWrapping
        spaceTexture.repeat.set(2,2)
        scene.background = spaceTexture
    }

    generateLighting() {
        const scene = this.$['scene']

        // Lighting
        const light = new THREE.DirectionalLight(0xffffff, Math.PI)
        light.position.x = 25
        light.position.y = 25
        light.castShadow = true
        light.shadow.camera.scale.x = light.shadow.camera.scale.y = 10
        const ambLight = new THREE.AmbientLight(0xffffff, .5)
        light.shadow.mapSize.width = light.shadow.mapSize.height = 1024
        scene.add(light, ambLight)
    }

    generatePlane() {
        const scene = this.$['scene']
        const world = this.$['world']
        const ground = this.$['ground']

        const planeMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(100,100,50,50),
            new THREE.MeshLambertMaterial()
        )
        planeMesh.rotateX(-Math.PI / 2)
        planeMesh.receiveShadow = true
        ground.push(planeMesh)
        scene.add(planeMesh)

        const planeShape = new CANNON.Plane()
        const planeBody = new CANNON.Body({mass: 0, material: new CANNON.Material({friction: 0})})
        planeBody.addShape(planeShape)
        planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -Math.PI / 2)
        world.addBody(planeBody)
    }

    generateTestCubes() {
        const scene = this.$['scene']
        const world = this.$['world']
        const ground = this.$['ground']

        const cubeTexture = new THREE.TextureLoader().load('./assets/cookieTexture.png')
        const cubeMaterial = new THREE.MeshLambertMaterial({
            map: cubeTexture
        });
        
        for (let i = 0; i < 100; i++) {
            const geometry = new THREE.BoxGeometry(
                Math.max(Math.random() * 10, 1),
                Math.max(Math.random() * 5, 1),
                Math.max(Math.random() * 10, 1),
            );

            const cube = new THREE.Mesh(geometry, cubeMaterial);
            
            ground.push(cube)

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
            const cubeBody = new CANNON.Body({mass: 0, material: new CANNON.Material({friction: 0})})
            cubeBody.addShape(cubeShape)

            cubeBody.position.x = cube.position.x
            cubeBody.position.y = cube.position.y
            cubeBody.position.z = cube.position.z
            

            world.addBody(cubeBody)
        }
    }
}
export default SceneBuilder
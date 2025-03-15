import { Vector3 } from "three"
import * as THREE from "three"

class pMove {
    $: any
    maxGroundSpeed: number
    maxAirSpeed: number 
    maxAcceleration: number
    frictionCoefficient: number
    airFrictionCoefficient: number

    constructor($: any) {
        this.$ = $
        this.maxGroundSpeed = 80
        this.maxAirSpeed = 12
        this.maxAcceleration = 10 * this.maxGroundSpeed
        this.frictionCoefficient = 10
        this.airFrictionCoefficient = 0
    }

    Move(delta: number) {
    let isGrounded = this.CheckGrounded()
    const wishDir = this.FindWishDir()
    const playerBody = this.$['playerBody']
    const camera = this.$['camera']

    if (this.$['jumping'] && isGrounded) {
        playerBody.velocity.y = 7
        isGrounded = false
    }

       let velocity: THREE.Vector3 = new THREE.Vector3(playerBody.velocity.x, 0, playerBody.velocity.z)
       if (isGrounded) {
        velocity = this.MoveGround(wishDir.clone(), velocity, delta)
       } 
       else {
        velocity = this.MoveAir(wishDir.clone(), velocity, delta, this.CheckStrafe())
       }
       playerBody.velocity.set(velocity.x, playerBody.velocity.y, velocity.z)
       this.SyncPlayer()
    }

    MoveGround(wishDir: Vector3, velocity: Vector3, delta: number) {
        // Calculate the velocity on the ground
        let velo = velocity.clone()
        this.friction(velo, delta, this.frictionCoefficient)

        let current_speed = velo.dot(wishDir)
        let add_speed = this.clamp(this.maxGroundSpeed - current_speed, 0, this.maxAcceleration )
        add_speed *= delta
        velo.add(wishDir.multiplyScalar(add_speed))
        return velo
    }

    MoveAir(wishDir: Vector3, velocity: Vector3, delta: number, strafe: boolean) {
        // Calculate the velocity in the air
        let velo = velocity.clone()
        this.friction(velo, delta, this.airFrictionCoefficient)

        let current_speed = velo.dot(wishDir)
        if (strafe) {
            let add_speed = this.clamp(this.maxAirSpeed - current_speed, 0, this.maxAcceleration )
            add_speed *= delta
            velo.add(wishDir.multiplyScalar(add_speed))
        }
        
        return velo
    }

    CheckGrounded() {
        const playerBody = this.$['playerBody']
        const ground = this.$['ground']

        // Create a raycaster to check for ground collision
        const rayStart = new THREE.Vector3(playerBody.position.x, playerBody.position.y, playerBody.position.z);
        const rayDirection = new THREE.Vector3(0, -1, 0); // Negative Y direction
        const raycaster = new THREE.Raycaster(rayStart, rayDirection, 0, 2); // Maximum distance of 2 units
        const intersects = raycaster.intersectObjects(ground)
        return (intersects.length > 0) ? true : false
      }

    FindWishDir() {
        const lookVector: THREE.Vector3 = this.$['controls'].getDirection(new THREE.Vector3(0,0,0)).clone()
        const wishDir = new THREE.Vector3(0,0,0)
        if (this.$['moveLeft']) {
            wishDir.add((new THREE.Vector3(0,1,0).cross(lookVector)))
        }
        if (this.$['moveRight']) {
            wishDir.add((lookVector.clone().cross(new THREE.Vector3(0,1,0))))
        }
        if (this.$['moveForward']) {
            wishDir.add(new THREE.Vector3(lookVector.x,0,lookVector.z))
        }
        if (this.$['moveBackward']) {
            wishDir.add(new THREE.Vector3(-lookVector.x,0,-lookVector.z))
        }
        wishDir.y = 0
        wishDir.normalize()
        return wishDir.clone()
    }

    CheckStrafe() {
        return (!this.$['moveForward'] && !this.$['moveBackward'])
    }

    SyncPlayer() {
        const playerBody = this.$['playerBody']
        const player = this.$['player']
        const camera = this.$['camera']

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
        playerBody.position.set(
            camera.position.x,
            camera.position.y,
            camera.position.z
        )
    }


    //Helpers
    /////////////////////////////////////

    clamp(value: number, min: number, max: number) {
        if (value > max) return max
        if (value < min) return min
        return value
      }

    friction(velocity: Vector3, frametime: number, frictionCoefficient: number) {
        const frictionForce = ((velocity.clone()).multiplyScalar(frictionCoefficient));
        frictionForce.multiplyScalar(frametime);
        // Apply friction to the velocity
        velocity = velocity.sub(frictionForce);
    
        // Prevents oscillation near zero
        if (Math.abs(velocity.x) < 0.01) {
            velocity.x = 0;
        }
         // Prevents oscillation near zero
         if (Math.abs(velocity.z) < 0.01) {
            velocity.z = 0;
        }
    }
}
export default pMove
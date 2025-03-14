import { Vector3 } from "three"
import * as THREE from "three"

class pMove {
    maxGroundSpeed: number
    maxAirSpeed: number 
    maxAcceleration: number
    frictionCoefficient: number
    airFrictionCoefficient: number

    constructor() {
        this.maxGroundSpeed = 80
        this.maxAirSpeed = 10
        this.maxAcceleration = 5 * this.maxGroundSpeed
        this.frictionCoefficient = 10
        this.airFrictionCoefficient = 0
    }

    Move(delta: number, isGrounded: boolean) {
        return
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

    CheckGrounded(playerBody: any, meshes: any) {
        // Create a raycaster to check for ground collision
        const rayStart = new THREE.Vector3(playerBody.position.x, playerBody.position.y, playerBody.position.z);
        const rayDirection = new THREE.Vector3(0, -1, 0); // Negative Y direction
        const raycaster = new THREE.Raycaster(rayStart, rayDirection, 0, 2); // Maximum distance of 2 units
        const intersects = raycaster.intersectObjects(meshes)
        return (intersects.length > 0) ? true : false
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
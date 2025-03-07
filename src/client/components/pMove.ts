import { Vector3 } from "three"

class pMove {
    maxGroundSpeed: number
    maxAirSpeed: number 
    maxAcceleration: number
    friction: number

    constructor() {
        this.maxGroundSpeed = 320
        this.maxAirSpeed = 300
        this.maxAcceleration = 10 * this.maxGroundSpeed
        this.friction = 0.8

    }

    MoveGround(wishDir: Vector3, velocity: Vector3, delta: number) {
        // velo.add(velo.multiplyScalar( -1 * this.friction * clock.getDelta() ))
        let velo = velocity.clone()

        let current_speed = velo.dot(wishDir)
        let add_speed = this.clamp(this.maxGroundSpeed - current_speed, 0, this.maxAcceleration )
        velo.add(wishDir.multiplyScalar(add_speed))
        return velo
    }

    MoveAir(wishDir: Vector3, velo: Vector3, delta: number) {
        let current_speed = velo.dot(wishDir)
        let add_speed = this.clamp(this.maxAirSpeed - current_speed, 0, this.maxAcceleration * delta)
        velo.add(wishDir.multiplyScalar(add_speed))
        return velo
    }



    //Helpers
    /////////////////////////////////////

    clamp(value: number, min: number, max: number) {
        if (value > max) return max
        if (value < min) return min
        return value
      }

}
export default pMove
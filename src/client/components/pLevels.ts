import * as THREE from 'three'
import randomSeed from "./helpers/randomSeed";
import SceneBuilder from "./helpers/sceneBuilder";

class pLevels {
    $: any;
    rs: randomSeed;
    sc: SceneBuilder;

    constructor($: any) {
        this.$ = $;
        this.rs = new randomSeed(4174234)
        this.sc = new SceneBuilder($);
    }

    generateLevelEasy() {
        const COLORS = [0xff0000, 0xffa500, 0xffff00, 0x00ff00, 0x0000ff, 0x4b0082, 0x8a2be2]
                let prevx = 20
                let j = 0;
        
                for (let i = 0; i < this.$['levelSize']; i++) {
                    const size = new THREE.Vector3(
                        this.rs.nextInt(0,2) + 7,
                        1,
                        this.rs.nextInt(0,2) + 7
                    )
                    const position = new THREE.Vector3(
                        this.rs.nextInt(0,6),
                        -0.5,
                        -prevx
                    )

                    prevx += 10
                    this.sc.createCube(position, size, new THREE.MeshLambertMaterial({color: COLORS[j]}))
                    j++;
                    j = j % COLORS.length
                }
    }

    generateLevelMedium() {
        const COLORS = [0xff0000, 0xffa500, 0xffff00, 0x00ff00, 0x0000ff, 0x4b0082, 0x8a2be2]
                let prevx = 20 + (10 * this.$['levelSize'])
                let j = 0;
        
                for (let i = 0; i < this.$['levelSize']; i++) {
                    const size = new THREE.Vector3(
                        this.rs.nextInt(0,5) + 5,
                        1,
                        this.rs.nextInt(0,5) + 5
                    )
                    const position = new THREE.Vector3(
                        this.rs.nextInt(0,7),
                        -0.5,
                        -prevx
                    )

                    prevx += 10
                    this.sc.createCube(position, size, new THREE.MeshLambertMaterial({color: COLORS[j]}))
                    j++;
                    j = j % COLORS.length
                }
    }

    generateLevelHard() {
        const COLORS = [0xff0000, 0xffa500, 0xffff00, 0x00ff00, 0x0000ff, 0x4b0082, 0x8a2be2]
                let prevx = 20 + (20 * this.$['levelSize'])
                let j = 0;
        
                for (let i = 0; i < this.$['levelSize']; i++) {
                    const size = new THREE.Vector3(
                        this.rs.nextInt(0,8) + 3,
                        1,
                        this.rs.nextInt(0,8) + 3
                    )
                    const position = new THREE.Vector3(
                        this.rs.nextInt(0,10),
                        -0.5,
                        -prevx
                    )

                    prevx += 14
                    this.sc.createCube(position, size, new THREE.MeshLambertMaterial({color: COLORS[j]}))
                    j++;
                    j = j % COLORS.length
                }
    }


}
export default pLevels
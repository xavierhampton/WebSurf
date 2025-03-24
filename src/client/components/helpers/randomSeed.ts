class randomSeed {
    seed: number

    constructor(seed: number) {
        this.seed = seed % 2147483647
        if (this.seed <= 0) {this.seed += 2147483646}
    }

    next() {
        this.seed = (this.seed * 16807) % 2147483647
        return (this.seed - 1) / 2147483646
    }

    nextInt(min: number, max: number) {
        min = Math.ceil(min)
        max = Math.floor(max)

        return Math.floor(min + this.next() * (max - min + 1))
    }
}
export default randomSeed
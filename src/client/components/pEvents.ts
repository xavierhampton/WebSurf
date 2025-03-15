//Handles the events for the client service
class pEvents {
    $: any;
    constructor($: any) {
        this.$ = $;
        this.init()
    }

    init() {
        this.initMovementEvents()
        
    }

    initMovementEvents() {
        //Movement Events
        this.$['moveForward'] = false;
        this.$['moveBackward'] = false;
        this.$['moveLeft'] = false;
        this.$['moveRight'] = false;
        this.$['jumping'] = false;
        
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            switch(event.code) {
                case 'KeyW': this.$['moveForward'] = true; break;
                case 'KeyS': this.$['moveBackward'] = true; break;
                case 'KeyA': this.$['moveLeft'] = true; break;
                case 'KeyD': this.$['moveRight'] = true; break;
                case 'Space': this.$['jumping'] = true; break;
            }
        }, false)
        document.addEventListener('keyup', (event: KeyboardEvent) => {
            switch(event.code) {
                case 'KeyW': this.$['moveForward'] = false; break;
                case 'KeyS': this.$['moveBackward'] = false; break;
                case 'KeyA': this.$['moveLeft'] = false; break;
                case 'KeyD': this.$['moveRight'] = false; break;
                case 'Space': this.$['jumping'] = false; break;
            }
        }, false)
    }
}
export default pEvents;

//Handles the events for the client service
class pEvents {
    $: any;
    constructor($: any) {
        this.$ = $;
        this.init()
    }

    init() {
        this.initMovementEvents()
        this.initBrowserEvents()
    }

    initMovementEvents() {
        //Movement Events
        this.$['moveForward'] = false;
        this.$['moveBackward'] = false;
        this.$['moveLeft'] = false;
        this.$['moveRight'] = false;
        this.$['jumping'] = false;
        this.$['reset'] = false;
        
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            switch(event.code) {
                case 'KeyW': this.$['moveForward'] = true; break;
                case 'KeyS': this.$['moveBackward'] = true; break;
                case 'KeyA': this.$['moveLeft'] = true; break;
                case 'KeyD': this.$['moveRight'] = true; break;
                case 'Space': this.$['jumping'] = true; break;
                case 'KeyR': this.$['reset'] = true; break;
            }
        }, false)
        document.addEventListener('keyup', (event: KeyboardEvent) => {
            switch(event.code) {
                case 'KeyW': this.$['moveForward'] = false; break;
                case 'KeyS': this.$['moveBackward'] = false; break;
                case 'KeyA': this.$['moveLeft'] = false; break;
                case 'KeyD': this.$['moveRight'] = false; break;
                case 'Space': this.$['jumping'] = false; break;
                case 'KeyR': this.$['reset'] = false; break; 
            }
        }, false)
    }

    initBrowserEvents() {
        const camera = this.$['camera']
        const renderer = this.$['renderer']
        const scene = this.$['scene']
        const controls = this.$['controls']

        //Browser Events
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight)
            renderer.render(scene, camera);
        }, false);
        
        const menuPanel = document.getElementById("menuPanel") as HTMLDivElement
        const startButton = document.getElementById("startButton") as HTMLInputElement
        startButton.addEventListener('click', () => {
            this.$['controls'].lock()
        }, false)
        
        controls.addEventListener('lock', () => {menuPanel.style.display = 'none'})
        controls.addEventListener('unlock', () => {menuPanel.style.display = 'block'})

    }
}
export default pEvents;

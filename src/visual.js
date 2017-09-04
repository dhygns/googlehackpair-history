import * as THREE from "three"

class Visual {
    constructor() {
        //Setup Size for render
        this.resolution = {width : window.innerWidth, height : window.innerHeight};

        //Setup Renderer
        this.rdrr = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.rdrr.setSize(this.resolution.width, this.resolution.height);
        document.body.appendChild(this.rdrr.domElement);

        //Setup Scene for visual
        this.scene = new THREE.Scene();

        //Setup Scene objects
        for(var i = 0 ; i < 100; i++) {
            
        }
    }   

    update(t, dt) {

    }
}


export default Visual;
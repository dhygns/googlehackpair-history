import * as THREE from "three"
import Frame from "./visual/frame.js"
import Camera from "./visual/camera.js"

import Atlas from "./atlas/atlas.js"
import Resource from "./manager/resource.js"
class Visual {
    constructor() {
        //Setup Size for render
        this.resolution = {width : window.innerWidth, height : window.innerHeight};

        //Setup Renderer
        this.rdrr = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.rdrr.setSize(this.resolution.width, this.resolution.height);
        document.body.appendChild(this.rdrr.domElement);

        //Setup Manager For Resources
        this.manager = new THREE.LoadingManager();

        //Setup Camera for visual
        this.camera = new Camera();

        //Setup Scene for visual
        this.scene = new THREE.Scene();

        //Setup Altas for history
        this.atlas = new Atlas(this.rdrr, this.manager);

        //Setup ImageLoader
        this.image = new THREE.TextureLoader(this.manager);

        //Setup Resources
        this.resource = new Resource(this.manager);

        this.manager.onLoad = () => {
            //Setup Scene objects
            for(var i = 0 ; i < 200; i++) {
                const person = new Frame();
                this.scene.add(person);
    
            }
        }
    }   

    update(t, dt) {

        this.camera.update(t, dt);

        this.scene.children.forEach((person)=>{
            if(person.update) {
                person.update(t, dt, this.camera);
            }
        })
        this.rdrr.render(this.scene, this.camera);
    }
}


export default Visual;
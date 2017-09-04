import * as THREE from "three"
import Person from "./visual/person.js"
import Camera from "./visual/camera.js"
import Ground from "./visual/ground.js"
class Visual {
    constructor() {
        //Setup Size for render
        this.resolution = {width : window.innerWidth, height : window.innerHeight};

        //Setup Renderer
        this.rdrr = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.rdrr.setSize(this.resolution.width, this.resolution.height);
        document.body.appendChild(this.rdrr.domElement);

        //Setup Camera for visual
        this.camera = new Camera();

        //Setup Scene for visual
        this.scene = new THREE.Scene();

        //Setup Scene objects
        for(var i = 0 ; i < 200; i++) {
            const person = new Person();
            this.scene.add(person);

        }
        this.scene.add(new Ground());
        
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
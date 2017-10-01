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
        this.rdrr = new THREE.WebGLRenderer({ alpha: false, antialias: true });
        this.rdrr.setSize(this.resolution.width, this.resolution.height);
        document.body.appendChild(this.rdrr.domElement);

        //Setup Camera for visual
        this.camera = new Camera();

        //Setup Scene for visual
        this.scene = new THREE.Scene();

        //Setup Altas for history
        this.atlas = new Atlas(this.rdrrs);

        //Setup ImageLoader
        this.loader = new THREE.TextureLoader();
        this.resources = {};

        //Setup Resources
        this.resource = new Resource();
        
        //Setup Scene objects
        // for(var i = 0 ; i < 50; i++) {
        //     // const image = undefined;//this.resources["dummy0" + Math.round(Math.random() * 5.0)];

        // }
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

    action(config) {
        //Count of Resources Objects
        const objectCount = Object.keys(this.resources).length;

        // console.log(objectCount, config.length);

        for(var idx = objectCount; idx < config.length ; idx++) {
            const {originName} = config[idx];
            const URLPath = "http://172.20.10.9:5000/" + originName;

            this.loader.crossOrigin = '';
            this.loader.load(URLPath, ((name, tex) => {
                tex.minFilter = tex.magFilter = THREE.LinearFilter;
                console.log(name, tex);
                this.resources[name] = tex;

                const frame = new Frame(tex);
                this.scene.add(frame);
            }).bind(this, originName))

            // const img = new Image(); img.src = URLPath; 
            // img.onload = ((name) => {
            //     img.setAttribute('crossorigin', '')
            //     const canvas = document.createElement('canvas');
            //     canvas.width = img.width;
            //     canvas.height = img.height;
                
            //     const context = canvas.getContext('2d')
            //     context.drawImage(img, 0, 0);
            //     const imageData = context.getImageData(0, 0, img.width, img.height);
            //     console.log(imageData);
            //     document.body.appendChild(canvas);

            //     const tex = new THREE.Texture(canvas);
            //     tex.needsUpdate = true; 
            //     tex.magFilter = tex.minFilter = THREE.LinearFilter;
                
            //     this.resources[name] = tex;

            //     console.log(this.resources);

            //     const person = new Frame(tex);
            //     this.scene.add(person);

            //     console.log(person);
            // }). bind(this, originName);
        }
    }
}


export default Visual;

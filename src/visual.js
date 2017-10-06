import * as THREE from "three"
import Frame from "./visual/frame.js"
import Canvas from "./visual/canvas.js"
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

        //Setup Camera for visual
        this.camera = new Camera();

        //Setup Scene for visual
        this.scene = new THREE.Scene();

        //Setup Canvas for visual
        this.canvas = new Canvas();
        this.scene.add(this.canvas);

        //Setup Altas for history
        this.atlas = new Atlas(this.rdrr);

        //Setup ImageLoader
        this.loader = new THREE.TextureLoader();
        this.resources = {};

        //Setup Resources
        this.resource = new Resource();
        
        //Setup Scene objects
        this.frameIdx = 0;
        this.frames = [];
        for(var i = 0 ; i < 50; i++) {
            const frame = new Frame(this.atlas.texture, i);
            this.frames.push(frame);
            this.scene.add(frame)
        }


        //UI MODE & View Mode Swticher
        document.addEventListener("keydown", ({key})=>{
            switch(key) {
                case "1": for(var i = 0; i < 50 ; i++) { this.frames[i].SetViewMode(); } break;
                case "2": for(var i = 0; i < 50 ; i++) { this.frames[i].SetUIMode(); } break;
            }
        });
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

        console.log(objectCount, config.length);

        for(var idx = objectCount; idx < config.length ; idx++) {
            const {originName} = config[idx];
            const URLPath = originName;

            this.loader.crossOrigin = '';
            this.loader.load(URLPath, ((name, tex) => {
                tex.minFilter = tex.magFilter = THREE.LinearFilter;
                
                console.log(name, tex);
                this.resources[name] = tex;
                
                const infos = this.atlas.addTextureToAtlas(tex.image.width, tex.image.height, tex);
                this.frames[this.frameIdx].Start(infos);

                this.frameIdx = (this.frameIdx + 1) % 50;

                this.canvas.doAction(tex, tex, tex, 5.0);
                this.camera.doAction(5.0);

            }).bind(this, originName))
        }
    }
}


export default Visual;

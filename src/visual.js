import * as THREE from "three"
import Config from "./config.js"

import Frame from "./visual/frame.js"
import Picker from "./visual/picker.js"
import Canvas from "./visual/canvas.js"
import Camera from "./visual/camera.js"

import Atlas from "./atlas/atlas.js"

import Mouse from "./manager/mouse.js"

class Visual {
    constructor(resource, network) {
        //info Lists
        this.infos = [];
        this.confg = [];

        //Setup Size for render
        this.resolution = {width : window.innerWidth, height : window.innerHeight};

        //Setup Renderer
        this.rdrr = new THREE.WebGLRenderer({ alpha: false, antialias: true });
        this.rdrr.setSize(this.resolution.width, this.resolution.height);
        document.body.appendChild(this.rdrr.domElement);

        //Setup Camera for visual
        this.camera = new Camera();

        //Setup Scene for visual
        this.scene = new THREE.Scene(); //for Rendering
        this.panel = new THREE.Scene(); //for ColorPick

        //Setup Canvas for visual
        this.canvas = new Canvas();
        this.scene.add(this.canvas);

        //Setup Altas for history
        this.atlas = new Atlas(this.rdrr);

        //Setup resource Manager
        this.resource = resource;
        this.network = network;
        this.mouse = new Mouse(this.rdrr, this.panel, this.camera);
        
        //Setup Scene objects
        this.frameIdx = 0;
        this.frames = [];
        this.pickers = [];
        for(var i = 0 ; i < 50; i++) {
            const frame = new Frame(this.atlas.texture, i, this.infos);
            const picker = new Picker(frame);
            this.frames.push(frame);
            this.scene.add(frame);
            this.panel.add(picker);
        
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
                if(this.mouse.Clicked == person.idx) {
                    person.Clicked();
                    const info = this.resource.getInfo(person.rid);
                    this.network.req(info);
                }
                if(person.Wheel) person.Wheel(this.mouse.Wheel);
                person.update(t, dt, this.camera);

            }
        })
        this.panel.children.forEach((picker)=>{
            if(picker.update) {
                picker.update(t, dt);
            }
        });

        this.mouse.update(t, dt);
        this.rdrr.render(this.scene, this.camera);
        // this.rdrr.render(this.panel, this.camera);
        // console.log(this.mouse.Clicked);
    }

    action(config) {
        //Count of Resources Objects
        const objectCount = this.resource.Count;

        for(var idx = objectCount; idx < config.length ; idx++) {
            const conf = config[idx];
            this.resource.load(
                conf,
                (tex)=>{
                    const info = this.atlas.addTextureToAtlas(tex.image.width, tex.image.height, tex);
                    this.infos.push(info);

                    this.frames[this.frameIdx].Start(info, this.resource);
                    this.frameIdx = (this.frameIdx + 1) % 50;
                }
            );
        }

        this.resource.onLoad = (function(os, ss, rs) {
            // console.log(os, ss, rs);
            console.log("ACTION");
            this.canvas.doAction(os, ss, rs, 20.0);
            this.camera.doAction(20.0);
        }).bind(this);
    }
}


export default Visual;

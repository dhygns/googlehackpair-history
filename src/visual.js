import * as THREE from "three"

import Perlin from "./perlin/perlin.js"
import Brush from "./visual/brush.js"
import Canvas from "./visual/canvas.js"

class Visual {
    constructor(tracks) {
        //Setup Size for render
        this.resolution = {width : 900, height : 900};

        //Setup Renderer
        this.rdrr = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.rdrr.setSize(this.resolution.width, this.resolution.height);

        this.rdrr.domElement.style.marginLeft = (window.innerWidth - this.resolution.width) * 0.15 + "px";
        this.rdrr.domElement.style.marginTop = (window.innerHeight - this.resolution.height) * 0.5 + "px";
        this.rdrr.domElement.style.boxShadow = "5px 5px 40px #AAAAAA";

        console.log(document.getElementById("main_canvas"));
        document.getElementById("main_canvas").appendChild(this.rdrr.domElement);

        //Setup perlin noise
        this.perlin = new Perlin({rdrr : this.rdrr, gridWidth : 16, gridHeight : 16, texWidth : 64, texHeight : 64});

        //Setup Scene & add brushes
        this.scene = new THREE.Scene();
        this.scene.add(new Brush({x : - 6.25, y : 2.0}, this.rdrr, this.perlin));
        this.scene.add(new Brush({x : - 3.75, y : 2.0}, this.rdrr, this.perlin));
        this.scene.add(new Brush({x : - 1.25, y : 2.0}, this.rdrr, this.perlin));
        this.scene.add(new Brush({x :   1.25, y : 2.0}, this.rdrr, this.perlin));
        this.scene.add(new Brush({x :   3.75, y : 2.0}, this.rdrr, this.perlin));
        this.scene.add(new Brush({x :   6.25, y : 2.0}, this.rdrr, this.perlin));

        //Setup Camera
        this.camera = new THREE.PerspectiveCamera(45, this.resolution.width/ this.resolution.height, 1.0, 1000.0);
        this.camera.position.z = 20.0;

        //Setup Canvas 
        //it's made for brush effect (unerasing)
        this.canvas = new Canvas(this.rdrr, this.perlin);

        //Get Tracks for Pitches
        this.tracks = tracks;
    }   

    update(t, dt) {
        //Perlin noise update
        this.perlin.update(dt);

        //update objects included scene
        this.scene.children.forEach((brush, idx) => {
            if(brush.update) {
                var midi = 0.0;
                if(!this.tracks[idx]) midi = 0.0;
                else midi =  this.tracks[idx].event.midi;
                brush.update(t, dt, midi / 100.0);
            }
        });

        //update canvas
        this.canvas.update(dt);

        //render 
        this.canvas.render(this.scene, this.camera);
    }
}


export default Visual;
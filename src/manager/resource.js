import * as THREE from "three"

const textures = [
    "dummy.jpg"
];

const jsons = [
    "history.json"
];


export default class {
    constructor() {

        // this.textures = {};
        // this.textureloader = new THREE.TextureLoader(manager);
        // this.jsonloader = new THREE.FileLoader(manager);


        // textures.forEach((name) => {
        //     this.textureloader.load("res/images/" + name, ((id, tex) => {
        //         tex.minFilter = tex.magFilter = THREE.LinearFilter;
        //         this.textures[id] = tex;
        //     }).bind(this, name))
        // });

        // jsons.forEach((name) => {
        //     this.textureloader.load("res/json/" + name, ((id, text) => {
        //         this.textures[id] = JSON.parse(text);
        //     }).bind(this, name))
        // });
    }

    get texture() { return this.textures; }
    get json() { return this.jsons; }
}
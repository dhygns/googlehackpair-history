import * as THREE from "three"
import Config from "./../config.js"

export default class {
    constructor() {
        this.manager = new THREE.LoadingManager();
        this.loader = new THREE.TextureLoader(this.manager);
        this.loader.crossOrigin = '';

        this.confList = [];

        this.originTexture = undefined;
        this.styleTexture = undefined;
        this.resultTexture = undefined;
    }

    load(info, callback) {
        var IP = "";
        if(!Config.DEBUG) { IP = Config.SOCKET_HOST + ":" + Config.SOCKET_PORT + "/"; }

        const originSrc = IP + info.originSrc;
        const styleSrc = IP + info.styleSrc;
        const resultSrc = IP + info.resultSrc;

        this.originTexture = null;
        this.styleTexture = null;
        this.resultTexture = null;

        this.confList.push(info);

        this.loader.load(originSrc, ((tex) => { 
            console.log("Origin Src Loaded");
            tex.minFilter = tex.magFilter = THREE.LinearFilter; 
            this.originTexture = tex; 
            
        }).bind(this));

        this.loader.load(styleSrc, ((tex) => { 
            console.log("Style Src Loaded");            
            tex.minFilter = tex.magFilter = THREE.LinearFilter; 
            this.styleTexture = tex; 
        }).bind(this));

        this.loader.load(resultSrc, ((cb, tex) => { 
            console.log("Result Src Loaded");
            tex.minFilter = tex.magFilter = THREE.LinearFilter; 
            this.resultTexture = tex; 
            cb(tex);
        }).bind(this, callback));
    }

    set onLoad(callback) {
        this.manager.onLoad = () =>{
            callback(this.originTexture, this.styleTexture, this.resultTexture);
        };
    }

    getInfo(idx) { return this.confList[idx]; }

    get Count() { return this.confList.length; }

    
}
import * as THREE from "three"
import Config from "./../config.js"

export default class {
    constructor() {
        this.manager = new THREE.LoadingManager();
        this.loader = new THREE.TextureLoader(this.manager);
        this.loader.crossOrigin = '';

        this.confList = [];
        this.srcList = {};

        this.originTexture = undefined;
        this.styleTexture = undefined;
        this.resultTexture = undefined;
    }

    load(info, callback) {
        var IP = "";
        if(!Config.DEBUG) { IP = Config.SOCKET_HOST + ":" + Config.SOCKET_PORT; }

        const originSrc = IP + info.originSrc;
        const styleSrc = IP + info.styleSrc;
        const resultSrc = IP + info.resultSrc;

        this.originTexture = null;
        this.styleTexture = null;
        this.resultTexture = null;

        this.loader.load(originSrc, ((tex) => { 
            console.log("Origin Src Loaded");
            tex.minFilter = tex.magFilter = THREE.LinearFilter; 
            this.originTexture = tex; 
            
        }).bind(this));

        if(this.srcList[styleSrc] != undefined) {
            this.styleTexture = this.srcList[styleSrc]; 
        } else {
            this.loader.load(styleSrc, ((url, tex) => { 
                console.log("Style Src Loaded");            
                tex.minFilter = tex.magFilter = THREE.LinearFilter; 
                this.styleTexture = tex; 
                this.srcList[url] = tex;
            }).bind(this, styleSrc));
        }

        this.loader.load(resultSrc, ((cb, info, tex) => { 
            console.log("Result Src Loaded");
            tex.minFilter = tex.magFilter = THREE.LinearFilter; 
            this.resultTexture = tex; 
            
            this.confList.push(info);
            cb(tex);
        }).bind(this, callback, info));
    }

    set onLoad(callback) {
        this.manager.onLoad = () =>{
            callback(this.originTexture, this.styleTexture, this.resultTexture);
        };
    }

    getInfo(idx) { return this.confList[idx]; }

    get Count() { return this.confList.length; }

    
}
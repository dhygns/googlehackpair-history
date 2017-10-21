import * as THREE from "three"

export default class {
    constructor(rdrr, scene, camera) {

        this.rdrr = rdrr;
        this.gl = this.rdrr.getContext();
        this.po = new Uint8Array(4);
        this.mp = [0, 0];
        this.ms = false;

        this.ci = -1;
        this.wi = 0;
        // gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        // var data = new Uint8Array(renderTarget.width * renderTarget.height * 4);
        // gl.readPixels(0,0,renderTarget.width,renderTarget.heigh,gl.RGBA,gl.UNSIGNED_BYTE,data);
        // console.log(this.ctx);
            
        this.scene = scene;
        this.camera = camera;
        this.target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
            minFilter : THREE.NearestFilter, magFilter : THREE.NearestFilter
        });
        console.log(this.target);
        this.buffer = this.target.__webglFramebuffer;
        console.log("RenderTarget Buffer : ", this.buffer);

        document.addEventListener("mousemove", ({pageX, pageY}) => {
            this.mp[0] = pageX;;
            this.mp[1] = window.innerHeight - pageY;
        });

        document.addEventListener("mousedown", ({pageX, pageY})=>{
            this.mp[0] = pageX;;
            this.mp[1] = window.innerHeight - pageY;
            this.ms = true;
        });


        document.addEventListener("mouseup", ({pageX, pageY})=>{
            this.mp[0] = pageX;
            this.mp[1] = window.innerHeight - pageY;
            this.ms = false;
        });

        document.addEventListener("mousewheel", ({wheelDelta})=>{
            this.wi = wheelDelta;
        });

    }

    update(t, dt) {
        this.rdrr.render(this.scene, this.camera);
        this.gl.readPixels(this.mp[0], this.mp[1], 1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.po);
        this.wi += (0.0 - this.wi) * 5.0 * dt;
        //hover status
        if(this.po[2] != 0) {
            document.body.style.cursor = "pointer";
        } else {
            document.body.style.cursor = "default";
        }

        //click Check
        if(this.ms) {
            this.ms = false;
            this.ci = this.po[2];
            console.log(this.ci);
        } else {
            this.ci = -1;
        }
    }

    get Clicked() { return this.ci; }

    get Wheel() { return this.wi; }
}
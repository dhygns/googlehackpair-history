import * as THREE from "three"
// import Perlin from "./../perlin/perlin.js"

//bursh fragment Shader
const fragmentShader = `
uniform float uClicked;
uniform vec4 uOffset;
uniform sampler2D uTexture;
varying vec2 vtex;
varying float vdepth;

void main(void) {
    vec2 st = vtex * 2.0 - 1.0;
    vec2 uv = uOffset.xy + uOffset.zw * 0.04 + vtex * uOffset.zw * 0.96;

    float alpha =
        smoothstep(1.0, 0.9, abs(st.x)) * smoothstep(1.0, 0.9, abs(st.y));

    vec3 bgcol = vec3(0.0, 0.0, 0.0);
    vec3 obcol = texture2D(uTexture, uv).rgb;

    float depth =smoothstep(30.0, 10.0,  vdepth); 
    vec3 retcol = mix(bgcol, obcol, depth);

    if(uClicked > 0.5) retcol = mix(retcol, vec3(1.0, 0.0, 0.0), 0.1);

    gl_FragColor = vec4(retcol, alpha);
}

`;

//brush vertex Shader
const vertexShader = `

varying vec2 vtex;
varying float vdepth;

void main(void) {
    vec4 positi = vec4(position, 1.0);
    positi.y = max(positi.y, 0.0);
    vec4 retpos = projectionMatrix * viewMatrix * modelMatrix * positi;
    vtex = uv;
    vdepth = retpos.z;//smoothstep(100.0, 200.0, retpos.z);

    gl_Position = retpos;//projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`;


export default class extends THREE.Object3D {
    constructor(altas, idx, infos) {
        super();

        //get Info Lists
        this.infos = infos;

        //Setup Index
        this.idx = idx + 1;
        this.rid = 0;
        this.hex = "#" + String("000000"+ this.idx.toString(16)).slice(-6);
        this.clickedTime = 0.0;
        this.wheelDelta = 0.0;
        
        //Setup Uniform
        this.unif = {
            uOffset: { type: "4f", value: [0.0, 0.0, 0.0, 0.0] },
            uTexture: { type: "t", value: altas },
            uClicked: { type:"1f", value: 0.0}
        };

        //Setup body
        this.body = new THREE.Mesh(
            new THREE.PlaneGeometry(2.0, 2.0),
            new THREE.ShaderMaterial({
                transparent: true,
                uniforms: this.unif,
                vertexShader: vertexShader,
                fragmentShader: fragmentShader
            })
        );

        //setup mesh 
        this.add(this.body);

        //create radian
        this.radian = idx * Math.PI * 2.0 / 50.0;//MaxCount;
        this.swipe = 0.0;

        //create transform
        this.ratio = 1.0;

        this.ViewPosition = new THREE.Vector3();
        this.ViewScale = new THREE.Vector3();

        this.UIPosition = new THREE.Vector3();
        this.UIScale = new THREE.Vector3();

        this.position.x = 0.0;
        this.position.y = 0.0;
        this.position.z = -20.0;

        //create Look Target
        this.looker = new THREE.Vector3(0.0, 0.0, 0.0);

        this._init();
        this._reload();
        this.updateMode = this._updateViewMode;
    }

    update(t, dt, cam) {
        if (dt > 0.1) dt = 0.0;
        this.clickedTime -= dt;
        if(this.clickedTime < 0.0) this.Released();

        this.updateMode(t, dt, cam);
    }

    _init() {

        //init scale
        this.ViewScale.x = 1.0;
        this.ViewScale.y = 2.0 * this.ViewScale.x / this.ratio;

        this.UIScale.x = 0.5;
        this.UIScale.y = 2.0 * this.UIScale.x / this.ratio;

        //create localposition
        this.ViewPosition.x = Math.sign(Math.random() - 0.5) * (Math.random() * 7.0 + 3.0);
        this.ViewPosition.y = 0.0;
        this.ViewPosition.z = Math.random() * 60.0 - 30.0;

        this.UIPosition.x = 0.0;
        this.UIPosition.y = 0.0;
        this.UIPosition.z = 0.0;

        this.position.x = this.ViewPosition.x;
        this.position.y = this.ViewPosition.y;
        this.position.z = this.ViewPosition.z;

    }

    _reload() {
        const idxs = (this.infos.length * Math.random()) << 0;
        
        this.rid = idxs;
        const info = this.infos[idxs];
        
        this.ViewPosition.x = Math.sign(Math.random() - 0.5) * (Math.random() * 7.0 + 3.0);
        this.position.x = this.ViewPosition.x;

        if(idxs) {
            this.ratio = info.width / info.height;
            this.unif.uOffset.value = [info.left, info.top, info.width, info.height];
        } else {
            this.ratio = 1.0;
            this.unif.uOffset.value = [0.0, 0.0, 0.0, 0.0];
        }
    }

    _updateViewMode(t, dt, cam) {

        if (this.ViewPosition.z < -30.0) {
            this.ViewPosition.z += 60.0;
            this.position.z = this.ViewPosition.z;
            this._reload();
        }
        else if (this.ViewPosition.z > 30.0) {
            this.ViewPosition.z += -60.0;
            this.position.z = this.ViewPosition.z;
            this._reload();
        }

        this.ViewPosition.z -= dt * 0.6;
        this.wheelDelta += (0.0 - this.wheelDelta) * 10.0 * dt;
        this.ViewPosition.z += this.wheelDelta * dt;


        this.position.x += (this.ViewPosition.x - this.position.x) * dt;
        this.position.y += (this.ViewPosition.y - this.position.y) * dt;
        this.position.z += (this.ViewPosition.z - this.position.z) * dt;

        this.scale.x += (this.ViewScale.x - this.scale.x) * dt * 10.0;
        this.scale.y += (this.ViewScale.y - this.scale.y) * dt * 10.0;
        this.scale.z += (this.ViewScale.z - this.scale.z) * dt * 10.0;

        this.looker.x += (cam.position.x + this.position.x - this.looker.x) * dt * 10.0;
        this.looker.y += (cam.position.y - this.looker.y) * dt * 10.0;
        this.looker.z += (cam.position.z + this.position.z - this.looker.z) * dt * 10.0;


        this.lookAt(this.looker);
    }

    _updateUIMode(t, dt, cam) {
        this.UIPosition.x = cam.position.x + 10.0 * Math.sin(this.radian + this.swipe);
        this.UIPosition.y = cam.position.y - 5.2;
        this.UIPosition.z = cam.position.z + 10.0 * Math.cos(this.radian + this.swipe);

        this.position.x += (this.UIPosition.x - this.position.x) * dt * 10.0;
        this.position.y += (this.UIPosition.y - this.position.y) * dt * 10.0;
        this.position.z += (this.UIPosition.z - this.position.z) * dt * 10.0;

        this.scale.x += (this.UIScale.x - this.scale.x) * dt * 10.0;
        this.scale.y += (this.UIScale.y - this.scale.y) * dt * 10.0;
        this.scale.z += (this.UIScale.z - this.scale.z) * dt * 10.0;

        this.looker.x += (cam.position.x - this.looker.x) * dt * 10.0;
        this.looker.y += (cam.position.y - this.looker.y) * dt * 10.0;
        this.looker.z += (cam.position.z - this.looker.z) * dt * 10.0;

        this.lookAt(this.looker);
    }

    SetUIMode() {
        this.updateMode = this._updateUIMode;
    }

    SetViewMode() {
        this.updateMode = this._updateViewMode;
    }

    Start(infos, res) {
        this._init();
        this.res = res;

        this.ratio = infos.width / infos.height;
        this.unif.uOffset.value = [infos.left, infos.top, infos.width, infos.height];

        this.SetViewMode();
    }

    Clicked() { 
        this.unif.uClicked.value = 1.0; 
        this.clickedTime = 2.0;

        //init scale
        this.ViewScale.x = 2.0;
        this.ViewScale.y = 2.0 * this.ViewScale.x / this.ratio;

        this.UIScale.x = 1.0;
        this.UIScale.y = 2.0 * this.UIScale.x / this.ratio;
    }

    Released() { 
        this.unif.uClicked.value = 0.0; 

        //init scale
        this.ViewScale.x = 1.0;
        this.ViewScale.y = 2.0 * this.ViewScale.x / this.ratio;

        this.UIScale.x = 0.5;
        this.UIScale.y = 2.0 * this.UIScale.x / this.ratio;
    }

    Wheel(v) {
        this.wheelDelta = Math.sign(v) * Math.min(Math.abs(v), 30.0);
    }
};
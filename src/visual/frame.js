import * as THREE from "three"
// import Perlin from "./../perlin/perlin.js"

//bursh fragment Shader
const fragmentShader = `
uniform vec4 uOffset;
uniform sampler2D uTexture;
varying vec2 vtex;
varying float vdepth;

void main(void) {
    vec2 st = vtex * 2.0 - 1.0;
    vec2 uv = uOffset.xy + uOffset.zw * 0.04 + vtex * uOffset.zw * 0.96;

    float alpha =
        smoothstep(1.0, 0.9, abs(st.x)) * smoothstep(1.0, 0.9, abs(st.y));

    vec3 bgcol = vec3(1.0, 1.0, 1.0);
    vec3 obcol = texture2D(uTexture, uv).rgb;

    float depth =smoothstep(30.0, 10.0,  vdepth); 
    vec3 retcol = mix(bgcol, obcol, depth);

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
    constructor(altas, infos) {
        super();

        const ratio = infos.width / infos.height;

        //Setup Uniform
        this.unif = {
            uOffset : { type : "4f", value : [infos.left, infos.top, infos.width, infos.height]},
            uTexture : { type : "t", value : altas}
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

        //create pivot
        this.pivot = 0.0;

        //init scale
        this.scale.x = 2.0;
        this.scale.y = 2.0 * this.scale.x / ratio;

        //create localposition
        this.localPosition = new THREE.Vector3(
            Math.sign(Math.random() - 0.5) * (Math.random() * 7.0 + 3.0), 0.0,
            20.0);

        this.looker = new THREE.Vector3(0.0, 0.0, 0.0);
    }

    update(t, dt, cam) {
        if (dt > 0.1) dt = 0.0;

        this.pivot -= dt * 0.6;

        if (this.localPosition.z + this.pivot < -20.0) this.pivot += 40.0;

        this.looker.x = (cam.position.x + this.position.x);
        this.looker.y = (cam.position.y);
        this.looker.z = (cam.position.z + this.position.z);

        this.lookAt(this.looker);

        this.position.x = this.localPosition.x;
        this.position.y = this.localPosition.y;
        this.position.z = this.localPosition.z + this.pivot;
    }

};
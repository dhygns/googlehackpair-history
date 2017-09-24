import * as THREE from "three"
// import Perlin from "./../perlin/perlin.js"

//bursh fragment Shader
const fragmentShader = `
varying vec2 vtex;
varying float vdepth;

void main(void) {
    vec3 bgcol = vec3(1.0, 1.0, 1.0);
    vec3 obcol = vec3(0.0, 0.0, 0.0);

    float depth = smoothstep(60.0, 30.0,  vdepth); 
    vec3 retcol = mix(bgcol, obcol, depth);

    gl_FragColor = vec4(retcol, 1.0);
}

`;

//brush vertex Shader
const vertexShader = `

varying vec2 vtex;
varying float vdepth;

void main(void) {
    vec4 retpos = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    vtex = uv;
    vdepth = retpos.z;//smoothstep(100.0, 200.0, retpos.z);

    gl_Position =  projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`;


export default class extends THREE.Object3D {
    constructor() {
        super();
        //Setup body
        this.body = new THREE.Mesh(
            new THREE.PlaneGeometry(2.0, 2.0),
            new THREE.ShaderMaterial({
                transparent: true,
                vertexShader: vertexShader,
                fragmentShader: fragmentShader
            })
        );

        //setup mesh 
        this.add(this.body);



        //setup default matrices

        //create pivot
        this.pivot = 0.0;

        //create localposition
        this.localPosition = new THREE.Vector3(
            Math.random() * 100.0 - 50.0,
            0.0,
            Math.random() * 100.0 - 80.0);

        //init scale
        this.scale.x = 2.0;
        this.scale.y = 2.0;

        this.looker = new THREE.Vector3(0.0, 0.0, 0.0);
    }

    update(t, dt, cam) {
        if (dt > 0.1) dt = 0.0;

        this.pivot += dt;

        if (this.localPosition.z + this.pivot > 20.0) this.pivot -= 70.0;

        this.looker.x = (cam.position.x + this.position.x);
        this.looker.y = (cam.position.y);
        this.looker.z = (cam.position.z + this.position.z);

        this.lookAt(this.looker);

        this.position.x = this.localPosition.x;
        this.position.y = this.localPosition.y;
        this.position.z = this.localPosition.z + this.pivot;

    }

};
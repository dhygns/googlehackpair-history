import * as THREE from "three"
// import Perlin from "./../perlin/perlin.js"

//bursh fragment Shader
const fragmentShader = `
uniform sampler2D uPerlin;
uniform vec3 uColor;
uniform float uAlpha;
uniform float uClamp;
uniform float uTime;

varying vec2 vtex;


const float cEdge = 0.1;
float EdgeClamper(vec2 st) {
    return
        //// Circle (MOON)
        smoothstep(1.0, 1.0 - cEdge, length(st + vec2(0.0, 0.0) - 0.5) * 2.0);
        // * smoothstep(1.0 - cEdge, 1.0, length(st + vec2(0.2, 0.0) - 0.5) * 2.0);
        //// Square
        // smoothstep(0.0, 0.0 + cEdge, st.x) *
        // smoothstep(1.0, 1.0 - cEdge, st.x) *
        // smoothstep(0.0, 0.0 + cEdge, st.y) *
        // smoothstep(1.0, 1.0 - cEdge, st.y);
}

void main(void) {
    float alpha = uAlpha * EdgeClamper(vtex);
    alpha = smoothstep(uClamp - 0.1, uClamp + 0.1, alpha);
    gl_FragColor = vec4(uColor, alpha);
}

`;

//brush vertex Shader
const vertexShader = `

varying vec2 vtex;

void main(void) {
    vtex = uv;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`;


export default class Brush extends THREE.Object3D{
    constructor(pos, rdrr, perlin) {
        super();
        //intialization renderer
        this.rdrr = rdrr;

        //intialization about perlin noise
        // this.perlin = new Perlin({ rdrr : rdrr, width : 16, height : 16});

        
        this.color = [
            Math.random() * 0.5 + 0.5, 
            Math.random() * 0.5 + 0.5, 
            Math.random() * 0.5 + 0.5
        ];

        this.uColor = [0.5, 0.5, 0.5,]

        //initailization about uniforms
        this.uniforms = {
            uPerlin : { type : "t", value : perlin.texture},
            uColor : { type : "3f", value : this.uColor},
            uTime : { type : "1f", value : 0.0},
            uClamp : { type : "1f", value : 0.7},
            uAlpha : { type : "1f", value : 1.0}
        };
        
        //setup mesh 
        this.add(new THREE.Mesh(
            new THREE.PlaneGeometry(2.0, 2.0),
            new THREE.ShaderMaterial({
                uniforms : this.uniforms,
                transparent : true,
                vertexShader : vertexShader,
                fragmentShader : fragmentShader
            })
        ));

        this._scale = new THREE.Vector3(0.0);
        this.scale.x = 0.001;
        this.scale.y = 0.001;

        this._position = new THREE.Vector3(pos.x, pos.y, 0.0);
        this.position.x = pos.x;
        this.position.y = pos.y;
        this.position.z = 0.0;

        this._velocity = new THREE.Vector3(0.0);
        this._rotation = new THREE.Vector3(0.0);


        const len = 0.0;//Math.random() * 5.0 + 1.0;
        const rad = 0.0;//Math.random() * 2.0 * Math.PI;

        this.rotation.z = Math.random() * Math.PI * 2.0;

        this.uniforms.uClamp.value = Math.random() * 0.5 + 0.25;

        this._seed = { 
            clp : Math.random() + 1.0,
            scl : 0.5 + Math.random() * 0.2, 
            xpiv : pos.x + len * Math.sin(rad), ypiv : pos.y + len * Math.cos(rad),
            xscl : 10.5, xlamb : Math.random(), xfreq : 0.5 + Math.random(),
            yscl : 10.5, ylamb : Math.random(), yfreq : 0.5 + Math.random() 
        };
    }

    update(t, dt, fft) {
        if(dt > 0.1) dt = 0.0;
        // this.perlin.update(dt);
        // console.log(fft);
        this._position.x = this._seed.xpiv + (fft * 3.0) * Math.sin(this._seed.xlamb + this._seed.xfreq * t * Math.PI);
        this._position.y = (this._seed.ypiv + fft) + (fft * 3.0) * Math.cos(this._seed.ylamb + this._seed.yfreq * t * Math.PI);

        this._scale.x = this._seed.scl * fft * fft + Math.random() * 0.2;
        this._scale.y = this._seed.scl * fft * fft + Math.random() * 0.2;

        this._rotation.z = Math.random() * Math.PI * 4.0;


        this.position.x += (this._position.x - this.position.x) * dt * 5.0;
        this.position.y += (this._position.y - this.position.y) * dt * 5.0;

        this.scale.x += (this._scale.x - this.scale.x) * dt * 5.0;
        this.scale.y += (this._scale.y - this.scale.y) * dt * 5.0;

        this.rotation.z += (this._rotation.z - this.rotation.z) * dt * 1.0;

        this.uColor[0] += (this.color[0] + fft - this.uColor[0]) * dt * 5.0;
        this.uColor[1] += (this.color[1] + fft - this.uColor[1]) * dt * 5.0;
        this.uColor[2] += (this.color[2] + fft - this.uColor[2]) * dt * 5.0;
        
        this.uniforms.uTime.value += dt;
        this.uniforms.uClamp.value = 0.2 + 0.8 * fft;//Math.sin(t * Math.PI * this._seed.clp) * 0.2 + ;
        // this.uniforms.uAlpha.value = 
    }

};
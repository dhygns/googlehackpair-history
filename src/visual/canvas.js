import * as THREE from "three"


//setup Shader programs
const fragmentShader = `
#define PI ` + Math.PI + `
uniform sampler2D uPerlinTexture;
uniform sampler2D uCurrTexture;
uniform sampler2D uPrevTexture;
uniform vec2 uResolution;
uniform float uDelta;
varying vec2 vtex;


vec4 blur(vec2 st, vec2 ns) {
    vec3 offset = vec3(1.0, 0.0, -1.0);
    vec4 retcol = vec4(0.0);
    float ap = 0.01;
    
    retcol += texture2D(uPrevTexture, st) * 4.0 ;
    ap = max(ap, retcol.a);
    
    retcol += 
        texture2D(uPrevTexture, st + offset.xx / uResolution * ns / ap) * 1.0 + 
        texture2D(uPrevTexture, st + offset.zz / uResolution * ns / ap) * 1.0 + 
        texture2D(uPrevTexture, st + offset.xz / uResolution * ns / ap) * 1.0 + 
        texture2D(uPrevTexture, st + offset.zx / uResolution * ns / ap) * 1.0;
    retcol += 
        texture2D(uPrevTexture, st + offset.xy / uResolution * ns / ap) * 2.0 + 
        texture2D(uPrevTexture, st + offset.zy / uResolution * ns / ap) * 2.0 + 
        texture2D(uPrevTexture, st + offset.yz / uResolution * ns / ap) * 2.0 + 
        texture2D(uPrevTexture, st + offset.yx / uResolution * ns / ap) * 2.0;

    return retcol / 16.0;
}

float glow(vec2 st) {
    return smoothstep(
        length(vec3(0.9)), 
        length(vec3(1.0)), 
        length(texture2D(uCurrTexture, st).rgb));
}
float glowblur(vec2 st) {
    float retcol = 0.0;
    float rate = 0.0;
    for(float idx = 1.0; idx <= 32.0 ; idx += 1.0) {
        float rt = 8.0 / idx;
        retcol += glow(st - vec2(0.5 + idx * 4.0, 0.0) / uResolution) * rt;
        retcol += glow(st + vec2(0.5 + idx * 4.0, 0.0) / uResolution) * rt;
        rate += rt * 2.0;
    }
    return retcol / rate;
}

void main(void) {
    vec4 perlin = texture2D(uPerlinTexture, vtex);
    vec2 noisSt = perlin.x * 8.0 * vec2(
        sin(perlin.y * PI * 2.0),
        cos(perlin.y * PI * 2.0)) ;

    vec2 prevSt = vec2(vtex.x, vtex.y + uDelta) ;
    vec2 currSt = vtex;

    vec4 prevColor = blur(prevSt , noisSt);
    prevColor.a *= 1.0 - uDelta;
    
    vec4 currColor = texture2D(uCurrTexture, currSt);
    
    vec4 retColor = max(prevColor, currColor); 
    // retColor = mix(retColor, vec4(1.0), glowblur(vtex));
    gl_FragColor = retColor;
}
`;

const vertexShader = `
varying vec2 vtex;
void main(void) {
    vtex = uv;
    gl_Position = vec4(position, 1.0);
}
`;

export default class Canvas {
    constructor(rdrr, perlin) {
        //setup render target for current scene visual
        this.scn = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            type: THREE.FloatType
        });

        //setup render target
        this.rtt = [];
        this.rtt.push(new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            type: THREE.FloatType
        }));
        this.rtt.push(new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            type: THREE.FloatType
        }));

        //initialization rendertarget idx;
        this.rttidx = 0;

        //setup render environment       
        this.scene = new THREE.Scene();
        this.rencn = new THREE.Scene();

        this.camera = new THREE.Camera();
        this.rdrr = rdrr;


        //setup uniforms (Shader)
        this.uniforms = {
            uPerlinTexture : { type : "t", value : perlin.texture},
            uCurrTexture : {type : "t", value : undefined},
            uPrevTexture : {type : "t", value : undefined},
            uResolution : { type : "2f", value : [window.innerWidth, window.innerHeight]},
            uDelta : { type : "1f", value : 0.0 }
        };

        //setup mesh
        this.scene.add(new THREE.Mesh(
            new THREE.PlaneGeometry(2.0, 2.0),
            new THREE.ShaderMaterial({
                uniforms: this.uniforms,
                // transparent : true,  
                vertexShader : vertexShader,
                fragmentShader : fragmentShader,
            })
        ));

        this.rencn.add(new THREE.Mesh(
            new THREE.PlaneGeometry(2.0, 2.0),
            new THREE.ShaderMaterial({
                uniforms: this.uniforms,
                transparent : true,  
                vertexShader : vertexShader,
                fragmentShader : fragmentShader,
            })
        ));
    }

    update(dt) {
        //if it's rendered  target //
        this.uniforms.uDelta.value = dt * 0.08;
    }

    render(scene, camera) {
        
        //create curr texture
        this.rdrr.render(scene, camera, this.scn);
        
        this.uniforms.uCurrTexture.value = this.scn.texture;
        this.uniforms.uPrevTexture.value = this.texture;


        this.swap();

        //save mixed texture curr & prev
        this.rdrr.render(this.scene, this.camera, this.target);

        //render mixed texture curr & prev
        this.rdrr.render(this.rencn, this.camera);
    }

    swap() { this.rttidx = this.previdx; }

    get curridx() { return this.rttidx; }
    get previdx() { return (this.rttidx + 1) % 2; }

    get target() { return this.rtt[this.curridx]; }
    get texture() { return this.rtt[this.curridx].texture; }
}
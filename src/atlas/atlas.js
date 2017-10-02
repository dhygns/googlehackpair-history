import * as THREE from "three"

const minFilter = THREE.LinearFilter;
const magFilter = THREE.LinearFilter;

const fragmentShader = `
uniform sampler2D uTexture;
varying vec2 vtex;
void main(void) {
    gl_FragColor = texture2D(uTexture, vtex);
}
`;

const vertexShader = `
varying vec2 vtex;
void main(void) {
    vtex = uv;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`;

class Stemp extends THREE.Object3D {
    constructor() {
        super();
        this.unif = {
            uTexture : { type : "t" ,value : undefined}
        };

        //each attributes for buffer
        this.attr = {};
        this.attr.positions = new Float32Array(6 * 3);
        this.attr.uvs = new Float32Array(6 * 2);

        this.attr.positions[0] = 0.0; this.attr.positions[1] = 0.0; this.attr.positions[2] = 0.0;
        this.attr.positions[3] = 0.0; this.attr.positions[4] = 0.0; this.attr.positions[5] = 0.0;
        this.attr.positions[6] = 0.0; this.attr.positions[7] = 0.0; this.attr.positions[8] = 0.0;

        this.attr.positions[9] = 0.0; this.attr.positions[10] = 0.0; this.attr.positions[11] = 0.0;
        this.attr.positions[12] = 0.0; this.attr.positions[13] = 0.0; this.attr.positions[14] = 0.0;
        this.attr.positions[15] = 0.0; this.attr.positions[16] = 0.0; this.attr.positions[17] = 0.0;

        this.attr.uvs[0] = 0.0; this.attr.uvs[1] = 0.0;
        this.attr.uvs[2] = 1.0; this.attr.uvs[3] = 1.0;
        this.attr.uvs[4] = 0.0; this.attr.uvs[5] = 1.0;

        this.attr.uvs[6] = 0.0; this.attr.uvs[7] = 0.0;
        this.attr.uvs[8] = 1.0; this.attr.uvs[9] = 0.0;
        this.attr.uvs[10] = 1.0; this.attr.uvs[11] = 1.0;

        //create buffer geometry
        this.geom = new THREE.BufferGeometry();

        //create Attributes & setup
        this.geom.addAttribute("position", new THREE.BufferAttribute(this.attr.positions, 3));
        this.geom.addAttribute("uv", new THREE.BufferAttribute(this.attr.uvs, 2));

        this.geom.verticesNeedUpdate = true;

        //create Shader Material
        this.matr = new THREE.ShaderMaterial({
            uniforms: this.unif,
            vertexShader, fragmentShader
        });

        this.add(new THREE.Mesh(
            this.geom, 
            this.matr
        ));

        //interface for vertices , left-bottom, right-top, right-bottom
        this.vertices = [
            new THREE.Vector3(-1.0, -1.0, 0.0), //0 : left-bottom
            new THREE.Vector3(-1.0, 1.0, 0.0), //1 : left-top
            new THREE.Vector3(1.0, -1.0, 0.0), //2 : right-bottom
            new THREE.Vector3(1.0, 1.0, 0.0)  //3 : right-top
        ];
    }

    setImageInfo(left, top, width, height, texture) {
        this.unif.uTexture.value = texture;
        
        this.vertices[0].set(-1.0 + left * 2.0, -1.0 + top * 2.0, 0.0 );
        this.vertices[1].set(-1.0 + left * 2.0, -1.0 + top * 2.0 + height * 2.0, 0.0 );
        this.vertices[2].set(-1.0 + left * 2.0 + width * 2.0, -1.0 + top * 2.0, 0.0 );
        this.vertices[3].set(-1.0 + left * 2.0 + width * 2.0, -1.0 + top * 2.0 + height * 2.0, 0.0 );


        //update vertices attributes
        this.attr.positions[0] = this.vertices[0].x;
        this.attr.positions[1] = this.vertices[0].y;
        this.attr.positions[2] = this.vertices[0].z;

        this.attr.positions[6] = this.vertices[1].x;
        this.attr.positions[7] = this.vertices[1].y;
        this.attr.positions[8] = this.vertices[1].z;

        this.attr.positions[12] = this.vertices[2].x;
        this.attr.positions[13] = this.vertices[2].y;
        this.attr.positions[14] = this.vertices[2].z;

        this.attr.positions[3] = this.vertices[3].x;
        this.attr.positions[4] = this.vertices[3].y;
        this.attr.positions[5] = this.vertices[3].z;

        this.attr.positions[15] = this.vertices[3].x;
        this.attr.positions[16] = this.vertices[3].y;
        this.attr.positions[17] = this.vertices[3].z;

        this.attr.positions[9] = this.vertices[0].x;
        this.attr.positions[10] = this.vertices[0].y;
        this.attr.positions[11] = this.vertices[0].z;
        
        this.geom.attributes.position.needsUpdate = true;
    }
}


export default class {
    constructor(rdrr) {
        this.rdrr = rdrr;

        this.width = 8192;
        this.height = 8192;
        this.maxheight = 0.0;
        
        this.left = 0.0;
        this.top = 0.0;

        //Methods for Stemping
        this.stemp = new Stemp();
        this.viewer = new THREE.Camera();
        this.canvas = new THREE.Scene();
        this.canvas.add(this.stemp);


        //Atlas Texture
        this.target = new THREE.WebGLRenderTarget(this.width, this.height, {minFilter, magFilter});

    }



    addTextureToAtlas(width, height, texture) {

        const resolution = 0.1;

        var retobj = { left : 0.0, top : 0.0, width : 0.0, height : 0.0};

        const w = width / this.width * resolution;
        const h = height / this.height * resolution;

        if(this.left + w > 1.0) { this.left = 0.0; this.top += Math.max(this.maxheight, h); }

        retobj.left = this.left;
        retobj.top = this.top;
        retobj.width = w;
        retobj.height = h;

        this.stemp.setImageInfo(this.left, this.top, w, h, texture);

        this.left += w;
        this.maxheight = Math.max(this.maxheight, h);
    
        this.rdrr.autoClear = false;
        this.rdrr.render(this.canvas, this.viewer, this.target);
        this.rdrr.autoClear = true;

        return retobj;
    }

    get texture() { return this.target.texture; }
}
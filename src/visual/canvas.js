import * as THREE from "three"

const fragmentShader = `
uniform sampler2D uOriginTexture;
uniform sampler2D uTargetTexture;
uniform sampler2D uStyledTexture;
varying vec2 vtex;

void main(void) {
    vec2 st = vtex * 2.0 - 1.0;
    vec4 OriginColor = texture2D(uOriginTexture, vtex);
    vec4 TargetColor = texture2D(uTargetTexture, vtex);
    vec4 StyledColor = texture2D(uStyledTexture, vtex);

    vec4 ResultColor = mix(OriginColor, TargetColor, smoothstep(0.3, 0.33, vtex.x));
    ResultColor = mix(ResultColor, StyledColor, smoothstep(0.63, 0.66, vtex.x));


    float alpha = smoothstep(0.99, 0.89, abs(st.x)) * smoothstep(0.99, 0.89, abs(st.y));
    ResultColor.a = alpha;

    gl_FragColor = ResultColor;
}

`;

const vertexShader = `
varying vec2 vtex;
void main(void) {
    vtex = uv;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`;


export default class extends THREE.Object3D {
    constructor() {
        super();
        
        this.timer = 0.0; //for Action

        this.unif = {
            uOriginTexture : { type : "t", value : undefined },
            uTargetTexture : { type : "t", value : undefined },
            uStyledTexture : { type : "t", value : undefined } 
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
            transparent : true,
            vertexShader, fragmentShader
        });


        this.add(new THREE.Mesh(
            this.geom,
            this.matr
        ));

        //interface for vertices , left-bottom, right-top, right-bottom
        this.vertices = [
            new THREE.Vector3(0.0, 0.0, 0.0), //0 : left-bottom
            new THREE.Vector3(0.0, 0.0, 0.0), //1 : left-top
            new THREE.Vector3(0.0, 0.0, 0.0), //2 : right-bottom
            new THREE.Vector3(0.0, 0.0, 0.0)  //3 : right-top
        ];

        this.velocity = [
            new THREE.Vector3(0.0, 0.0, 0.0), //0 : left-bottom
            new THREE.Vector3(0.0, 0.0, 0.0), //1 : left-top
            new THREE.Vector3(0.0, 0.0, 0.0), //2 : right-bottom
            new THREE.Vector3(0.0, 0.0, 0.0)  //3 : right-top
        ];

        this.speeds = [ 
            Math.random() * 5.0 + 1.0, 
            Math.random() * 5.0 + 1.0, 
            Math.random() * 5.0 + 1.0, 
            Math.random() * 5.0 + 1.0
        ];

        this.scale.x = this.scale.y = 3.0;
        this.position.z = 5.0;
        this.position.y = 2.5;
        this._updateTodo = (t, dt) => {};
    }

    _updateShowUp(t, dt) {
        this.velocity[0].x = (-0.5 - this.vertices[0].x) * this.speeds[0];
        this.velocity[0].y = (-0.5 - this.vertices[0].y) * this.speeds[0];
        this.velocity[0].z = ( 0.0 - this.vertices[0].z) * this.speeds[0];

        this.velocity[1].x = (-0.5 - this.vertices[1].x) * this.speeds[1];
        this.velocity[1].y = ( 0.5 - this.vertices[1].y) * this.speeds[1];
        this.velocity[1].z = ( 0.0 - this.vertices[1].z) * this.speeds[1];

        this.velocity[2].x = ( 0.5 - this.vertices[2].x) * this.speeds[2];
        this.velocity[2].y = (-0.5 - this.vertices[2].y) * this.speeds[2];
        this.velocity[2].z = ( 0.0 - this.vertices[2].z) * this.speeds[2];

        this.velocity[3].x = ( 0.5 - this.vertices[3].x) * this.speeds[3];
        this.velocity[3].y = ( 0.5 - this.vertices[3].y) * this.speeds[3];
        this.velocity[3].z = ( 0.0 - this.vertices[3].z) * this.speeds[3];

        this.timer -= dt;
        if(this.timer < 0.0) this.noAction();

    }

    _updateShowOff(t, dt) {
        this.velocity[0].x = ( 0.0 - this.vertices[0].x) * this.speeds[0] * 5.0;
        this.velocity[0].y = (-2.0 - this.vertices[0].y) * this.speeds[0];
        this.velocity[0].z = ( 0.0 - this.vertices[0].z) * this.speeds[0];

        this.velocity[1].x = ( 0.0 - this.vertices[1].x) * this.speeds[1] * 5.0;
        this.velocity[1].y = (-1.0 - this.vertices[1].y) * this.speeds[1];
        this.velocity[1].z = ( 0.0 - this.vertices[1].z) * this.speeds[1];

        this.velocity[2].x = ( 0.0 - this.vertices[2].x) * this.speeds[2] * 5.0;
        this.velocity[2].y = (-2.0 - this.vertices[2].y) * this.speeds[2];
        this.velocity[2].z = ( 0.0 - this.vertices[2].z) * this.speeds[2];

        this.velocity[3].x = ( 0.0 - this.vertices[3].x) * this.speeds[3] * 5.0;
        this.velocity[3].y = (-1.0 - this.vertices[3].y) * this.speeds[3];
        this.velocity[3].z = ( 0.0 - this.vertices[3].z) * this.speeds[3];
    }
    

    _updateVertices(t, dt) {
        //update vertices via velocity
        for(var i = 0 ; i < 4 ; i ++) {
            this.vertices[i].x += this.velocity[i].x * dt;
            this.vertices[i].z += this.velocity[i].z * dt;
            this.vertices[i].y += this.velocity[i].y * dt;
        }

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

    update(t, dt, cam) {
        this.lookAt(cam.position);
        this._updateTodo(t, dt);
        this._updateVertices(t, dt);
    }

    doAction(originTexture, targetTexture, styledTexture, limitTime) {
        this.timer = limitTime;

        this.speeds[0] = Math.random() * 5.0 + 1.0; 
        this.speeds[1] = Math.random() * 5.0 + 1.0;
        this.speeds[2] = Math.random() * 5.0 + 1.0; 
        this.speeds[3] = Math.random() * 5.0 + 1.0;

        this.vertices[0].set(0.0, 0.0, 0.0);
        this.vertices[1].set(0.0, 0.0, 0.0);
        this.vertices[2].set(0.0, 0.0, 0.0);
        this.vertices[3].set(0.0, 0.0, 0.0);

        this.unif.uOriginTexture.value = originTexture;
        this.unif.uTargetTexture.value = targetTexture;
        this.unif.uStyledTexture.value = styledTexture;

        this._updateTodo = this._updateShowUp;
    }

    noAction() {
        
        this.speeds[0] = Math.random() * 5.0 + 1.0; 
        this.speeds[1] = Math.random() * 5.0 + 1.0;
        this.speeds[2] = Math.random() * 5.0 + 1.0; 
        this.speeds[3] = Math.random() * 5.0 + 1.0;

        this._updateTodo = this._updateShowOff;
    }
}
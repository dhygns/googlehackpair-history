import * as THREE from "three"

export default class extends THREE.PerspectiveCamera {
    constructor() {
        super(45, window.innerWidth / window.innerHeight, 1.0, 500.0);
        this.position.z = 20.0;
        this.position.y = 8.0;


    }

    update(t, dt) {
     
        this.position.y = 6.0;
        this.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));
        this.updateMatrix();
    }
}
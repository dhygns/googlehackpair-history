import * as THREE from "three"

export default class extends THREE.Object3D {
    constructor(){
        super();
        this.add(new THREE.Mesh(
            new THREE.PlaneGeometry(2.0, 2.0),
            new THREE.MeshBasicMaterial({color : "white"})
        ));
        this.rotation.x = -Math.PI * 0.5;
        this.scale.x = 100.0;
        this.scale.y = 100.0;
    }

    update(t, dt) {

    }
}
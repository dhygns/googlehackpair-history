import * as THREE from "three"

export default class extends THREE.Object3D{
    constructor(targetObject) {
        super();


        this.target = targetObject;

        this.geom = new THREE.PlaneGeometry(2.0, 2,0);
        this.matr = new THREE.MeshBasicMaterial({color : targetObject.hex});
        this.add(new THREE.Mesh(this.geom, this.matr));
        
    }

    update(t, dt) {
        this.position.x = this.target.position.x;
        this.position.y = this.target.position.y;
        this.position.z = this.target.position.z;

        this.scale.x = this.target.scale.x;
        this.scale.y = this.target.scale.y;
        this.scale.z = this.target.scale.z;
        
        this.rotation.x = this.target.rotation.x;
        this.rotation.y = this.target.rotation.y;
        this.rotation.z = this.target.rotation.z;
        
    }
}
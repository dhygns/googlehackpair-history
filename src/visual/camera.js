import * as THREE from "three"

export default class extends THREE.PerspectiveCamera {
    constructor() {
        super(45, window.innerWidth / window.innerHeight, 1.0, 500.0);
        
        this.timer = 0.0; // for Action;

        this.updateAction = this._updateNoAction;
    }

    update(t, dt) {
        
        this.updateAction(t, dt);

        this.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));
        this.updateMatrix();
    }

    _updateDoAction(t, dt) {
        this.position.z += (10.0 - this.position.z) * dt * 5.0;
        this.position.y += (5.0 - this.position.y) * dt * 3.0;

        this.timer -= dt;
        if(this.timer < 0.0) this.noAction();
    }

    _updateNoAction(t, dt) {
        this.position.z += (20.0 - this.position.z) * dt;
        this.position.y += (10.0 - this.position.y) * dt;
    }

    doAction(limitTime) {
        this.timer = limitTime;
        this.updateAction = this._updateDoAction;
    }

    noAction() {
        this.updateAction = this._updateNoAction;
    }
}
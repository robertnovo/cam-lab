/**
 * Created by novo on 03/03/15.
 */
/// <reference path="boid.ts"/>
module Core {
    export class CameraBoid extends Boid {

        // private members
        private resting:Boolean;
        private target: THREE.Object3D;

        // private camera properties
        private camera: THREE.PerspectiveCamera;
        private cameraHelper: THREE.CameraHelper;

        constructor(posX: number, posY: number, posZ: number, totalMass: number) {
            super(posX, posY, posZ, totalMass);
            this.camera = new THREE.PerspectiveCamera(45, 1, 1, 200);
            this.cameraHelper = new THREE.CameraHelper(this.camera);
            Environment.scene.add(this.cameraHelper);
        }
    }
}
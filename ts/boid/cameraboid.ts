/**
 * Created by novo on 03/03/15.
 */
/// <reference path="boid.ts"/>
/// <reference path="cameraroot.ts"/>
module Core {
    export class CameraBoid extends Boid {

        root: CameraRoot;

        // private members
        private resting:Boolean;
        private target:THREE.Object3D;

        // private camera properties
        private camera:THREE.PerspectiveCamera;
        private cameraHelper:THREE.CameraHelper;

        private _name:string = "CameraBoid";

        constructor(posX:number, posY:number, posZ:number, totalMass:number) {
            super(posX, posY, posZ, totalMass);
            this.camera = new THREE.PerspectiveCamera(45, 1, 1, 200);
            this.camera.position.x = this.position.x;
            this.camera.position.y = this.position.y;
            this.camera.position.z = this.position.z;
            this.cameraHelper = new THREE.CameraHelper(this.camera);
            Environment.scene.add(this.camera);
            Environment.scene.add(this.cameraHelper);

            this.root = new CameraRoot(0,0,0);

            //this.target = new THREE.Object3D();
            //this.target.position.set(100,0,0);
        }

        get name(): string {
            return this._name;
        }
    }
}
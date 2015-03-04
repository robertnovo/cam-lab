/**
 * Created by novo on 03/03/15.
 */
/// <reference path="boid.ts"/>
/// <reference path="rootobject.ts"/>
module Core {
    export class CameraBoid extends Boid {

        root:RootObject;

        // private members
        private resting:boolean;
        private target:THREE.Object3D;

        // private camera properties
        private camera:THREE.PerspectiveCamera;
        private cameraHelper:THREE.CameraHelper;

        constructor(posX:number, posY:number, posZ:number, totalMass:number) {
            super(posX, posY, posZ, totalMass);
            this.camera = new THREE.PerspectiveCamera(45, 1, 1, 200);
            this.camera.position.x = this.position.x;
            this.camera.position.y = this.position.y;
            this.camera.position.z = this.position.z;
            this.cameraHelper = new THREE.CameraHelper(this.camera);
            Environment.scene.add(this.camera);
            Environment.scene.add(this.cameraHelper);

            this.root = new RootObject(0, 0, 0);
            this.resting = false;
            this.maxVelocity = 5;

            // tweening
            this.root.moveTo(new THREE.Vector3(250, 0, 0), 2);
        }

        // override
        think():void {
            if (this.resting) {
                this.steering.wander();
            } else {
                this.steering.seek(this.steering.getRootForce(this.root, 300, 50), 20);
                //this.steering.seek(this.root.position, 20);
            }
        }

        private getCameraToRootVector(cameraPos, rootPos):THREE.Vector3 {
            var vec = new THREE.Vector3();
            vec.subVectors(rootPos, cameraPos);
            return vec;
        }

        update():void {
            //console.log(this.position);
            super.update();
            //this.steering.seek(this.steering.getRootForce(this.root, 1, 50), 20);
            //this.camera.position.x = this.root.position.x;
            //this.camera.position.x = this.x;
            //this.camera.position.z = this.y;
            console.log(this.camera.position);
            var distanceVec = this.getCameraToRootVector(this.camera.position, this.root.position);
            distanceVec.normalize();
            this.camera.lookAt(distanceVec);

            this.root.updateMatrixWorld(true);
        }

        // override super getMaxVelocity
        getMaxVelocity():number {
            return this.resting ? 0 : this.maxVelocity;
        }
    }
}

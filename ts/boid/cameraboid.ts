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
        private static mass: number = 10;
        private static maxVelocity: number = 1;
        private animationtime: number = 0.1;

        constructor(posX:number, posY:number, posZ:number, totalMass:number = 10) {
            super(posX, posY, posZ, totalMass);
            this.camera = new THREE.PerspectiveCamera(45, 1, 20, 1000);
            this.camera.position.x = this.x;
            this.camera.position.y = this.y;
            this.camera.position.z = this.z;
            this.cameraHelper = new THREE.CameraHelper(this.camera);
            //Environment.scene.add(this.camera);
            //Environment.scene.add(this.cameraHelper);

            this.resting = false;

            // tweening
            //this.root.moveTo(new THREE.Vector3(250, 0, 0), this.animationtime);
        }

        setTargetObject(targetObject: RootObject):void {
            this.root = targetObject;
        }

        getCamera():THREE.PerspectiveCamera {
            return this.camera;
        }

        getCameraHelper():THREE.CameraHelper {
            return this.cameraHelper;
        }

        // override
        think():void {
            if (this.resting) {
                console.log("resting");
                this.steering.wander();
            } else {
                //console.log(this.root.position);
                this.steering.applyRootForce(this.root, 200, 200);
                //this.steering.seek(this.root.getPosition().clone(), 50);
            }
        }

        update():void {
            //var camStartRecord = _FrameRecorder.startRecord(this.x, this.position.clone());
            super.update();
            this.camera.position.x = this.x;
            this.camera.position.z = this.z;
            //this.camera.position.y = this.y;
            this.camera.lookAt(this.root.getPosition().clone());

            // recording section
            /* TODO: Implement recording */

            this.root.updateMatrixWorld(true);
        }

        // override super getMaxVelocity
        getMaxVelocity():number {
            return this.resting ? 0 : this.maxVelocity;
        }

        getRoot():RootObject {
            return this.root;
        }
    }
}

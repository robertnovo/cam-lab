/**
 * Created by novo on 04/03/15.
 */
/// <reference path="../../typings/threejs/three.d.ts"/>
/// <reference path="../environment.ts"/>
module Core {
    export class CameraModel {
        mesh: THREE.Mesh;
        camera: THREE.PerspectiveCamera;

        root: RootObject;
        constructor() {
            var geometry = new THREE.BoxGeometry(10, 10, 10);
            var material = new THREE.MeshBasicMaterial({
                color: 0x00ff00
            });
            this.mesh = new THREE.Mesh(geometry, material);
            Environment.scene.add(this.mesh);

            // camera
            this.camera = new THREE.PerspectiveCamera(60, 1, 12, 200);
            this.camera.matrixWorldNeedsUpdate = true;
            var cameraHelper = new THREE.CameraHelper(this.camera);
            Environment.scene.add(cameraHelper);
            Environment.scene.add(this.camera);

            this.root = new RootObject(0,0,0);

        }
    }
}

/**
 * Created by novo on 03/03/15.
 */
/// <reference path="ts/environment.ts"/>
/// <reference path="ts/boid/cameraboid.ts"/>
/// <reference path="typings/threejs/three.d.ts"/>
/// <reference path="typings/OrbitControls.d.ts"/>
/// <reference path="ts/steering-old/cameramodel.ts"/>
module Core {
    export class App {
        overviewCamera;
        controls;
        followCamera:CameraBoid;
        camera: CameraModel;

        constructor() {
            console.log("app init");
            this.overviewCamera = Environment.overViewCamera;
            Environment.scene.add(new THREE.AxisHelper(15));
            //this.camera = new CameraModel();
            this.followCamera = new CameraBoid(40,40,0,100);
            this.controls = new THREE.OrbitControls(this.overviewCamera);
            this.animate();
        }


        render():void {
            Environment.renderer.render(Environment.scene, this.overviewCamera);
            //Environment.renderer.render(Environment.scene, this.followCamera.getCamera());
        }

        update():void {
            this.controls.update();
            TWEEN.update();

            // update boid camera.
            this.followCamera.update();
        }

        animate():void {
            this.render();
            this.update();
            window.requestAnimationFrame(() => this.animate());
        }
    }

    (function () {
        new App();
    })();
}

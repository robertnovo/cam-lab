/**
 * Created by novo on 03/03/15.
 */
/// <reference path="ts/environment.ts"/>
/// <reference path="ts/boid/cameraboid.ts"/>
/// <reference path="typings/threejs/three.d.ts"/>
/// <reference path="typings/OrbitControls.d.ts"/>

    /* TODO:
    * */
module Core {
    export class App {
        overviewCamera;
        controls;
        followCamera:CameraBoid;
        secondCam:CameraBoid;
        thirdCam:CameraBoid;

        constructor() {
            console.log("app init");
            this.overviewCamera = Environment.overViewCamera;
            Environment.scene.add(new THREE.AxisHelper(15));

            /* TODO: Inparametrar animation
            * vart är jag nu
            * vart ska jag
            *
            * */
            // setup cameras
            this.followCamera = this.generateCameraAndAddToScene(-100,50,100);
            this.followCamera.setTargetObject(new RootObject(200,0,0));

            //this.secondCam = this.generateCameraAndAddToScene(-200,0,0);
            //this.secondCam.setTargetObject(new RootObject(100,0,0));

            //this.thirdCam = this.generateCameraAndAddToScene(300,100,-100);
            //this.thirdCam.setTargetObject(new RootObject(0,0,100));

            this.controls = new THREE.OrbitControls(this.overviewCamera);
            this.animate();
        }

        generateCameraAndAddToScene(x:number, y:number, z:number):CameraBoid {
            var camera: CameraBoid = new CameraBoid(x,y,z);
            Environment.scene.add(camera.getCamera());
            Environment.scene.add(camera.getCameraHelper());
            return camera;
        }
        
        render():void {
            Environment.renderer.render(Environment.scene, this.overviewCamera);
            //Environment.renderer.render(Environment.scene, this.followCamera.getCamera());
        }

        update():void {
            this.controls.update();
            //TWEEN.update();

            // update boid camera.
            this.followCamera.update();
            //this.secondCam.update();
            //this.thirdCam.update();
        }

        /* TODO: Implement simulation loop */

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

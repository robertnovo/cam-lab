/**
 * Created by novo on 03/03/15.
 */
/// <reference path="ts/environment.ts"/>
/// <reference path="ts/boid/cameraboid.ts"/>
/// <reference path="typings/threejs/three.d.ts"/>
/// <reference path="typings/OrbitControls.d.ts"/>
module Core {
    export class App {
        overviewCamera;
        controls;
        followCamera:CameraBoid;

        constructor() {
            console.log("app init");
            this.overviewCamera = Environment.overViewCamera;
            Environment.scene.add(new THREE.AxisHelper(15));
            this.followCamera = new CameraBoid(0,30,0);
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

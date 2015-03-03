/**
 * Created by novo on 03/03/15.
 */
/// <reference path="ts/environment.ts"/>
module Core {
    export class App {
        overviewCamera;

        constructor() {
            console.log("app init");
            this.overviewCamera = Environment.overViewCamera;
            Environment.scene.add(new THREE.AxisHelper(15));
            this.animate();
        }


        render():void {
            Environment.renderer.render(Environment.scene, this.overviewCamera);
        }

        update():void {
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
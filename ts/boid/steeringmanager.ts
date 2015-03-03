/**
 * Created by novo on 03/03/15.
 */
/// <reference path="../../typings/threejs/three.d.ts"/>
/// <reference path="iboid.ts"/>
module Core {
    export class SteeringManager {
        // seek / flee
        desired: THREE.Vector3;

        // private members
        private steering: THREE.Vector3;
        private host: IBoid;

        constructor(host: IBoid) {
            console.log("steering manager init");
            this.host = host;
        }
    }
}
/**
 * Created by novo on 03/03/15.
 */
/// <reference path="../../typings/threejs/three.d.ts"/>
module Boid {
    export interface IBoid {
        getVelocity(): THREE.Vector3;
        getMaxVelocity(): number;
        getPosition(): THREE.Vector3;
        getMass(): number;
    }
}
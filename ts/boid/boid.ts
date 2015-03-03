/**
 * Created by novo on 03/03/15.
 */
/// <reference path="iboid.ts"/>
/// <reference path="steeringmanager.ts"/>
module Core {
    export class Boid implements IBoid {

        // public members
        position:THREE.Vector3;
        steering:SteeringManager;

        // private members
        maxVelocity:number;

        constructor(posX:number, posY:number, posZ:number, totalMass:number) {
            console.info('boid init', this);
            this.position = new THREE.Vector3(posX, posY, posZ);
            this.steering = new SteeringManager(this);
        }

        update():void {
        }

        getVelocity():THREE.Vector3 {
            throw new Error("not implemented");
        }

        getMaxVelocity():number {
            throw new Error("not implemented");
        }

        getPosition():THREE.Vector3 {
            throw new Error("not implemented");
        }

        getMass():number {
            throw new Error("not implemented");
        }
    }
}
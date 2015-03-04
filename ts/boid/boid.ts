/**
 * Created by novo on 03/03/15.
 */
/// <reference path="iboid.ts"/>
/// <reference path="steeringmanager.ts"/>
/// <reference path="../stackfsm.ts"/>
module Core {
    export class Boid implements IBoid {

        // public members
        position:THREE.Vector3;
        velocity:THREE.Vector3;
        steering:SteeringManager;

        mass:number;

        maxVelocity:number = 3;
        x:number;
        y:number;
        z:number;

        constructor(posX:number, posY:number, posZ:number, totalMass:number) {
            console.info('boid init', this);
            this.position = new THREE.Vector3(posX, posY, posZ);
            this.velocity = new THREE.Vector3(); // initial velocity 0
            this.mass = totalMass;
            this.steering = new SteeringManager(this);

            this.x = this.position.x;
            this.y = this.position.y;
            this.z = this.position.z;
        }

        update():void {
            this.steering.update();
            this.think();
            this.x = this.position.x;
            this.y = this.position.y;
            this.z = this.position.z;
        }

        think() :void {
            this.steering.wander();
        }


        getVelocity():THREE.Vector3 {
            return this.velocity;
        }

        getMaxVelocity():number {
            return this.maxVelocity;
        }

        getPosition():THREE.Vector3 {
            return this.position;
        }

        getMass():number {
            return this.mass;
        }
    }
}

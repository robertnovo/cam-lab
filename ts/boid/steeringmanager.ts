/**
 * Created by novo on 03/03/15.
 */
/// <reference path="../../typings/threejs/three.d.ts"/>
/// <reference path="iboid.ts"/>
module Core {
    export class SteeringManager {

        // seek / flee
        desired:THREE.Vector3;

        steering:THREE.Vector3;

        ahead:THREE.Vector3;
        behind:THREE.Vector3;

        // private members
        private host:IBoid;

        constructor(host:IBoid) {
            console.log("steering manager init");
            this.host = host;
            this.desired = new THREE.Vector3();
            this.steering = new THREE.Vector3();
            this.truncate(this.host.getVelocity(), this.host.getMaxVelocity());
            this.ahead = new THREE.Vector3();
            this.behind = new THREE.Vector3();
        }

        update():void {
            var velocity:THREE.Vector3 = this.host.getVelocity();
            var position:THREE.Vector3 = this.host.getPosition();
            /* TODO: Lägg in vettig MAX_FORCE, inte 5.4 */
            this.truncate(this.steering, 10);
            this.steering.multiplyScalar(1 / this.host.getMass());
            velocity.add(this.steering);
            this.truncate(velocity, this.host.getMaxVelocity());
            position.add(velocity);
        }

        seek(target:THREE.Vector3, slowingRadius:number = 20):void {
            this.steering.add(this.doSeek(target, this.host.getMaxVelocity()));
        }

        private doSeek(target:THREE.Vector3, slowingRadius:number = 20):THREE.Vector3 {
            var force:THREE.Vector3;
            var distance:number;

            this.desired = target.sub(this.host.getPosition());

            distance = this.desired.length();
            this.desired.normalize();

            if (distance <= slowingRadius) {
                this.desired.multiplyScalar(this.host.getMaxVelocity() * distance / slowingRadius);
                if (distance < 3) {
                    //this.desired.multiplyScalar(0);
                    this.reset();
                }
            } else {
                this.desired.multiplyScalar(this.host.getMaxVelocity());
            }

            force = this.desired.sub(this.host.getVelocity());
            return force;
        }

        wander():void {
            console.log("wander");
            this.steering.add(this.doWander());
        }

        private doWander():THREE.Vector3 {
            /*TODO: Implement wander logic. For now it returns (0,0,0) */
            return new THREE.Vector3();
        }

        applyRootForce(root:RootObject, avoidForce:number, behindDistance:number):void {
            this.steering.add(this.doApplyRootForce(root, avoidForce, behindDistance));
            this.steering.add(new THREE.Vector3(-1,0,-2));
        }

        private doApplyRootForce(root:RootObject, avoidForce:number, behindDistance:number):THREE.Vector3 {
            var _avoidForce = avoidForce;
            var _behindDistance = behindDistance;
            var tv = root.velocity.clone();
            var force = new THREE.Vector3(0, 0, 0);
            tv.normalize();
            tv.multiplyScalar(_behindDistance);
            this.ahead = root.position.clone().add(tv);
            tv.multiplyScalar(-1);
            this.behind = root.position.clone().add(tv);
            force.add(this.doSeek(this.behind, _avoidForce));
            return force;
        }

        reset():void {
            this.steering.x = this.steering.y = this.steering.z = 0;
            this.desired.x = this.desired.y = this.desired.z = 0;
        }

        truncate(vector:THREE.Vector3, max:number):void {
            var i:number;
            i = max / vector.length();
            i = i < 1.0 ? i : 1.0;
            vector.multiplyScalar(i);
        }
    }
}

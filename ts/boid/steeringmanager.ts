/**
 * Created by novo on 03/03/15.
 */
/// <reference path="../../typings/threejs/three.d.ts"/>
/// <reference path="iboid.ts"/>
module Core {
    export class SteeringManager {

        // seek / flee
        path:THREE.Vector3;

        steering:THREE.Vector3;

        ahead:THREE.Vector3;
        behind:THREE.Vector3;

        // private members
        private host:IBoid;
        private randomX;

        constructor(host:IBoid) {
            console.log("steering manager init");
            this.host = host;
            this.path = new THREE.Vector3();
            this.steering = new THREE.Vector3();
            this.truncate(this.host.getVelocity(), this.host.getMaxVelocity());
            this.ahead = new THREE.Vector3();
            this.behind = new THREE.Vector3();
            this.randomX = Math.random() > 0.5 ? 1 : 0;
            //this.randomX = 1;
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

        private doSeek(target:THREE.Vector3, slowingRadius:number = 100):THREE.Vector3 {
            var force:THREE.Vector3;
            var distanceToTarget:number;
            this.path = target.sub(this.host.getPosition());

            distanceToTarget = this.path.length();
            this.path.normalize();
            var direction: THREE.Vector3 = this.path.clone();

            if (distanceToTarget <= slowingRadius) {
                // blir velocity
                this.path.multiplyScalar(this.host.getMaxVelocity() * distanceToTarget / slowingRadius);
                if (distanceToTarget < 30) {
                    //this.path.multiplyScalar(0);
                    this.stop();
                }
            } else {
                this.path.multiplyScalar(this.host.getMaxVelocity());
            }

            force = this.path.sub(this.host.getVelocity());
            return force;
        }

        private distance(a, b): number {
            return Math.sqrt((a.x - b.x) * (a.y - b.y) + (a.z - b.z));
        }

        private isOnLeaderSight(leader: RootObject, leaderAhead: THREE.Vector3) : boolean {
            return this.distance(leaderAhead, this) <= leader.SIGHT_RADIUS || this.distance(leader.position, this) <= leader.SIGHT_RADIUS;
        }

        private arrive(target :THREE.Vector3, slowingRadius :number = 200) :THREE.Vector3 {
            return this.doSeek(target, slowingRadius);
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
            /* TODO: hårtkodat slutposition för vart kameran ska ställa sig, nedan.*/
            this.steering.add(new THREE.Vector3(1,1,1));
            //this.steering.add(new THREE.Vector3(this.randomX,this.randomX,this.randomX)); // building entrance
        }

        private doApplyRootForce(root:RootObject, avoidForce:number, behindDistance:number):THREE.Vector3 {
            var _avoidForce = avoidForce;
            var _behindDistance = behindDistance;
            var tv = root.velocity.clone();
            //var tv = new THREE.Vector3();
            var force = new THREE.Vector3(0, 0, 0);
            tv.normalize();
            tv.multiplyScalar(_behindDistance);
            this.ahead = root.position.clone().add(tv);
            tv.multiplyScalar(-1);
            this.behind = root.position.clone().add(tv);

            force.add(this.doSeek(this.behind, _avoidForce));
            return force;
        }

        stop():void {
            this.steering.x = this.steering.y = this.steering.z = 0;
            this.path.x = this.path.y = this.path.z = 0;
        }

        truncate(vector:THREE.Vector3, max:number):void {
            var i:number;
            i = max / vector.length();
            i = i < 1.0 ? i : 1.0;
            vector.multiplyScalar(i);
        }
    }
}

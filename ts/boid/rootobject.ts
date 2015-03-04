/**
 * Created by novo on 03/03/15.
 */
/// <reference path="boid.ts"/>

/// <reference path="../../typings/tween.d.ts"/>
module Core {
    export class RootObject extends THREE.Object3D {

        private mesh:THREE.Mesh;

        velocity: THREE.Vector3;
        desired: THREE.Vector3;
        steering: THREE.Vector3;
        behind: THREE.Vector3;
        ahead: THREE.Vector3;
        avoidance: THREE.Vector3;

        constructor(posX:number, posY:number, posZ:number) {
            super();
            this.position.set(posX, posY, posZ);

            // debug box
            var geometry = new THREE.BoxGeometry(5, 5, 5);
            var material = new THREE.MeshBasicMaterial({color: 0x000000});
            this.mesh = new THREE.Mesh(geometry, material);
            this.velocity = new THREE.Vector3();

            this.desired = new THREE.Vector3(0, 0, 0);
            this.steering = new THREE.Vector3(0, 0, 0);
            this.behind = new THREE.Vector3(0, 0, 0);
            this.ahead = new THREE.Vector3(0, 0, 0);
            this.avoidance = new THREE.Vector3(0, 0, 0);

            this.children.push(this.mesh);
            Environment.scene.add(this);
        }

        moveTo(target:THREE.Vector3, seconds:number):void {
            var Tween = new TWEEN.Tween(this.position)
                .to({
                    x: target.x,
                    y: target.y,
                    z: target.z
                }, seconds * 1000)
                .repeat(Infinity)
                .delay(1000)
                .yoyo(true)
                .easing(TWEEN.Easing.Exponential.InOut)
                .onUpdate((interpolation) => {
                    // move mesh
                    this.mesh.position.lerp(this.position, interpolation);
                })
                .start();
        }

        getPosition() {
            return this.position;
        }
    }
}

/**
 * Created by novo on 03/03/15.
 */
/// <reference path="boid.ts"/>

/// <reference path="../../typings/tween.d.ts"/>
module Core {
    export class CameraRoot extends THREE.Object3D {

        mesh:THREE.Mesh;
        geometry:THREE.BoxGeometry;
        material:THREE.MeshBasicMaterial;

        constructor(posX:number, posY:number, posZ:number) {
            super();
            this.position.set(posX, posY, posZ);
            // debug box

            var geometry = new THREE.BoxGeometry(5, 5, 5);
            var material = new THREE.MeshBasicMaterial({color: 0x000000});
            this.mesh = new THREE.Mesh(geometry, material);

            this.children.push(this.mesh);

            Environment.scene.add(this);

            // tweening
            this.moveTo(new THREE.Vector3(250, 0, 0), 2);
        }

        moveTo(target:THREE.Vector3, duration:number):void {
            var Tween = new TWEEN.Tween(this.position)
                .to({
                    x: target.x,
                    y: target.y,
                    z: target.z
                }, duration * 1000)
                .repeat(Infinity)
                .delay(1000)
                .yoyo(true)
                .easing(TWEEN.Easing.Exponential.InOut)
                .onUpdate((interpolation) => {
                    //console.log(this);
                    //console.log(interpolation);
                    console.log(this.position);
                    //move mesh
                    //console.log(this.mesh.position);
                    this.mesh.position.lerp(this.position, interpolation);
                })
                .start();
        }

    }
}
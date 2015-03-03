/// <reference path="../../typings/threejs/three.d.ts"/>
/**
 * Created by novo on 03/03/15.
 */
/// <reference path="iboid.ts"/>
var Boid;
(function (_Boid) {
    var Boid = (function () {
        function Boid(posX, posY, posZ, totalMass) {
            console.info("boid init");
            this.position.set(posX, posY, posZ);
        }
        Boid.prototype.getVelocity = function () {
            throw new Error("not implemented");
        };
        Boid.prototype.getMaxVelocity = function () {
            throw new Error("not implemented");
        };
        Boid.prototype.getPosition = function () {
            throw new Error("not implemented");
        };
        Boid.prototype.getMass = function () {
            throw new Error("not implemented");
        };
        return Boid;
    })();
})(Boid || (Boid = {}));
//# sourceMappingURL=bundle.js.map
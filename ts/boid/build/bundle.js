/// <reference path="../../typings/threejs/three.d.ts"/>
/**
 * Created by novo on 03/03/15.
 */
/// <reference path="../../typings/threejs/three.d.ts"/>
/// <reference path="iboid.ts"/>
var Core;
(function (Core) {
    var SteeringManager = (function () {
        function SteeringManager(host) {
            console.log("steering manager init");
            this.host = host;
        }
        return SteeringManager;
    })();
    Core.SteeringManager = SteeringManager;
})(Core || (Core = {}));
/**
 * Created by novo on 03/03/15.
 */
/// <reference path="iboid.ts"/>
/// <reference path="steeringmanager.ts"/>
var Core;
(function (Core) {
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
    Core.Boid = Boid;
})(Core || (Core = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by novo on 03/03/15.
 */
/// <reference path="boid.ts"/>
var Core;
(function (Core) {
    var CameraBoid = (function (_super) {
        __extends(CameraBoid, _super);
        function CameraBoid(posX, posY, posZ, totalMass) {
            _super.call(this, posX, posY, posZ, totalMass);
        }
        return CameraBoid;
    })(Core.Boid);
    Core.CameraBoid = CameraBoid;
})(Core || (Core = {}));
//# sourceMappingURL=bundle.js.map
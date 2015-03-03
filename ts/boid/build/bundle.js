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
        SteeringManager.prototype.update = function () {
        };
        SteeringManager.prototype.truncate = function (vector, max) {
            var i;
            i = max / vector.length();
            i = i < 1.0 ? i : 1.0;
            vector.multiplyScalar(i);
        };
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
            console.info("boid init", this);
            this.position = new THREE.Vector3(posX, posY, posZ);
            this.steering = new Core.SteeringManager(this);
        }
        Boid.prototype.update = function () {
        };
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
/**
 * Created by novo on 03/03/15.
 */
/// <reference path="boid.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../typings/tween.d.ts"/>
var Core;
(function (Core) {
    var CameraRoot = (function (_super) {
        __extends(CameraRoot, _super);
        function CameraRoot(posX, posY, posZ, totalMass) {
            _super.call(this, posX, posY, posZ, totalMass);
            console.log(TWEEN);
        }
        return CameraRoot;
    })(Core.Boid);
    Core.CameraRoot = CameraRoot;
})(Core || (Core = {}));
//# sourceMappingURL=bundle.js.map
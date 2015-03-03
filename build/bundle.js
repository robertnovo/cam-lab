/**
 * Created by novo on 03/03/15.
 */
/// <reference path="../typings/threejs/three.d.ts"/>
var Environment;
(function (Environment) {
    var SceneFactory = (function () {
        function SceneFactory() {
        }
        Object.defineProperty(SceneFactory, "getScene", {
            get: function () {
                return SceneFactory.scene;
            },
            enumerable: true,
            configurable: true
        });
        SceneFactory.scene = new THREE.Scene();
        return SceneFactory;
    })();
    var ContainerFactory = (function () {
        function ContainerFactory() {
        }
        Object.defineProperty(ContainerFactory, "getContainer", {
            get: function () {
                return this.container;
            },
            enumerable: true,
            configurable: true
        });
        ContainerFactory.container = document.getElementById('app-container');
        return ContainerFactory;
    })();
    var RenderFactory = (function () {
        function RenderFactory() {
            var _this = this;
            this.renderer = new THREE.WebGLRenderer({
                antialias: true
            });
            var container = ContainerFactory.getContainer;
            this.renderer.setClearColor(0xf2f2f2);
            container.appendChild(this.renderer.domElement);
            this.updateSize = function () {
                _this.renderer.setSize(window.innerWidth - 30, window.innerHeight - 30);
            };
            this.updateSize();
            window.addEventListener('resize', this.updateSize, false);
        }
        Object.defineProperty(RenderFactory.prototype, "getRenderer", {
            get: function () {
                return this.renderer;
            },
            enumerable: true,
            configurable: true
        });
        return RenderFactory;
    })();
    var CameraFactory = (function () {
        function CameraFactory(fov, aspect, near, far) {
            var _this = this;
            this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
            this.camera.position.x = 200;
            this.camera.position.y = 200;
            this.camera.position.z = 200;
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));
            this.updateSize = function () {
                _this.camera.aspect = window.innerWidth / window.innerHeight;
                _this.camera.updateProjectionMatrix();
            };
            window.addEventListener("resize", this.updateSize, false);
            this.updateSize();
        }
        Object.defineProperty(CameraFactory.prototype, "getCameraInstance", {
            get: function () {
                return this.camera;
            },
            enumerable: true,
            configurable: true
        });
        return CameraFactory;
    })();
    Environment.scene = SceneFactory.getScene;
    Environment.container = ContainerFactory.getContainer;
    Environment.overViewCamera = new CameraFactory(60, 1, 1, 1000).getCameraInstance;
    Environment.renderer = new RenderFactory().getRenderer;
})(Environment || (Environment = {}));
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
            console.info('boid init', this);
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
        function CameraRoot(posX, posY, posZ) {
            _super.call(this);
            this.position.set(posX, posY, posZ);
            // debug box
            var geometry = new THREE.BoxGeometry(5, 5, 5);
            var material = new THREE.MeshBasicMaterial({ color: 0x000000 });
            this.mesh = new THREE.Mesh(geometry, material);
            this.children.push(this.mesh);
            Environment.scene.add(this);
            // tweening
            this.moveTo(new THREE.Vector3(250, 0, 0), 2);
        }
        CameraRoot.prototype.moveTo = function (target, duration) {
            var _this = this;
            var Tween = new TWEEN.Tween(this.position).to({
                x: target.x,
                y: target.y,
                z: target.z
            }, duration * 1000).repeat(Infinity).delay(1000).yoyo(true).easing(TWEEN.Easing.Exponential.InOut).onUpdate(function (interpolation) {
                //console.log(this);
                //console.log(interpolation);
                console.log(_this.position);
                //move mesh
                //console.log(this.mesh.position);
                _this.mesh.position.lerp(_this.position, interpolation);
            }).start();
        };
        return CameraRoot;
    })(THREE.Object3D);
    Core.CameraRoot = CameraRoot;
})(Core || (Core = {}));
/**
 * Created by novo on 03/03/15.
 */
/// <reference path="boid.ts"/>
/// <reference path="cameraroot.ts"/>
var Core;
(function (Core) {
    var CameraBoid = (function (_super) {
        __extends(CameraBoid, _super);
        function CameraBoid(posX, posY, posZ, totalMass) {
            _super.call(this, posX, posY, posZ, totalMass);
            this._name = "CameraBoid";
            this.camera = new THREE.PerspectiveCamera(45, 1, 1, 200);
            this.camera.position.x = this.position.x;
            this.camera.position.y = this.position.y;
            this.camera.position.z = this.position.z;
            this.cameraHelper = new THREE.CameraHelper(this.camera);
            Environment.scene.add(this.camera);
            Environment.scene.add(this.cameraHelper);
            this.root = new Core.CameraRoot(0, 0, 0);
            //this.target = new THREE.Object3D();
            //this.target.position.set(100,0,0);
        }
        Object.defineProperty(CameraBoid.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        return CameraBoid;
    })(Core.Boid);
    Core.CameraBoid = CameraBoid;
})(Core || (Core = {}));
/**
 * Created by novo on 03/03/15.
 */
/// <reference path="ts/environment.ts"/>
/// <reference path="ts/boid/cameraboid.ts"/>
/// <reference path="typings/threejs/three.d.ts"/>
/// <reference path="typings/OrbitControls.d.ts"/>
var Core;
(function (Core) {
    var App = (function () {
        function App() {
            console.log("app init");
            this.overviewCamera = Environment.overViewCamera;
            Environment.scene.add(new THREE.AxisHelper(15));
            this.followCamera = new Core.CameraBoid(0, 20, 0, 10);
            this.controls = new THREE.OrbitControls(this.overviewCamera);
            this.animate();
        }
        App.prototype.render = function () {
            Environment.renderer.render(Environment.scene, this.overviewCamera);
        };
        App.prototype.update = function () {
            this.controls.update();
            TWEEN.update();
        };
        App.prototype.animate = function () {
            var _this = this;
            this.render();
            this.update();
            window.requestAnimationFrame(function () { return _this.animate(); });
        };
        return App;
    })();
    Core.App = App;
    (function () {
        new App();
    })();
})(Core || (Core = {}));
//# sourceMappingURL=bundle.js.map
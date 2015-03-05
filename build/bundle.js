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
            this.path = new THREE.Vector3();
            this.steering = new THREE.Vector3();
            this.truncate(this.host.getVelocity(), this.host.getMaxVelocity());
            this.ahead = new THREE.Vector3();
            this.behind = new THREE.Vector3();
            this.randomX = Math.random() > 0.5 ? 1 : 0;
            //this.randomX = 1;
        }
        SteeringManager.prototype.update = function () {
            var velocity = this.host.getVelocity();
            var position = this.host.getPosition();
            /* TODO: Lägg in vettig MAX_FORCE, inte 5.4 */
            this.truncate(this.steering, 10);
            this.steering.multiplyScalar(1 / this.host.getMass());
            velocity.add(this.steering);
            this.truncate(velocity, this.host.getMaxVelocity());
            position.add(velocity);
        };
        SteeringManager.prototype.seek = function (target, slowingRadius) {
            if (slowingRadius === void 0) { slowingRadius = 20; }
            this.steering.add(this.doSeek(target, this.host.getMaxVelocity()));
        };
        SteeringManager.prototype.doSeek = function (target, slowingRadius) {
            if (slowingRadius === void 0) { slowingRadius = 100; }
            var force;
            var distanceToTarget;
            this.path = target.sub(this.host.getPosition());
            distanceToTarget = this.path.length();
            this.path.normalize();
            var direction = this.path.clone();
            if (distanceToTarget <= slowingRadius) {
                // blir velocity
                this.path.multiplyScalar(this.host.getMaxVelocity() * distanceToTarget / slowingRadius);
                if (distanceToTarget < 30) {
                    //this.path.multiplyScalar(0);
                    this.stop();
                }
            }
            else {
                this.path.multiplyScalar(this.host.getMaxVelocity());
            }
            force = this.path.sub(this.host.getVelocity());
            return force;
        };
        SteeringManager.prototype.distance = function (a, b) {
            return Math.sqrt((a.x - b.x) * (a.y - b.y) + (a.z - b.z));
        };
        SteeringManager.prototype.isOnLeaderSight = function (leader, leaderAhead) {
            return this.distance(leaderAhead, this) <= leader.SIGHT_RADIUS || this.distance(leader.position, this) <= leader.SIGHT_RADIUS;
        };
        SteeringManager.prototype.arrive = function (target, slowingRadius) {
            if (slowingRadius === void 0) { slowingRadius = 200; }
            return this.doSeek(target, slowingRadius);
        };
        SteeringManager.prototype.wander = function () {
            console.log("wander");
            this.steering.add(this.doWander());
        };
        SteeringManager.prototype.doWander = function () {
            /*TODO: Implement wander logic. For now it returns (0,0,0) */
            return new THREE.Vector3();
        };
        SteeringManager.prototype.applyRootForce = function (root, avoidForce, behindDistance) {
            this.steering.add(this.doApplyRootForce(root, avoidForce, behindDistance));
            /* TODO: hårtkodat slutposition för vart kameran ska ställa sig, nedan.*/
            this.steering.add(new THREE.Vector3(1, 1, 1));
            //this.steering.add(new THREE.Vector3(this.randomX,this.randomX,this.randomX)); // building entrance
        };
        SteeringManager.prototype.doApplyRootForce = function (root, avoidForce, behindDistance) {
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
        };
        SteeringManager.prototype.stop = function () {
            this.steering.x = this.steering.y = this.steering.z = 0;
            this.path.x = this.path.y = this.path.z = 0;
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
 * Created by novo on 04/03/15.
 */
var AI;
(function (AI) {
    var StackFSM = (function () {
        function StackFSM() {
            this.stack = new Array();
        }
        StackFSM.prototype.update = function () {
            var currentStateFunction = this.getCurrentState();
            if (this.getCurrentState() != null) {
                currentStateFunction();
            }
        };
        StackFSM.prototype.popState = function () {
            return this.stack.pop();
        };
        StackFSM.prototype.pushState = function (state) {
            if (this.getCurrentState() != state) {
                this.stack.push(state);
            }
        };
        StackFSM.prototype.getCurrentState = function () {
            return (this.stack.length > 0) ? this.stack[this.stack.length - 1] : null;
        };
        return StackFSM;
    })();
    AI.StackFSM = StackFSM;
})(AI || (AI = {}));
/**
 * Created by novo on 03/03/15.
 */
/// <reference path="iboid.ts"/>
/// <reference path="steeringmanager.ts"/>
/// <reference path="../stackfsm.ts"/>
var Core;
(function (Core) {
    var Boid = (function () {
        function Boid(posX, posY, posZ, totalMass) {
            this.maxVelocity = 3;
            console.info('boid init', this);
            this.position = new THREE.Vector3(posX, posY, posZ);
            this.velocity = new THREE.Vector3(); // initial velocity 0
            this.mass = totalMass;
            this.steering = new Core.SteeringManager(this);
            this.x = this.position.x;
            this.y = this.position.y;
            this.z = this.position.z;
        }
        Boid.prototype.think = function () {
            this.steering.wander();
        };
        Boid.prototype.getAngle = function (vector) {
            return Math.atan2(vector.z, vector.x);
        };
        Boid.prototype.update = function () {
            this.think();
            this.steering.update();
            this.x = this.position.x;
            this.y = this.position.y;
            this.z = this.position.z;
        };
        Boid.prototype.drawPoints = function (recording) {
            var path = recording.getPositionArray;
            var time = recording.getTimeArray;
            var geometry = new THREE.Geometry();
            var material = new THREE.LineBasicMaterial({
                color: 0x00ff00
            });
            for (var i = path.length - 1; i >= 0; i--) {
                geometry.vertices.push(new THREE.Vector3(path[i].x, path[i].y, path[i].z));
            }
            var line = new THREE.Line(geometry, material);
            Environment.scene.add(line);
        };
        Boid.prototype.getVelocity = function () {
            return this.velocity;
        };
        Boid.prototype.getMaxVelocity = function () {
            return this.maxVelocity;
        };
        Boid.prototype.getPosition = function () {
            return this.position;
        };
        Boid.prototype.getMass = function () {
            return this.mass;
        };
        Boid.prototype.getRoot = function () {
            throw new Error("only works on overrides");
        };
        return Boid;
    })();
    Core.Boid = Boid;
})(Core || (Core = {}));
/**
 * Created by novo on 04/03/15.
 */
/// <reference path="../typings/threejs/three.d.ts"/>
var Core;
(function (Core) {
    var RecordData = (function () {
        function RecordData(lookAtArray, positionArray, timeArray) {
            this._clock = new THREE.Clock();
            this._isActive = false;
            this._duration = 0;
            this._lookAtArray = lookAtArray;
            this._positionArray = positionArray;
            this._timeArray = timeArray;
        }
        RecordData.prototype.updateRecordData = function (direction, position) {
            this.addRecordData(direction, position, this._clock.getElapsedTime());
        };
        RecordData.prototype.startRecordData = function (direction, position) {
            this._isActive = true;
            this.addRecordData(direction, position, 0);
            this._clock.start();
        };
        RecordData.prototype.stopRecordData = function (direction, position) {
            this._isActive = false;
            this._clock.stop();
            this._duration = this._clock.getElapsedTime();
            this.addRecordData(direction, position, this._duration);
            for (var i = 0; i < this._timeArray.length; i++) {
                this._timeArray[i] = this._timeArray[i] / this._duration;
            }
        };
        Object.defineProperty(RecordData.prototype, "getDirectionArray", {
            get: function () {
                return this._lookAtArray;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RecordData.prototype, "getTimeArray", {
            get: function () {
                return this._timeArray;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RecordData.prototype, "getPositionArray", {
            get: function () {
                return this._positionArray;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RecordData.prototype, "getIsActive", {
            get: function () {
                return this._isActive;
            },
            enumerable: true,
            configurable: true
        });
        RecordData.prototype.addRecordData = function (direction, position, time) {
            this._lookAtArray.push(direction);
            this._positionArray.push(position);
            this._timeArray.push(time);
        };
        return RecordData;
    })();
    Core.RecordData = RecordData;
    /* TODO: Make singleton */
    var FrameRecorder = (function () {
        function FrameRecorder() {
            this._activeRecords = new Array();
        }
        FrameRecorder.prototype.startRecord = function (position, direction) {
            var recordData = this.createEmtpyRecord();
            recordData.startRecordData(position, direction);
            this._activeRecords.push(recordData);
            return this._activeRecords.length - 1;
        };
        FrameRecorder.prototype.stopRecord = function (arrayIndex, direction, position) {
            this._activeRecords[arrayIndex].stopRecordData(direction, position);
        };
        FrameRecorder.prototype.updateRecord = function (arrayIndex, direction, position) {
            this._activeRecords[arrayIndex].updateRecordData(direction, position);
        };
        FrameRecorder.prototype.exportAndRemoveRecord = function (arrayIndex) {
            this.validateRecord(this._activeRecords[arrayIndex]);
            // all good.
            var record = this.copyRecordData(this._activeRecords[arrayIndex]);
            this._activeRecords[arrayIndex] = null;
            return record;
        };
        FrameRecorder.prototype.exportRecord = function (arrayIndex) {
            this.validateRecord(this._activeRecords[arrayIndex]);
            return this.copyRecordData(this._activeRecords[arrayIndex]);
        };
        FrameRecorder.prototype.removeRecord = function (arrayIndex) {
            this.validateRecord(this._activeRecords[arrayIndex]);
            this._activeRecords[arrayIndex] = null;
        };
        FrameRecorder.prototype.validateRecord = function (record) {
            if (record.getIsActive) {
                throw new Error("current record is active");
            }
        };
        FrameRecorder.prototype.createEmtpyRecord = function () {
            return new RecordData(new Array(), new Array(), new Array());
        };
        FrameRecorder.prototype.copyRecordData = function (data) {
            return new RecordData(data.getDirectionArray, data.getPositionArray, data.getTimeArray);
        };
        return FrameRecorder;
    })();
    Core._FrameRecorder = new FrameRecorder();
})(Core || (Core = {}));
/*
 FLOW

 // precis när kameran ska börja
 var startIndex = FrameRecorder.startRecord(startPos, lookAt-direction); // returnerar array index (aI)

 // each frame
 FrameRecorder.updateRecord(startIndex, currentPos, currentLookat);

 // stop
 FrameRecorder.stopRecord(startIndex, currentPOs, currentLookat);


 var record = FrameRecord.exportAndRemoveRecord(startIndex);
 =>  Recordata
 */
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
/// <reference path="../framerecorder.ts"/>
/// <reference path="../../typings/tween.d.ts"/>
/// <reference path="../framerecorder.ts"/>
var Core;
(function (Core) {
    var RootObject = (function (_super) {
        __extends(RootObject, _super);
        function RootObject(posX, posY, posZ) {
            _super.call(this);
            this.SIGHT_RADIUS = 50;
            this.position.set(posX, posY, posZ);
            // debug box
            var geometry = new THREE.BoxGeometry(5, 5, 5);
            var material = new THREE.MeshBasicMaterial({ color: 0x000000 });
            this.mesh = new THREE.Mesh(geometry, material);
            this.velocity = new THREE.Vector3();
            this.desired = new THREE.Vector3(0, 0, 0);
            this.steering = new THREE.Vector3(0, 0, 0);
            this.behind = new THREE.Vector3(0, 0, 0);
            this.ahead = new THREE.Vector3(0, 0, 0);
            this.avoidance = new THREE.Vector3(0, 0, 0);
            this.mesh.position.set(this.position.x, this.position.y, this.position.z);
            this.children.push(this.mesh);
            Environment.scene.add(this);
        }
        RootObject.prototype.moveTo = function (target, seconds) {
            var _this = this;
            var recordIndex;
            var Tween = new TWEEN.Tween(this.position).to({
                x: target.x,
                y: target.y,
                z: target.z
            }, seconds * 1000).delay(1000).easing(TWEEN.Easing.Exponential.InOut).onUpdate(function (interpolation) {
                // move mesh
                var vec = _this.position.clone();
                vec = vec.lerp(vec, interpolation);
                _this.mesh.position.lerp(_this.position, interpolation);
                Core._FrameRecorder.updateRecord(recordIndex, vec, vec);
            }).onStart(function () {
                console.log("initialize cam record");
                //console.log(this.position);
                recordIndex = Core._FrameRecorder.startRecord(_this.position.clone(), _this.position.clone());
            }).onComplete(function () {
                Core._FrameRecorder.stopRecord(recordIndex, _this.mesh.position, _this.mesh.position);
                //this.drawPoints(_FrameRecorder.exportRecord(recordIndex));
                var recordData = Core._FrameRecorder.exportAndRemoveRecord(recordIndex);
                //_FrameRecorder.exportRecord(recordIndex);
            }).start();
        };
        RootObject.prototype.drawPoints = function (recording) {
            var path = recording.getPositionArray;
            var time = recording.getTimeArray;
            var geometry = new THREE.Geometry();
            var material = new THREE.LineBasicMaterial({
                color: 0x00ff00
            });
            for (var i = path.length - 1; i >= 0; i--) {
                geometry.vertices.push(new THREE.Vector3(path[i].x, path[i].y, path[i].z));
            }
            var line = new THREE.Line(geometry, material);
            Environment.scene.add(line);
        };
        RootObject.prototype.getPosition = function () {
            return this.position;
        };
        return RootObject;
    })(THREE.Object3D);
    Core.RootObject = RootObject;
})(Core || (Core = {}));
/**
 * Created by novo on 03/03/15.
 */
/// <reference path="boid.ts"/>
/// <reference path="rootobject.ts"/>
var Core;
(function (Core) {
    var CameraBoid = (function (_super) {
        __extends(CameraBoid, _super);
        function CameraBoid(posX, posY, posZ, totalMass) {
            if (totalMass === void 0) { totalMass = 10; }
            _super.call(this, posX, posY, posZ, totalMass);
            this.animationtime = 0.1;
            this.camera = new THREE.PerspectiveCamera(45, 1, 20, 1000);
            this.camera.position.x = this.x;
            this.camera.position.y = this.y;
            this.camera.position.z = this.z;
            this.cameraHelper = new THREE.CameraHelper(this.camera);
            //Environment.scene.add(this.camera);
            //Environment.scene.add(this.cameraHelper);
            this.resting = false;
            // tweening
            //this.root.moveTo(new THREE.Vector3(250, 0, 0), this.animationtime);
        }
        CameraBoid.prototype.setTargetObject = function (targetObject) {
            this.root = targetObject;
        };
        CameraBoid.prototype.getCamera = function () {
            return this.camera;
        };
        CameraBoid.prototype.getCameraHelper = function () {
            return this.cameraHelper;
        };
        // override
        CameraBoid.prototype.think = function () {
            if (this.resting) {
                console.log("resting");
                this.steering.wander();
            }
            else {
                //console.log(this.root.position);
                this.steering.applyRootForce(this.root, 200, 200);
            }
        };
        CameraBoid.prototype.update = function () {
            //var camStartRecord = _FrameRecorder.startRecord(this.x, this.position.clone());
            _super.prototype.update.call(this);
            this.camera.position.x = this.x;
            this.camera.position.z = this.z;
            //this.camera.position.y = this.y;
            this.camera.lookAt(this.root.getPosition().clone());
            // recording section
            /* TODO: Implement recording */
            this.root.updateMatrixWorld(true);
        };
        // override super getMaxVelocity
        CameraBoid.prototype.getMaxVelocity = function () {
            return this.resting ? 0 : this.maxVelocity;
        };
        CameraBoid.prototype.getRoot = function () {
            return this.root;
        };
        CameraBoid.mass = 10;
        CameraBoid.maxVelocity = 1;
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
/* TODO:
* */
var Core;
(function (Core) {
    var App = (function () {
        function App() {
            console.log("app init");
            this.overviewCamera = Environment.overViewCamera;
            Environment.scene.add(new THREE.AxisHelper(15));
            /* TODO: Inparametrar animation
            * vart är jag nu
            * vart ska jag
            *
            * */
            // setup cameras
            this.followCamera = this.generateCameraAndAddToScene(-100, 50, 100);
            this.followCamera.setTargetObject(new Core.RootObject(200, 0, 0));
            //this.secondCam = this.generateCameraAndAddToScene(-200,0,0);
            //this.secondCam.setTargetObject(new RootObject(100,0,0));
            //this.thirdCam = this.generateCameraAndAddToScene(300,100,-100);
            //this.thirdCam.setTargetObject(new RootObject(0,0,100));
            this.controls = new THREE.OrbitControls(this.overviewCamera);
            this.animate();
        }
        App.prototype.generateCameraAndAddToScene = function (x, y, z) {
            var camera = new Core.CameraBoid(x, y, z);
            Environment.scene.add(camera.getCamera());
            Environment.scene.add(camera.getCameraHelper());
            return camera;
        };
        App.prototype.render = function () {
            Environment.renderer.render(Environment.scene, this.overviewCamera);
            //Environment.renderer.render(Environment.scene, this.followCamera.getCamera());
        };
        App.prototype.update = function () {
            this.controls.update();
            //TWEEN.update();
            // update boid camera.
            this.followCamera.update();
            //this.secondCam.update();
            //this.thirdCam.update();
        };
        /* TODO: Implement simulation loop */
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
/**
 * Created by novo on 03/03/15.
 */

/// <reference path="../typings/threejs/three.d.ts"/>
module Environment {
    class SceneFactory {
        private static scene = new THREE.Scene();

        static get getScene():THREE.Scene {
            return SceneFactory.scene;
        }
    }

    class ContainerFactory {
        private static container = document.getElementById('app-container');

        static get getContainer() {
            return this.container;
        }
    }

    class RenderFactory {
        private renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        updateSize:() => void;

        constructor() {
            var container = ContainerFactory.getContainer;
            this.renderer.setClearColor(0xf2f2f2);
            container.appendChild(this.renderer.domElement);
            this.updateSize = () => {
                this.renderer.setSize(window.innerWidth - 30, window.innerHeight - 30);
            };
            this.updateSize();
            window.addEventListener('resize', this.updateSize, false);
        }


        get getRenderer():THREE.WebGLRenderer {
            return this.renderer;
        }
    }

    class CameraFactory {
        camera:THREE.PerspectiveCamera;
        updateSize:() => void;

        constructor(fov:number, aspect:number, near:number, far:number) {
            this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
            this.camera.position.x = 200;
            this.camera.position.y = 200;
            this.camera.position.z = 200;
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));

            this.updateSize = () => {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
            };
            window.addEventListener("resize", this.updateSize, false);
            this.updateSize();
        }

        get getCameraInstance():THREE.PerspectiveCamera {
            return this.camera;
        }
    }


    export var scene = SceneFactory.getScene;
    export var container = ContainerFactory.getContainer;
    export var overViewCamera = new CameraFactory(60, 1, 1, 1000).getCameraInstance;
    export var renderer = new RenderFactory().getRenderer;
}
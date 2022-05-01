"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class DropToGroundInitial extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(DropToGroundInitial);
        // Properties may be mutated by users in the editor via the automatically created user interface
        graph = ƒ.Project.resources["Graph|2022-04-28T12:10:55.160Z|97133"];
        ground = this.graph.getChildrenByName("Environment")[0].getChildrenByName("Ground")[0];
        cmpMeshOfGround = this.ground.getComponent(ƒ.ComponentMesh);
        meshTerrain = this.cmpMeshOfGround.mesh;
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    this.node.addEventListener("renderPrepare" /* RENDER_PREPARE */, this.adaptPosition);
                    break;
            }
        };
        adaptPosition = () => {
            let distance = this.meshTerrain.getTerrainInfo(this.node.mtxLocal.translation, this.cmpMeshOfGround.mtxWorld).distance;
            if (distance != 0) {
                this.node.mtxLocal.translateY(-distance);
            }
        };
    }
    Script.DropToGroundInitial = DropToGroundInitial;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let graph;
    let player;
    let camera;
    let speedRotY = -0.1;
    let speedRotX = 0.2;
    let rotationX = 0;
    let cntWalk = new ƒ.Control("cntWalk", 3, 0 /* PROPORTIONAL */, 500);
    let ableToSprint = true;
    let energy = 5;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        Script.viewport = _event.detail;
        graph = Script.viewport.getBranch();
        player = graph.getChildrenByName("Player")[0];
        camera = player.getChildrenByName("Camera")[0].getComponent(ƒ.ComponentCamera);
        Script.viewport.camera = camera;
        let canvas = Script.viewport.getCanvas();
        canvas.addEventListener("pointermove", handlePointerMove);
        canvas.requestPointerLock();
        document.body.style.cursor = "crosshair";
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    } //start
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        controlWalk();
        adaptSpeed();
        Script.viewport.draw();
        ƒ.AudioManager.default.update();
    } //update
    function controlWalk() {
        let input = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
        cntWalk.setInput(input);
        player.mtxLocal.translateZ(cntWalk.getOutput() * ƒ.Loop.timeFrameGame / 1000);
        let strafe = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
        cntWalk.setInput(strafe);
        player.mtxLocal.translateX(cntWalk.getOutput() * ƒ.Loop.timeFrameGame / 1000);
    } //controlWalk
    function adaptSpeed() {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.R]) && ableToSprint == true) {
            energy -= ƒ.Loop.timeFrameGame / 1000;
            if (energy <= 0) {
                ableToSprint = false;
            }
        }
        else if (!ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.R]) && ableToSprint == true) {
            if (energy < 5) {
                energy += ƒ.Loop.timeFrameGame / 1000;
            }
        }
        else if (!ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.R]) && ableToSprint == false) {
            if (energy < 5) {
                energy += ƒ.Loop.timeFrameGame / 1000;
            }
            if (energy > 1) {
                ableToSprint = true;
            }
        }
    } //adaptSpeed
    function handlePointerMove(_event) {
        console.log(_event);
        player.mtxLocal.rotateY(_event.movementX * speedRotY);
        rotationX += _event.movementY * speedRotX;
        rotationX = Math.min(60, Math.max(-60, rotationX));
        camera.mtxPivot.rotation = ƒ.Vector3.X(rotationX);
    } //handlePointerMove
})(Script || (Script = {})); //namespace
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class Slenderman extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(Script.CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        target = ƒ.Vector3.ZERO();
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    this.node.addEventListener("renderPrepare" /* RENDER_PREPARE */, this.move);
                    break;
            }
        };
        move = (_event) => {
            let currentPosition = this.node.mtxLocal.clone.translation;
            currentPosition.add(ƒ.Vector3.SCALE(this.target, ƒ.Loop.timeFrameGame / 1000));
            if (currentPosition.x < 30 && currentPosition.y < 30 && currentPosition.x > -30 && currentPosition.y > -30)
                this.node.mtxLocal.translate(ƒ.Vector3.SCALE(this.target, ƒ.Loop.timeFrameGame / 1000));
            //change target, so the movement is random
            this.target = ƒ.Random.default.getVector3(new ƒ.Vector3(-1, 0, -1), new ƒ.Vector3(1, 0, 1));
        };
    }
    Script.Slenderman = Slenderman;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map
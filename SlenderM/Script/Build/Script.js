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
        graph;
        ground;
        cmpMeshOfGround;
        meshTerrain;
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
            this.graph = ƒ.Project.resources["Graph|2022-04-14T13:11:49.215Z|97520"];
            this.ground = this.graph.getChildrenByName("Environment")[0].getChildrenByName("Ground")[0];
            this.cmpMeshOfGround = this.ground.getComponent(ƒ.ComponentMesh);
            this.meshTerrain = this.cmpMeshOfGround.mesh;
            if (!this.node == undefined) {
                let distance = this.meshTerrain.getTerrainInfo(this.node.mtxLocal.translation, this.cmpMeshOfGround.mtxWorld)?.distance;
                if (distance != 0) {
                    this.node.mtxLocal.translateY(-distance);
                }
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
    let environment;
    let player;
    let camera;
    let speedRotY = -0.1;
    let speedRotX = 0.2;
    let rotationX = 0;
    let cntWalk = new ƒ.Control("cntWalk", 6, 0 /* PROPORTIONAL */, 500);
    let ableToSprint = true;
    let energy = 5;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        Script.viewport = _event.detail;
        graph = Script.viewport.getBranch();
        player = graph.getChildrenByName("Player")[0];
        camera = player.getChildrenByName("Camera")[0].getComponent(ƒ.ComponentCamera);
        Script.viewport.camera = camera;
        environment = graph.getChildrenByName("Environment")[0];
        let canvas = Script.viewport.getCanvas();
        canvas.addEventListener("pointermove", handlePointerMove);
        canvas.requestPointerLock();
        createTrees();
        //document.body.style.cursor = "crosshair";
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    } //start
    function update(_event) {
        ƒ.Physics.simulate(); // if physics is included and used
        controlWalk();
        adaptSpeed();
        Script.viewport.draw();
        ƒ.AudioManager.default.update();
    } //update
    function controlWalk() {
        let input = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
        cntWalk.setInput(input);
        player.mtxLocal.translateZ(cntWalk.getOutput() * ƒ.Loop.timeFrameGame / 1000);
        if (player.mtxLocal.translation.z > 30) {
            player.mtxLocal.translation.z = 30;
        }
        else if (player.mtxLocal.translation.z < -30) {
            player.mtxLocal.translation.z = -30;
        }
        let strafe = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
        player.mtxLocal.translateX(1.5 * strafe * ƒ.Loop.timeFrameGame / 1000);
        if (player.mtxLocal.translation.x > 30) {
            player.mtxLocal.translation.x = 30;
        }
        else if (player.mtxLocal.translation.x < -30) {
            player.mtxLocal.translation.x = -30;
        }
    } //controlWalk
    function adaptSpeed() {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.R]) && ableToSprint == true) {
            energy -= ƒ.Loop.timeFrameGame / 1000;
            player.mtxLocal.translateZ(4 * cntWalk.getOutput() * ƒ.Loop.timeFrameGame / 1000);
            if (energy <= 0) {
                ableToSprint = false;
            }
        }
        else if (!ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.R])) {
            if (energy < 5) {
                energy += ƒ.Loop.timeFrameGame / 1000;
            }
            if (energy > 1 && ableToSprint == false) {
                ableToSprint = true;
            }
        }
    } //adaptSpeed
    function handlePointerMove(_event) {
        player.mtxLocal.rotateY(_event.movementX * speedRotY);
        rotationX += _event.movementY * speedRotX;
        rotationX = Math.min(60, Math.max(-60, rotationX));
        camera.mtxPivot.rotation = ƒ.Vector3.X(rotationX);
    } //handlePointerMove
    function createTrees() {
        let forest = environment.getChildrenByName("Trees")[0];
        for (let i = 0; i < 100; i++) {
            let position = ƒ.Random.default.getVector3(new ƒ.Vector3(-30, 0, -30), new ƒ.Vector3(30, 0, 30));
            let roundedPosition = new ƒ.Vector3(Math.round(position.x), Math.round(position.y), Math.round(position.z));
            let tree = new Script.Tree(roundedPosition);
            forest.addChild(tree);
        }
    }
})(Script || (Script = {})); //namespace
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class Slenderman extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(Script.CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        //public target: ƒ.Vector3 = ƒ.Vector3.ZERO();
        /* private timeToChange: number = 0;
        private direction: ƒ.Vector3 = ƒ.Vector3.ZERO(); */
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
                    //this.node.addEventListener(ƒ.EVENT.RENDER_PREPARE, this.move);
                    break;
            }
        };
    }
    Script.Slenderman = Slenderman;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class Tree extends ƒ.Node {
        treeBlueprint;
        tree;
        treeRigid;
        constructor(_position) {
            super("Tree");
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            this.addComponent(new ƒ.ComponentTransform());
            this.cmpTransform.mtxLocal.translation = _position;
            this.treeBlueprint = ƒ.Project.resources["Graph|2022-04-28T12:10:55.160Z|97133"];
            this.tree = new ƒ.GraphInstance(this.treeBlueprint);
            this.tree.reset();
            this.addComponent(new Script.DropToGroundInitial());
            this.treeRigid = new ƒ.ComponentRigidbody();
            this.addComponent(this.treeRigid);
            this.treeRigid.typeBody = ƒ.BODY_TYPE.STATIC;
            this.treeRigid.initialization = ƒ.BODY_INIT.TO_NODE;
            this.treeRigid.typeCollider = ƒ.COLLIDER_TYPE.CONE;
            this.addChild(this.tree);
        }
    } //class Tree
    Script.Tree = Tree;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map
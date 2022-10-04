"use strict";
///<reference path="../../../../FUDGE/Net/Build/Client/FudgeClient.d.ts"/>
var Script;
///<reference path="../../../../FUDGE/Net/Build/Client/FudgeClient.d.ts"/>
(function (Script) {
    var ƒ = FudgeCore;
    var ƒClient = FudgeNet.FudgeClient;
    ƒ.Debug.setFilter(ƒ.DebugConsole, ƒ.DEBUG_FILTER.ALL);
    // Create a FudgeClient for this browser tab
    let client = new ƒClient();
    window.addEventListener("load", start);
    async function start(_event) {
        connectToServer(_event);
        sendMessage();
    }
    async function connectToServer(_event) {
        let domServer = document.forms[0].querySelector("input[name=server");
        try {
            // connect to a server with the given url
            client.connectToServer(domServer.value);
            // install an event listener to be called when a message comes in
            client.addEventListener(FudgeNet.EVENT.MESSAGE_RECEIVED, receiveMessage);
        }
        catch (_error) {
            console.log(_error);
            console.log("Make sure, FudgeServer is running and accessable");
        }
    }
    async function receiveMessage(_event) {
        if (_event instanceof MessageEvent) {
            let message = JSON.parse(_event.data);
            createOtherPlayers(message);
        }
    }
    function sendMessage() {
        let message = JSON.stringify(Script.player.mtxWorld.clone);
        console.log(message);
        // send the message via TCP (route = via server)
        client.dispatch({ route: FudgeNet.ROUTE.VIA_SERVER, content: { text: message } });
    }
    Script.sendMessage = sendMessage;
    function createOtherPlayers(_position) {
        let player = new ƒ.Node("player");
        let mesh = new ƒ.ComponentMesh(new ƒ.MeshCube());
        player.addComponent(mesh);
        player.addComponent(new ƒ.ComponentTransform());
        player.cmpTransform.mtxLocal = _position;
        let players = Script.environment.getChildrenByName("Players")[0];
        players.addChild(player);
    }
})(Script || (Script = {}));
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
    var ƒUi = FudgeUserInterface;
    class GameState extends ƒ.Mutable {
        battery = 1;
        constructor() {
            super();
            let domVui = document.querySelector("div#vui");
            console.log(new ƒUi.Controller(this, domVui));
        }
        reduceMutator(_mutator) { }
    }
    Script.GameState = GameState;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let graph;
    let camera;
    let speedRotY = -0.1;
    let speedRotX = 0.2;
    let rotationX = 0;
    let cntWalk = new ƒ.Control("cntWalk", 6, 0 /* PROPORTIONAL */, 500);
    let ableToSprint = true;
    let energy = 5;
    let gameState;
    let config;
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        Script.viewport = _event.detail;
        graph = Script.viewport.getBranch();
        Script.player = graph.getChildrenByName("Player")[0];
        camera = Script.player.getChildrenByName("Camera")[0].getComponent(ƒ.ComponentCamera);
        Script.viewport.camera = camera;
        Script.environment = graph.getChildrenByName("Environment")[0];
        gameState = new Script.GameState();
        let response = await fetch("config.json");
        config = await response.json();
        console.log(config);
        let canvas = Script.viewport.getCanvas();
        canvas.addEventListener("pointermove", handlePointerMove);
        canvas.requestPointerLock();
        //document.body.style.cursor = "crosshair";
        document.addEventListener("keydown", hndKeydown);
        createTrees();
        Script.environment.addChild(new ƒ.Node("Players"));
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        initAnim();
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    } //start
    function update(_event) {
        ƒ.Physics.simulate(); // if physics is included and used
        controlWalk();
        adaptSpeed();
        gameState.battery -= config["drain"];
        document.querySelector("input").value = gameState.battery.toString(); //String(battery)
        Script.viewport.draw();
        ƒ.AudioManager.default.update();
    } //update
    function controlWalk() {
        let input = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
        cntWalk.setInput(input);
        Script.player.mtxLocal.translateZ(cntWalk.getOutput() * ƒ.Loop.timeFrameGame / 1000);
        if (Script.player.mtxLocal.translation.z > 30) {
            Script.player.mtxLocal.translation.z = 30;
        }
        else if (Script.player.mtxLocal.translation.z < -30) {
            Script.player.mtxLocal.translation.z = -30;
        }
        //let vector = new ƒ.Vector3((1.5 * input * ƒ.Loop.timeFrameGame / 20), 0, (cntWalk.getOutput() * ƒ.Loop.timeFrameGame / 30));
        let strafe = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
        Script.player.mtxLocal.translateX(1.5 * strafe * ƒ.Loop.timeFrameGame / 1000);
        if (Script.player.mtxLocal.translation.x > 30) {
            Script.player.mtxLocal.translation.x = 30;
        }
        else if (Script.player.mtxLocal.translation.x < -30) {
            Script.player.mtxLocal.translation.x = -30;
        }
        Script.sendMessage();
    } //controlWalk  
    function adaptSpeed() {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.R]) && ableToSprint == true) {
            energy -= ƒ.Loop.timeFrameGame / 1000;
            Script.player.mtxLocal.translateZ(4 * cntWalk.getOutput() * ƒ.Loop.timeFrameGame / 1000);
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
        Script.player.mtxLocal.rotateY(_event.movementX * speedRotY);
        rotationX += _event.movementY * speedRotX;
        rotationX = Math.min(60, Math.max(-60, rotationX));
        camera.mtxPivot.rotation = ƒ.Vector3.X(rotationX);
    } //handlePointerMove
    function createTrees() {
        let forest = Script.environment.getChildrenByName("Trees")[0];
        for (let i = 0; i < 100; i++) {
            let position = ƒ.Random.default.getVector3(new ƒ.Vector3(-30, 0, -30), new ƒ.Vector3(30, 0, 30));
            let roundedPosition = new ƒ.Vector3(Math.round(position.x), Math.round(position.y), Math.round(position.z));
            let tree = new Script.Tree(roundedPosition);
            forest.addChild(tree);
        }
    }
    function hndKeydown(_event) {
        if (_event.code != ƒ.KEYBOARD_CODE.SPACE)
            return;
        let torch = Script.player.getChildrenByName("Torch")[0];
        torch.activate(!torch.isActive);
        torch.dispatchEvent(new Event("toggleTorch", { bubbles: true }));
    }
    function initAnim() {
        let animseq = new ƒ.AnimationSequence();
        animseq.addKey(new ƒ.AnimationKey(0, 10));
        animseq.addKey(new ƒ.AnimationKey(500, 5));
        animseq.addKey(new ƒ.AnimationKey(1000, 0));
        animseq.addKey(new ƒ.AnimationKey(1500, 5));
        animseq.addKey(new ƒ.AnimationKey(2000, 10));
        let animStructure = {
            components: {
                ComponentTransform: [
                    {
                        "ƒ.ComponentTransform": {
                            mtxLocal: {
                                rotation: {
                                    x: animseq,
                                    y: animseq
                                }
                            }
                        }
                    }
                ]
            }
        };
        let animation = new ƒ.Animation("testAnimation", animStructure);
        let stone = Script.environment.getChildrenByName("Stone")[0];
        let cmpAnimator = new ƒ.ComponentAnimator(animation, ƒ.ANIMATION_PLAYMODE.LOOP);
        stone.addComponent(cmpAnimator);
        cmpAnimator.activate(true);
    }
})(Script || (Script = {})); //namespace
/**
 * Minimal implementation showing the use of the FudgeServer.
 * Start with `node Server.js <port>`, Heroku uses the start-script in package.json
 * @author Jirka Dell'Oro-Friedl, HFU, 2021
 */
System.register("Server", ["../../../../FUDGE/Net/Build/Server/FudgeServer.js"], function (exports_1, context_1) {
    "use strict";
    var FudgeServer_js_1, port, server;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (FudgeServer_js_1_1) {
                FudgeServer_js_1 = FudgeServer_js_1_1;
            }
        ],
        execute: function () {
            port = process.env.PORT;
            if (port == undefined)
                port = parseInt(process.argv[2]);
            if (!port) {
                console.log("Syntax: 'node Server.js <port>' or use start script in Heroku");
                process.exit();
            }
            server = new FudgeServer_js_1.FudgeServer();
            server.startUp(port);
            console.log(server);
        }
    };
});
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
"use strict";
var PinguRun;
(function (PinguRun) {
    var ƒ = FudgeCore;
    class Coin extends ƒ.Node {
        cmpAnimator;
        constructor(_index) {
            super("Coin");
            let mesh = new ƒ.MeshSprite();
            let cmpMesh = new ƒ.ComponentMesh(mesh);
            let image = new ƒ.TextureImage("Images/Coin.png");
            let material = new ƒ.Material("Coin", ƒ.ShaderLitTextured, new ƒ.CoatTextured(undefined, image));
            let cmpMaterial = new ƒ.ComponentMaterial(material);
            let cmpTransform = new ƒ.ComponentTransform();
            cmpTransform.mtxLocal.scale(new ƒ.Vector3(1, 1, 1));
            this.addComponent(cmpMesh);
            this.addComponent(cmpMaterial);
            this.addComponent(cmpTransform);
            this.mtxLocal.translate(new ƒ.Vector3(1, 2, 0));
            this.addComponent(new PinguRun.DeterminePositions(_index, PinguRun.coinAmount));
            this.initAnim();
        }
        initAnim() {
            let animseq = new ƒ.AnimationSequence();
            animseq.addKey(new ƒ.AnimationKey(0, 0));
            animseq.addKey(new ƒ.AnimationKey(8000, 360)); //rotate one turn around the middle
            let animStructure = {
                components: {
                    ComponentTransform: [
                        {
                            "ƒ.ComponentTransform": {
                                mtxLocal: {
                                    rotation: {
                                        y: animseq
                                    }
                                }
                            }
                        }
                    ]
                }
            };
            let animation = new ƒ.Animation("CoinAnimation", animStructure);
            this.cmpAnimator = new ƒ.ComponentAnimator(animation, ƒ.ANIMATION_PLAYMODE.LOOP);
            this.addComponent(this.cmpAnimator);
            this.cmpAnimator.activate(true);
        } //initAnim
    }
    PinguRun.Coin = Coin;
})(PinguRun || (PinguRun = {}));
var PinguRun;
(function (PinguRun) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(PinguRun); // Register the namespace to FUDGE for serialization
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
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    PinguRun.CustomComponentScript = CustomComponentScript;
})(PinguRun || (PinguRun = {}));
var PinguRun;
(function (PinguRun) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(PinguRun); // Register the namespace to FUDGE for serialization
    class DeterminePositions extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(PinguRun.CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "DeterminePositions added to ";
        index;
        totalAmount;
        constructor(_index, _totalAmount) {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            this.index = _index;
            this.totalAmount = _totalAmount;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.calculatePosition);
        }
        // Activate the functions of this component as response to events
        calculatePosition() {
            //calculate the positions based on how many collectables exist, so they get spread out evenly in the game
            let max = ((80 / this.totalAmount) * this.index);
            let min = (80 / this.totalAmount) * (this.index - 1) + 10;
            let position = min + Math.floor(Math.random() * (max - min));
            //console.log(position);
            this.node.mtxLocal.translateX(position);
        } //calculatePosition
    }
    PinguRun.DeterminePositions = DeterminePositions;
})(PinguRun || (PinguRun = {}));
var PinguRun;
(function (PinguRun) {
    var ƒ = FudgeCore;
    var ƒUi = FudgeUserInterface;
    class GameState extends ƒ.Mutable {
        stars = 0;
        coins = 0;
        time = 60;
        constructor(_time) {
            super();
            let domVui = document.querySelector("div#vui");
            console.log(new ƒUi.Controller(this, domVui));
            this.time = _time;
        }
        reduceMutator(_mutator) { }
    }
    PinguRun.GameState = GameState;
})(PinguRun || (PinguRun = {}));
var PinguRun;
(function (PinguRun) {
    PinguRun.ƒ = FudgeCore;
    PinguRun.ƒAid = FudgeAid;
    PinguRun.ƒ.Debug.info("Main Program Template running!");
    let viewport;
    PinguRun.stars = [];
    PinguRun.coins = [];
    let pingu;
    let camera;
    let config;
    let gameDuration;
    let looseAudio;
    let winAudio;
    let gameTime;
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        viewport = _event.detail;
        PinguRun.graph = viewport.getBranch();
        let character = PinguRun.graph.getChildrenByName("Character")[0].getChildrenByName("Pingu")[0];
        pingu = new PinguRun.Pingu;
        character.addChild(pingu);
        PinguRun.collectables = PinguRun.graph.getChildrenByName("Collectables")[0];
        await getExternalData();
        createCollectables();
        adjustCamera();
        createBridge();
        gameTime = new PinguRun.ƒ.Time();
        PinguRun.timer = new PinguRun.ƒ.Timer(gameTime, 1000, 0, updateTimer);
        PinguRun.graph.addEventListener("checkGameEnd", loadEndScreen);
        PinguRun.ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        PinguRun.ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    } //start
    function update(_event) {
        pingu.walk();
        pingu.jump();
        pingu.checkPosition();
        pingu.hitCoin();
        PinguRun.ƒ.Physics.simulate(); // if physics is included and used
        viewport.draw();
        PinguRun.ƒ.AudioManager.default.update();
    } //update
    async function getExternalData() {
        let response = await fetch("config.json");
        config = await response.json();
        gameDuration = config["gameDuration"];
        PinguRun.starAmount = config["starAmount"];
        PinguRun.coinAmount = config["coinAmount"];
        PinguRun.gameState = new PinguRun.GameState(gameDuration);
    } //getExternalData
    function createCollectables() {
        for (let i = 0; i < PinguRun.starAmount; i++) {
            let star = new PinguRun.Star(i + 1);
            PinguRun.collectables.addChild(star);
            PinguRun.stars.push(star);
        }
        for (let i = 0; i < PinguRun.coinAmount; i++) {
            let coin = new PinguRun.Coin(i + 1);
            PinguRun.collectables.addChild(coin);
            PinguRun.coins.push(coin);
        }
    } //createCollectables
    function adjustCamera() {
        camera = PinguRun.graph.getChildrenByName("Character")[0].getChildrenByName("Camera")[0];
        let cmpCamera = camera.getComponent(PinguRun.ƒ.ComponentCamera);
        viewport.camera = cmpCamera;
        viewport.camera.mtxPivot.rotateY(180);
        viewport.camera.mtxPivot.translateZ(-30);
    } //adjustCamera
    function createBridge() {
        let handle = PinguRun.graph.getChildrenByName("Track")[0].getChildrenByName("Bridge")[0].getChildrenByName("Handle")[0];
        let swing = PinguRun.graph.getChildrenByName("Track")[0].getChildrenByName("Bridge")[0].getChildrenByName("Swing")[0];
        let revoluteJoint = new PinguRun.ƒ.JointRevolute(handle.getComponent(PinguRun.ƒ.ComponentRigidbody), swing.getComponent(PinguRun.ƒ.ComponentRigidbody), new PinguRun.ƒ.Vector3(0, 0, 1));
        handle.addComponent(revoluteJoint);
        revoluteJoint.bodyTied.applyForce(new PinguRun.ƒ.Vector3(0, 0, 0));
        revoluteJoint.minMotor = 0;
        revoluteJoint.maxMotor = 90;
    } //createBridge
    function moveCamera(_vector) {
        _vector.scale(1 / 60);
        camera.mtxLocal.translate(_vector);
    } //moveCamera
    PinguRun.moveCamera = moveCamera;
    function updateTimer() {
        PinguRun.gameState.time -= 1;
        if (PinguRun.gameState.time <= 0) {
            PinguRun.timer.clear();
            pingu.dispatchEvent(new CustomEvent("checkGameEnd", {
                bubbles: true,
                detail: "timeOut"
            }));
        }
    } //updateTimer
    function loadEndScreen(_event) {
        PinguRun.ƒ.Loop.removeEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        looseAudio = PinguRun.graph.getChildrenByName("Sound")[0].getChildrenByName("Loosing")[0].getComponents(PinguRun.ƒ.ComponentAudio)[0];
        winAudio = PinguRun.graph.getChildrenByName("Sound")[0].getChildrenByName("Winning")[0].getComponents(PinguRun.ƒ.ComponentAudio)[0];
        if (_event.detail == "loose") {
            looseAudio.play(true);
            console.log("loose");
            alert("Nooooo! Pingu fell down. Let's hope that he can swim.");
        }
        if (_event.detail == "win") {
            winAudio.play(true);
            PinguRun.timer.clear();
            console.log("win");
            if (PinguRun.gameState.coins > 0) {
                alert("Yayyhhh! Pingu is happy that you brought him back home on time. \nHe also wants to thank you for the " + PinguRun.gameState.coins + " coins you collected for him.");
            }
            else {
                alert("Yayyhhh! Pingu is happy that you brought him back home on time.");
            }
        }
        if (_event.detail == "timeOut") {
            looseAudio.play(true);
            console.log("loose");
            alert("Oh no! The time ran out. Let's hope that Pingu survives the night outside.");
        }
    } //loadEndScreen
})(PinguRun || (PinguRun = {}));
var PinguRun;
(function (PinguRun) {
    var ƒ = FudgeCore;
    class Pingu extends ƒ.Node {
        spritePingu;
        animation;
        direction = ƒ.Vector3.ZERO();
        rigidbody;
        jumpAudio;
        jumpable = true;
        coinAudio;
        constructor() {
            super("Pingu");
            let mesh = new ƒ.MeshSprite();
            let cmpMesh = new ƒ.ComponentMesh(mesh);
            let material = new ƒ.Material("Pingu", ƒ.ShaderLit, new ƒ.CoatColored());
            let cmpMaterial = new ƒ.ComponentMaterial(material);
            cmpMaterial.clrPrimary = new ƒ.Color(0, 0, 0, 0);
            let cmpTransform = new ƒ.ComponentTransform();
            this.addComponent(cmpMesh);
            this.addComponent(cmpMaterial);
            this.addComponent(cmpTransform);
            this.mtxLocal.translate(new ƒ.Vector3(1, 0, 0));
            this.createSprite();
            //create rigidbody for physics
            this.rigidbody = new ƒ.ComponentRigidbody();
            this.rigidbody.effectRotation = new ƒ.Vector3(0, 0, 0);
            this.rigidbody.friction = 0;
            this.rigidbody.effectGravity = 10;
            this.rigidbody.setVelocity(new ƒ.Vector3(0, 0, 0));
            this.addComponent(this.rigidbody);
            this.jumpAudio = PinguRun.graph.getChildrenByName("Sound")[0].getChildrenByName("Jump")[0].getComponents(ƒ.ComponentAudio)[0];
            this.coinAudio = PinguRun.graph.getChildrenByName("Sound")[0].getChildrenByName("Coin")[0].getComponents(ƒ.ComponentAudio)[0];
        }
        async createSprite() {
            let imgSpriteSheet = new ƒ.TextureImage();
            await imgSpriteSheet.load("Images/PinguSprite.png");
            let coat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
            this.animation = new PinguRun.ƒAid.SpriteSheetAnimation("Pingu", coat);
            this.animation.generateByGrid(ƒ.Rectangle.GET(0, 0, 32, 32), 4, 32, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(32));
            this.spritePingu = new PinguRun.ƒAid.NodeSprite("Sprite");
            this.spritePingu.setAnimation(this.animation);
            this.spritePingu.setFrameDirection(1);
            this.spritePingu.framerate = 5;
            let cmpTransfrom = new ƒ.ComponentTransform();
            this.spritePingu.addComponent(cmpTransfrom);
            this.addChild(this.spritePingu);
        } //createSprite
        walk() {
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])) {
                this.direction.set(5, 0, 0);
                this.spritePingu.mtxLocal.reset();
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])) {
                this.direction.set(-5, 0, 0);
                this.spritePingu.mtxLocal.reset();
                this.spritePingu.mtxLocal.rotateY(180);
            }
            if (!ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]) && !ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])) {
                this.direction.set(0, 0, 0);
            }
            //this.mtxLocal.translate(ƒ.Vector3.SCALE(this.direction, 1 / 60));
            this.rigidbody.setVelocity(this.direction);
            PinguRun.moveCamera(this.direction);
        } //walk
        jump() {
            /* if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
                this.jumpAudio.play(true);
                if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
                    this.direction.set(-1, 1, 0);
                else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]))
                    this.direction.set(1, 1, 0);
                else
                    this.direction.set(0, 1, 0);
            }
            this.mtxLocal.translate(ƒ.Vector3.SCALE(this.direction, 1 / 60)); */
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && this.jumpable == true) {
                this.jumpAudio.play(true);
                this.jumpable = false;
                if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]))
                    this.rigidbody.applyLinearImpulse(new ƒ.Vector3(-80, 160, 0));
                else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
                    this.rigidbody.applyLinearImpulse(new ƒ.Vector3(80, 160, 0));
                else
                    this.rigidbody.applyLinearImpulse(new ƒ.Vector3(0, 160, 0));
                setTimeout(() => {
                    this.jumpable = true;
                }, 2000);
            } //jump
        }
        checkPosition() {
            if (this.mtxLocal.translation.y < -2) {
                this.dispatchEvent(new CustomEvent("checkGameEnd", { bubbles: true, detail: "loose" }));
            }
            if (this.mtxLocal.translation.x >= 109.5 && PinguRun.gameState.stars >= 3) {
                this.dispatchEvent(new CustomEvent("checkGameEnd", { bubbles: true, detail: "win" }));
            }
        } //checkPosition
        hitCoin() {
            if (this.mtxLocal.translation.y > 1.5) {
                for (let i = 0; i < PinguRun.coins.length; i++) {
                    if ((PinguRun.coins[i].mtxLocal.translation.x - 0.5) < this.mtxLocal.translation.x && this.mtxLocal.translation.x < (PinguRun.coins[i].mtxLocal.translation.x + 0.5)) {
                        let coin = PinguRun.coins[i];
                        PinguRun.gameState.coins += 1;
                        PinguRun.collectables.removeChild(coin);
                        PinguRun.coins.splice(PinguRun.coins.indexOf(coin), 1);
                        this.coinAudio.play(true);
                    }
                }
            }
        } //hitCoin
    }
    PinguRun.Pingu = Pingu;
})(PinguRun || (PinguRun = {}));
var PinguRun;
(function (PinguRun) {
    var ƒ = FudgeCore;
    class Star extends ƒ.Node {
        starAudio;
        stateMachine;
        cmpAnimator;
        rigidbody;
        constructor(_index) {
            super("Star");
            let mesh = new ƒ.MeshQuad();
            let cmpMesh = new ƒ.ComponentMesh(mesh);
            let image = new ƒ.TextureImage("Images/Star_Shadow.png");
            let material = new ƒ.Material("Star", ƒ.ShaderLitTextured, new ƒ.CoatTextured(undefined, image));
            let cmpMaterial = new ƒ.ComponentMaterial(material);
            let cmpTransform = new ƒ.ComponentTransform();
            cmpTransform.mtxLocal.scale(new ƒ.Vector3(1, 1, 1));
            this.addComponent(cmpMesh);
            this.addComponent(cmpMaterial);
            this.addComponent(cmpTransform);
            this.mtxLocal.translate(new ƒ.Vector3(1, 2, 0));
            this.addComponent(new PinguRun.DeterminePositions(_index, PinguRun.starAmount));
            this.starAudio = PinguRun.graph.getChildrenByName("Sound")[0].getChildrenByName("Star")[0].getComponents(ƒ.ComponentAudio)[0];
            //create rigidbody for physics
            this.rigidbody = new ƒ.ComponentRigidbody();
            this.rigidbody.effectRotation = new ƒ.Vector3(0, 0, 0);
            this.rigidbody.typeBody = 1; // 1=Bodytype static
            this.rigidbody.setVelocity(new ƒ.Vector3(0, 0, 0));
            this.addComponent(this.rigidbody);
            this.stateMachine = new PinguRun.StarMachine();
            this.addComponent(this.stateMachine);
            this.stateMachine.stateCurrent = PinguRun.JOB.IDLE;
            this.rigidbody.addEventListener("ColliderEnteredCollision" /* ƒ.EVENT_PHYSICS.COLLISION_ENTER */, (_event) => {
                if (_event.cmpRigidbody.node.name == "Pingu") {
                    this.stateMachine.transit(PinguRun.JOB.FLY);
                    setTimeout(() => {
                        this.stateMachine.transit(PinguRun.JOB.SHINE);
                    }, 2000);
                }
            });
        } //constructor
        animate() {
            let animseq = new ƒ.AnimationSequence();
            animseq.addKey(new ƒ.AnimationKey(0, 2));
            animseq.addKey(new ƒ.AnimationKey(2000, 20));
            let animStructure = {
                components: {
                    ComponentTransform: [
                        {
                            "ƒ.ComponentTransform": {
                                mtxLocal: {
                                    translation: {
                                        y: animseq
                                    }
                                }
                            }
                        }
                    ]
                }
            };
            let animation = new ƒ.Animation("StarAnimation", animStructure);
            this.cmpAnimator = new ƒ.ComponentAnimator(animation, ƒ.ANIMATION_PLAYMODE.LOOP);
            this.addComponent(this.cmpAnimator);
            this.cmpAnimator.activate(true);
        } //animate
    }
    PinguRun.Star = Star;
})(PinguRun || (PinguRun = {}));
var PinguRun;
(function (PinguRun) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    let JOB;
    (function (JOB) {
        JOB[JOB["IDLE"] = 0] = "IDLE";
        JOB[JOB["FLY"] = 1] = "FLY";
        JOB[JOB["SHINE"] = 2] = "SHINE";
    })(JOB = PinguRun.JOB || (PinguRun.JOB = {}));
    class StarMachine extends ƒAid.ComponentStateMachine {
        static instructions = StarMachine.get();
        constructor() {
            super();
            this.instructions = StarMachine.instructions;
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
        }
        static get() {
            let setup = new ƒAid.StateMachineInstructions();
            setup.transitDefault = StarMachine.transitDefault;
            setup.actDefault = StarMachine.actDefault;
            setup.setAction(JOB.IDLE, this.actIdle);
            setup.setAction(JOB.FLY, this.actFly);
            setup.setAction(JOB.SHINE, this.actShine);
            return setup;
        }
        static transitDefault(_machine) {
            //console.log(_machine, `Default Transition   ${JOB[_machine.stateCurrent]} -> ${JOB[_machine.stateNext]}`);
        }
        static async actDefault(_machine) {
            //console.log(_machine, `Default Action       ${JOB[_machine.stateCurrent]}`);
        }
        static actIdle(_machine) {
            //
        }
        static actFly(_machine) {
            let star = _machine.node;
            star.removeComponent(star.rigidbody);
            star.animate();
            star.starAudio.play(true);
        } //actFly
        static actShine(_machine) {
            let star = _machine.node;
            star.removeComponent(star.stateMachine);
            PinguRun.stars.splice(PinguRun.stars.indexOf(star));
            PinguRun.collectables.removeChild(star);
            PinguRun.gameState.stars += 1;
            switch (PinguRun.gameState.stars) {
                case 1: {
                    let starImage = document.getElementById("star1");
                    starImage.style.display = "block";
                    break;
                }
                case 2: {
                    let starImage = document.getElementById("star2");
                    starImage.style.display = "block";
                    break;
                }
                case 3: {
                    let starImage = document.getElementById("star3");
                    starImage.style.display = "block";
                    break;
                }
                default:
                    break;
            }
        } //actShine
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    ƒ.Loop.removeEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
            }
        }; //hndEvent
        update = (_event) => {
            this.act();
        }; //update
    }
    PinguRun.StarMachine = StarMachine;
})(PinguRun || (PinguRun = {}));
var PinguRun;
(function (PinguRun) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    window.addEventListener("load", init);
    // show dialog for startup, user interaction required e.g. for starting audio
    function init(_event) {
        let dialog = document.querySelector("dialog");
        dialog.querySelector("h1").textContent = document.title;
        dialog.addEventListener("click", function (_event) {
            dialog.close();
            let graphId = "Graph|2023-02-14T21:16:31.377Z|24123";
            startInteractiveViewport(graphId);
        });
        dialog.showModal();
    } //init
    // setup and start interactive viewport
    async function startInteractiveViewport(_graphId) {
        // load resources referenced in the link-tag
        await ƒ.Project.loadResourcesFromHTML();
        ƒ.Debug.log("Project:", ƒ.Project.resources);
        // get the graph to show from loaded resources
        let graph = ƒ.Project.resources[_graphId];
        ƒ.Debug.log("Graph:", graph);
        if (!graph) {
            alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
            return;
        }
        // setup the viewport
        let cmpCamera = new ƒ.ComponentCamera();
        PinguRun.canvas = document.querySelector("canvas");
        let viewport = new ƒ.Viewport();
        viewport.initialize("InteractiveViewport", graph, cmpCamera, PinguRun.canvas);
        ƒ.Debug.log("Viewport:", viewport);
        // make the camera interactive (complex method in FudgeAid)
        let cameraOrbit = ƒAid.Viewport.expandCameraToInteractiveOrbit(viewport);
        // hide the cursor when interacting, also suppressing right-click menu
        PinguRun.canvas.addEventListener("mousedown", PinguRun.canvas.requestPointerLock);
        PinguRun.canvas.addEventListener("mouseup", function () { document.exitPointerLock(); });
        // setup audio
        ƒ.AudioManager.default.listenTo(graph);
        // draw viewport once for immediate feedback
        ƒ.Render.prepare(cameraOrbit);
        viewport.draw();
        // dispatch event to signal startup done
        PinguRun.canvas.dispatchEvent(new CustomEvent("interactiveViewportStarted", { bubbles: true, detail: viewport }));
    } //startInteractiveViewport
})(PinguRun || (PinguRun = {}));
//# sourceMappingURL=Script.js.map
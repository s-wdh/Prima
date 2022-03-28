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
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let graph;
    let pacman;
    let grid;
    let speed = new ƒ.Vector3(0, 0, 0);
    let direction;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        graph = viewport.getBranch();
        pacman = graph.getChildrenByName("PacMan")[0];
        grid = graph.getChildrenByName("Grid")[0];
        //console.log(pacman);
        //console.log(pacman.getComponent(ƒ.ComponentTransform));
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]) && (pacman.mtxLocal.translation.y + 0.025) % 1 < 0.05) {
            speed.set(1 / 50, 0, 0);
            direction = "right";
            checkPath();
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A]) && (pacman.mtxLocal.translation.y + 0.025) % 1 < 0.05) {
            speed.set(-1 / 50, 0, 0);
            direction = "left";
            checkPath();
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W]) && (pacman.mtxLocal.translation.x + 0.025) % 1 < 0.05) {
            speed.set(0, 1 / 50, 0);
            direction = "up";
            checkPath();
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S]) && (pacman.mtxLocal.translation.x + 0.025) % 1 < 0.05) {
            speed.set(0, -1 / 50, 0);
            direction = "down";
            checkPath();
        }
        pacman.mtxLocal.translate(speed);
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function checkPath() {
        let position = pacman.mtxLocal.translation;
        let nextElementNumber;
        let row;
        let nextElement;
        switch (direction) {
            case "left": {
                //console.log(position.x, position.y);
                nextElementNumber = Math.trunc(position.x) - 1;
                if (nextElementNumber < 0) {
                    speed.set(0, 0, 0);
                    break;
                }
                console.log(nextElementNumber);
                row = grid.getChild(Math.trunc(position.y));
                nextElement = row.getChild(nextElementNumber);
                let nextElementMesh = nextElement.getComponent(ƒ.ComponentMesh);
                let nextElementColor = nextElementMesh.node.getComponent(ƒ.ComponentMaterial).clrPrimary;
                console.log(nextElementColor);
                if (nextElementColor.r == 1 && nextElementColor.g == 1 && nextElementColor.b == 1 && nextElementColor.a == 1) {
                    console.log("YAY");
                }
                else {
                    speed.set(0, 0, 0);
                }
                break;
            }
            case "up": {
                nextElementNumber = Math.trunc(position.x);
                if (nextElementNumber > 14) {
                    speed.set(0, 0, 0);
                    break;
                }
                console.log(nextElementNumber);
                row = grid.getChild(Math.trunc(position.y) + 1);
                nextElement = row.getChild(nextElementNumber);
                let nextElementMesh = nextElement.getComponent(ƒ.ComponentMesh);
                let nextElementColor = nextElementMesh.node.getComponent(ƒ.ComponentMaterial).clrPrimary;
                console.log(nextElementColor);
                if (nextElementColor.r == 1 && nextElementColor.g == 1 && nextElementColor.b == 1 && nextElementColor.a == 1) {
                    console.log("YAY");
                }
                else {
                    speed.set(0, 0, 0);
                }
                break;
            }
            case "right": {
                nextElementNumber = Math.trunc(position.x) + 1;
                if (nextElementNumber > 24) {
                    speed.set(0, 0, 0);
                    break;
                }
                console.log(nextElementNumber);
                row = grid.getChild(Math.trunc(position.y));
                nextElement = row.getChild(nextElementNumber);
                let nextElementMesh = nextElement.getComponent(ƒ.ComponentMesh);
                let nextElementColor = nextElementMesh.node.getComponent(ƒ.ComponentMaterial).clrPrimary;
                console.log(nextElementColor);
                if (nextElementColor.r == 1 && nextElementColor.g == 1 && nextElementColor.b == 1 && nextElementColor.a == 1) {
                    console.log("YAY");
                }
                else {
                    speed.set(0, 0, 0);
                }
                break;
            }
            case "down": {
                nextElementNumber = Math.trunc(position.x);
                if (nextElementNumber < 0) {
                    speed.set(0, 0, 0);
                    break;
                }
                console.log(nextElementNumber);
                row = grid.getChild(Math.trunc(position.y) - 1);
                nextElement = row.getChild(nextElementNumber);
                let nextElementMesh = nextElement.getComponent(ƒ.ComponentMesh);
                let nextElementColor = nextElementMesh.node.getComponent(ƒ.ComponentMaterial).clrPrimary;
                console.log(nextElementColor);
                if (nextElementColor.r == 1 && nextElementColor.g == 1 && nextElementColor.b == 1 && nextElementColor.a == 1) {
                    console.log("YAY");
                }
                else {
                    speed.set(0, 0, 0);
                }
                break;
            }
        }
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map
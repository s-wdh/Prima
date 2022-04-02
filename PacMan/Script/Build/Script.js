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
    let dialog;
    let viewport;
    let graph;
    let pacman;
    let positionPacman;
    let grid;
    let speed = 1 / 60;
    let direction = ƒ.Vector3.ZERO();
    let chomp;
    document.addEventListener("interactiveViewportStarted", start);
    window.addEventListener("load", init);
    function init(_event) {
        dialog = document.querySelector("dialog");
        dialog.querySelector("h1").textContent = document.title;
        dialog.addEventListener("click", function (_event) {
            // @ts-ignore until HTMLDialog is implemented by all browsers and available in dom.d.ts
            dialog.close();
            startInteractiveViewport();
        });
        //@ts-ignore
        dialog.showModal();
    }
    // setup and start interactive viewport
    async function startInteractiveViewport() {
        // load resources referenced in the link-tag
        await ƒ.Project.loadResourcesFromHTML();
        ƒ.Debug.log("Project:", FudgeCore.Project.resources);
        // pick the graph to show
        let graph = FudgeCore.Project.resources["Graph|2022-03-24T10:23:11.229Z|28752"];
        ƒ.Debug.log("Graph:", graph);
        if (!graph) {
            alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
            return;
        }
        // setup the viewport
        let cmpCamera = new ƒ.ComponentCamera();
        let canvas = document.querySelector("canvas");
        let viewport = new ƒ.Viewport();
        viewport.initialize("InteractiveViewport", graph, cmpCamera, canvas);
        ƒ.Debug.log("Viewport:", viewport);
        // hide the cursor when interacting, also suppressing right-click menu
        //canvas.addEventListener("mousedown", canvas.requestPointerLock);
        //canvas.addEventListener("mouseup", function () { document.exitPointerLock(); });
        // make the camera interactive (complex method in FudgeAid)
        //FudgeAid.Viewport.expandCameraToInteractiveOrbit(viewport);
        // setup audio
        //let cmpListener = new ƒ.ComponentAudioListener();
        //cmpCamera.node.addComponent(cmpListener);
        //ƒ.AudioManager.default.listenWith(cmpListener);
        ƒ.AudioManager.default.listenTo(graph);
        //ƒ.Debug.log("Audio:", ƒ.AudioManager.default);
        // draw viewport once for immediate feedback
        viewport.draw();
        canvas.dispatchEvent(new CustomEvent("interactiveViewportStarted", { bubbles: true, detail: viewport }));
    }
    function start(_event) {
        viewport = _event.detail;
        viewport.camera.mtxPivot.translate(new ƒ.Vector3(12, 7, 27));
        viewport.camera.mtxPivot.rotateY(180);
        graph = viewport.getBranch();
        pacman = graph.getChildrenByName("PacMan")[0];
        grid = graph.getChildrenByName("Grid")[0];
        chomp = graph.getChildrenByName("Sound")[0].getChildrenByName("Chomp")[0].getComponents(ƒ.ComponentAudio)[0];
        //console.log(pacman.getComponent(ƒ.ComponentTransform));
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        positionPacman = pacman.mtxLocal.translation;
        let nearestGridPoint = new ƒ.Vector2(Math.round(positionPacman.x), Math.round(positionPacman.y));
        let nearGridPoint = positionPacman.toVector2().equals(nearestGridPoint, 3 * speed);
        if (nearGridPoint) {
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]))
                direction.set(1, 0, 0);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A]))
                direction.set(-1, 0, 0);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W]))
                direction.set(0, 1, 0);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S]))
                direction.set(0, -1, 0);
        }
        if (!checkPath()) {
            direction.set(0, 0, 0);
        }
        pacman.mtxLocal.translate(ƒ.Vector3.SCALE(direction, speed));
        if (direction.equals(ƒ.Vector3.ZERO())) {
            chomp.play(false);
        }
        else if (!chomp.isPlaying) {
            chomp.play(true);
        }
        viewport.draw();
        //ƒ.AudioManager.default.update();
    } //update
    function checkPath() {
        //check if next element is a path or wall
        let row = grid.getChild(Math.trunc(positionPacman.y) + direction.y);
        if (row) {
            let nextElement = row.getChild(Math.trunc(positionPacman.x) + direction.x);
            if (nextElement) {
                let nextElementMesh = nextElement.getComponent(ƒ.ComponentMesh);
                let nextElementColor = nextElementMesh.node.getComponent(ƒ.ComponentMaterial).clrPrimary;
                console.log(nextElementColor);
                if (nextElementColor.r == 1 && nextElementColor.g == 1 && nextElementColor.b == 1 && nextElementColor.a == 1) {
                    return true;
                }
            }
        }
        return false;
    } //checkpath
})(Script || (Script = {})); //namespace
//# sourceMappingURL=Script.js.map
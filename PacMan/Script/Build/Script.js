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
    class Ghost extends ƒ.Node {
        constructor() {
            super("Ghost");
            let node = new ƒ.Node("Ghost");
            let mesh = new ƒ.MeshSphere();
            let material = new ƒ.Material("Ghost", ƒ.ShaderLit, new ƒ.CoatColored());
            let cmpMesh = new ƒ.ComponentMesh(mesh);
            let cmpMaterial = new ƒ.ComponentMaterial(material);
            let cmpTransform = new ƒ.ComponentTransform();
            node.addComponent(cmpMesh);
            node.addComponent(cmpMaterial);
            node.addComponent(cmpTransform);
            cmpMaterial.clrPrimary = new ƒ.Color(255, 0, 0, 1);
            //cmpMaterial.clrPrimary = ƒ.Color.CSS("red");  //alternative color change by css
            node.mtxLocal.translate(new ƒ.Vector3(2, 1, 0));
        }
    }
    Script.Ghost = Ghost;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
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
    let spritePacman;
    let ghost;
    let ghostWalk = new ƒ.Vector3(1, 0, 0);
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
    async function start(_event) {
        viewport = _event.detail;
        viewport.camera.mtxPivot.translate(new ƒ.Vector3(12, 7, 27));
        viewport.camera.mtxPivot.rotateY(180);
        graph = viewport.getBranch();
        grid = graph.getChildrenByName("Grid")[0];
        pacman = graph.getChildrenByName("PacMan")[0];
        spritePacman = await createSprite();
        pacman.addChild(spritePacman);
        console.log(pacman);
        pacman.getComponent(ƒ.ComponentMaterial).activate(false);
        chomp = graph.getChildrenByName("Sound")[0].getChildrenByName("Chomp")[0].getComponents(ƒ.ComponentAudio)[0];
        ghost = createGhost();
        graph.addChild(ghost);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, ghostWalks);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        positionPacman = pacman.mtxLocal.translation;
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]) && (pacman.mtxLocal.translation.y + 0.025) % 1 < 0.05)
            direction.set(1, 0, 0);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A]) && (pacman.mtxLocal.translation.y + 0.025) % 1 < 0.05)
            direction.set(-1, 0, 0);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W]) && (pacman.mtxLocal.translation.x + 0.025) % 1 < 0.05)
            direction.set(0, 1, 0);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S]) && (pacman.mtxLocal.translation.x + 0.025) % 1 < 0.05)
            direction.set(0, -1, 0);
        //rotatePacman(direction);
        if (!checkPath(positionPacman, direction)) {
            direction.set(0, 0, 0);
        }
        pacman.mtxLocal.translate(ƒ.Vector3.SCALE(direction, speed));
        if (direction.magnitudeSquared != 0) {
            //spritePacman.mtxLocal.reset();
            spritePacman.mtxLocal.rotation = new ƒ.Vector3(0, direction.x < 0 ? 180 : 0, direction.y * 90);
        }
        if (direction.equals(ƒ.Vector3.ZERO())) {
            chomp.play(false);
            spritePacman.setFrameDirection(0);
        }
        else if (!chomp.isPlaying) {
            chomp.play(true);
            spritePacman.setFrameDirection(1);
        }
        viewport.draw();
        //ƒ.AudioManager.default.update();
    } //update
    function checkPath(_position, _direction) {
        //check if next element is a path or wall
        if (!_position || !_direction) {
            return false;
        }
        let rowNumber = Math.floor(_position.y) + _direction.y;
        let nextElementNumber = Math.floor(_position.x) + _direction.x;
        if (!nextElementNumber || !rowNumber || nextElementNumber < 1 || nextElementNumber > 23 || rowNumber < 1 || rowNumber > 13) {
            return false;
        }
        let nextElement = grid.getChild(rowNumber).getChild(nextElementNumber);
        let nextElementMesh = nextElement.getComponent(ƒ.ComponentMesh);
        let nextElementColor = nextElementMesh.node.getComponent(ƒ.ComponentMaterial).clrPrimary;
        //console.log(nextElementColor);
        if (nextElementColor.r == 1 && nextElementColor.g == 1 && nextElementColor.b == 1 && nextElementColor.a == 1) {
            return true;
        }
        return false;
    } //checkpath
    function createGhost() {
        let node = new ƒ.Node("Ghost");
        let mesh = new ƒ.MeshSphere();
        let material = new ƒ.Material("Ghost", ƒ.ShaderLit, new ƒ.CoatColored());
        let cmpMesh = new ƒ.ComponentMesh(mesh);
        let cmpMaterial = new ƒ.ComponentMaterial(material);
        let cmpTransform = new ƒ.ComponentTransform();
        node.addComponent(cmpMesh);
        node.addComponent(cmpMaterial);
        node.addComponent(cmpTransform);
        cmpMaterial.clrPrimary = new ƒ.Color(255, 0, 0, 1);
        //cmpMaterial.clrPrimary = ƒ.Color.CSS("red");  //alternative color change by css
        node.mtxLocal.translate(new ƒ.Vector3(2, 7, 0));
        return node;
    } //createGhost
    function ghostWalks() {
        if (!checkPath(ghost.mtxLocal.translation, ghostWalk)) {
            let ghostDirections = [new ƒ.Vector3(1, 0, 0), new ƒ.Vector3(-1, 0, 0), new ƒ.Vector3(0, 1, 0), new ƒ.Vector3(0, -1, 0)];
            let random = Math.floor(Math.random() * ghostDirections.length);
            ghostWalk = ghostDirections[random];
            while (!checkPath(ghost.mtxLocal.translation, ghostWalk)) {
                ghostDirections.splice(ghostDirections.indexOf(ghostWalk), 1);
                random = Math.round(Math.random() * ghostDirections.length);
                ghostWalk = ghostDirections[random];
            }
        }
        ghost.mtxLocal.translate(ƒ.Vector3.SCALE(ghostWalk, speed));
    } //ghostWalks
    async function createSprite() {
        let imgSpriteSheet = new ƒ.TextureImage();
        await imgSpriteSheet.load("Images/spriteSheet_Alida.png");
        let coat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
        let animation = new ƒAid.SpriteSheetAnimation("Pacman", coat);
        animation.generateByGrid(ƒ.Rectangle.GET(0, 0, 64, 64), 8, 70, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(64));
        let sprite = new ƒAid.NodeSprite("Sprite");
        sprite.setAnimation(animation);
        sprite.setFrameDirection(1);
        sprite.framerate = 30;
        let cmpTransfrom = new ƒ.ComponentTransform();
        sprite.addComponent(cmpTransfrom);
        sprite.cmpTransform.mtxLocal.translateZ(0.5);
        return sprite;
    } //createSprite
    /* function rotatePacman(_direction: ƒ.Vector3): void {
      if (_direction.x != 0 || _direction.y != 0) {
        let oldZ: number = spritePacman.mtxLocal.rotation.z;
        let newZ: number = 360 - oldZ;
        spritePacman.mtxLocal.rotateZ(newZ);
  
        if (_direction.x == 1) {
          spritePacman.mtxLocal.rotateZ(0);
        }
  
        if (_direction.x == -1) {
          spritePacman.mtxLocal.rotateZ(180);
        }
  
        if (_direction.y == 1) {
          spritePacman.mtxLocal.rotateZ(90);
        }
  
        if (_direction.y == -1) {
          spritePacman.mtxLocal.rotateZ(270);
        }
      }
    } //rotatePacman */
})(Script || (Script = {})); //namespace
//# sourceMappingURL=Script.js.map
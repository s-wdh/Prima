namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  export let viewport: ƒ.Viewport;
  let graph: ƒ.Node;
  let environment: ƒ.Node;
  let player: ƒ.Node;
  let camera: ƒ.ComponentCamera;
  let speedRotY: number = -0.1;
  let speedRotX: number = 0.2;
  let rotationX: number = 0;
  let cntWalk: ƒ.Control = new ƒ.Control("cntWalk", 6, ƒ.CONTROL_TYPE.PROPORTIONAL, 500);
  let ableToSprint: boolean = true;
  let energy: number = 5;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    graph = viewport.getBranch();
    player = graph.getChildrenByName("Player")[0];
    camera = player.getChildrenByName("Camera")[0].getComponent(ƒ.ComponentCamera);
    viewport.camera = camera;
    environment = graph.getChildrenByName("Environment")[0];

    let canvas: HTMLCanvasElement = viewport.getCanvas();
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.requestPointerLock();

    createTrees();

    //document.body.style.cursor = "crosshair";

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  } //start

  function update(_event: Event): void {
    ƒ.Physics.simulate();  // if physics is included and used
    controlWalk();
    adaptSpeed();
    viewport.draw();
    ƒ.AudioManager.default.update();
  } //update

  function controlWalk(): void {
    let input: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
    cntWalk.setInput(input);
    player.mtxLocal.translateZ(cntWalk.getOutput() * ƒ.Loop.timeFrameGame / 1000);
    if (player.mtxLocal.translation.z > 30) {
      player.mtxLocal.translation.z = 30;
    } else if (player.mtxLocal.translation.z < -30) {
      player.mtxLocal.translation.z = -30;
    }

    let strafe: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
    player.mtxLocal.translateX(1.5 * strafe * ƒ.Loop.timeFrameGame / 1000);
    if (player.mtxLocal.translation.x > 30) {
      player.mtxLocal.translation.x = 30;
    } else if (player.mtxLocal.translation.x < -30) {
      player.mtxLocal.translation.x = -30;
    }
  } //controlWalk

  function adaptSpeed(): void {
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.R]) && ableToSprint == true) {
      energy -= ƒ.Loop.timeFrameGame / 1000;
      player.mtxLocal.translateZ(4 * cntWalk.getOutput() * ƒ.Loop.timeFrameGame / 1000);
      if (energy <= 0) {
        ableToSprint = false;
      }
    } else if (!ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.R])) {
      if (energy < 5) {
        energy += ƒ.Loop.timeFrameGame / 1000;
      }
      if (energy > 1 && ableToSprint == false) {
        ableToSprint = true;
      }
    }
  } //adaptSpeed

  function handlePointerMove(_event: PointerEvent): void {
    player.mtxLocal.rotateY(_event.movementX * speedRotY);
    rotationX += _event.movementY * speedRotX;
    rotationX = Math.min(60, Math.max(-60, rotationX));
    camera.mtxPivot.rotation = ƒ.Vector3.X(rotationX);
  } //handlePointerMove

  function createTrees(): void {
    let forest: ƒ.Node = environment.getChildrenByName("Trees")[0];
    for (let i = 0; i < 100; i++) {
      let position: ƒ.Vector3 = ƒ.Random.default.getVector3(new ƒ.Vector3(-30, 0, -30), new ƒ.Vector3(30, 0, 30));
      let roundedPosition: ƒ.Vector3 = new ƒ.Vector3(Math.round(position.x), Math.round(position.y), Math.round(position.z));
      let tree: Tree = new Tree(roundedPosition);
      forest.addChild(tree);
    }
  }
} //namespace
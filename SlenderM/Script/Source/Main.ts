namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  export let viewport: ƒ.Viewport;
  let graph: ƒ.Node;
  let player: ƒ.Node;
  let camera: ƒ.ComponentCamera;
  let speedRotY: number = -0.1;
  let speedRotX: number = 0.2;
  let rotationX: number = 0;
  let cntWalk: ƒ.Control = new ƒ.Control("cntWalk", 3, ƒ.CONTROL_TYPE.PROPORTIONAL, 500);
  let ableToSprint: boolean = true;
  let energy: number = 5;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    graph = viewport.getBranch();
    player = graph.getChildrenByName("Player")[0];
    camera = player.getChildrenByName("Camera")[0].getComponent(ƒ.ComponentCamera);
    viewport.camera = camera;

    let canvas: HTMLCanvasElement = viewport.getCanvas();
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.requestPointerLock();

    document.body.style.cursor = "crosshair";

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  } //start

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    controlWalk();
    adaptSpeed();
    viewport.draw();
    ƒ.AudioManager.default.update();
  } //update

  function controlWalk(): void {
    let input: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
    cntWalk.setInput(input);
    player.mtxLocal.translateZ(cntWalk.getOutput() * ƒ.Loop.timeFrameGame / 1000);

    let strafe: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
    cntWalk.setInput(strafe);
    player.mtxLocal.translateX(cntWalk.getOutput() * ƒ.Loop.timeFrameGame / 1000);
  } //controlWalk

  function adaptSpeed(): void {
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.R]) && ableToSprint == true) {
      energy -= ƒ.Loop.timeFrameGame / 1000;
      if (energy <= 0) {
        ableToSprint = false
      }
    } else if (!ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.R]) && ableToSprint == true) {
      if (energy < 5) {
        energy += ƒ.Loop.timeFrameGame / 1000;
      }
    } else if (!ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.R]) && ableToSprint == false) {
      if (energy < 5) {
        energy += ƒ.Loop.timeFrameGame / 1000;
      }
      if (energy > 1) {
        ableToSprint = true;
      }
    }
  } //adaptSpeed

  function handlePointerMove(_event: PointerEvent): void {
    console.log(_event);
    player.mtxLocal.rotateY(_event.movementX * speedRotY);
    rotationX += _event.movementY * speedRotX;
    rotationX = Math.min(60, Math.max(-60, rotationX));
    camera.mtxPivot.rotation = ƒ.Vector3.X(rotationX);
  } //handlePointerMove
} //namespace
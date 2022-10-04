namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  interface Config {
    [key: string]: number | string | Config;
  }

  export let viewport: ƒ.Viewport;
  let graph: ƒ.Node;
  export let environment: ƒ.Node;
  export let player: ƒ.Node;
  let camera: ƒ.ComponentCamera;
  let speedRotY: number = -0.1;
  let speedRotX: number = 0.2;
  let rotationX: number = 0;
  let cntWalk: ƒ.Control = new ƒ.Control("cntWalk", 6, ƒ.CONTROL_TYPE.PROPORTIONAL, 500);
  let ableToSprint: boolean = true;
  let energy: number = 5;
  let gameState: GameState;
  let config: Config;

  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;
    graph = viewport.getBranch();
    player = graph.getChildrenByName("Player")[0];
    camera = player.getChildrenByName("Camera")[0].getComponent(ƒ.ComponentCamera);
    viewport.camera = camera;
    environment = graph.getChildrenByName("Environment")[0];

    gameState = new GameState();
    let response: Response = await fetch("config.json");
    config = await response.json();
    console.log(config);

    let canvas: HTMLCanvasElement = viewport.getCanvas();
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.requestPointerLock();
    //document.body.style.cursor = "crosshair";
    document.addEventListener("keydown", hndKeydown);

    createTrees();

    environment.addChild(new ƒ.Node("Players"));

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    initAnim();
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  } //start

  function update(_event: Event): void {
    ƒ.Physics.simulate();  // if physics is included and used
    controlWalk();
    adaptSpeed();
    gameState.battery -= <number>config["drain"];
    document.querySelector("input").value = gameState.battery.toString(); //String(battery)
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

    //let vector = new ƒ.Vector3((1.5 * input * ƒ.Loop.timeFrameGame / 20), 0, (cntWalk.getOutput() * ƒ.Loop.timeFrameGame / 30));

    let strafe: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
    player.mtxLocal.translateX(1.5 * strafe * ƒ.Loop.timeFrameGame / 1000);
    if (player.mtxLocal.translation.x > 30) {
      player.mtxLocal.translation.x = 30;
    } else if (player.mtxLocal.translation.x < -30) {
      player.mtxLocal.translation.x = -30;
    }
    sendMessage();
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
    for (let i: number = 0; i < 100; i++) {
      let position: ƒ.Vector3 = ƒ.Random.default.getVector3(new ƒ.Vector3(-30, 0, -30), new ƒ.Vector3(30, 0, 30));
      let roundedPosition: ƒ.Vector3 = new ƒ.Vector3(Math.round(position.x), Math.round(position.y), Math.round(position.z));
      let tree: Tree = new Tree(roundedPosition);
      forest.addChild(tree);
    }
  }

  function hndKeydown(_event: KeyboardEvent): void {
    if (_event.code != ƒ.KEYBOARD_CODE.SPACE)
      return;

    let torch: ƒ.Node = player.getChildrenByName("Torch")[0];
    torch.activate(!torch.isActive);

    torch.dispatchEvent(new Event("toggleTorch", { bubbles: true }));
  }

  function initAnim(): void {
    let animseq: ƒ.AnimationSequence = new ƒ.AnimationSequence();
    animseq.addKey(new ƒ.AnimationKey(0, 10));
    animseq.addKey(new ƒ.AnimationKey(500, 5));
    animseq.addKey(new ƒ.AnimationKey(1000, 0));
    animseq.addKey(new ƒ.AnimationKey(1500, 5));
    animseq.addKey(new ƒ.AnimationKey(2000, 10));

    let animStructure: ƒ.AnimationStructure = {
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

    let animation: ƒ.Animation = new ƒ.Animation("testAnimation", animStructure);
    let stone: ƒ.Node = environment.getChildrenByName("Stone")[0];

    let cmpAnimator: ƒ.ComponentAnimator = new ƒ.ComponentAnimator(animation, ƒ.ANIMATION_PLAYMODE.LOOP);

    stone.addComponent(cmpAnimator);
    cmpAnimator.activate(true);
  }
} //namespace
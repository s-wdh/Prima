namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let graph: ƒ.Node;
  let pacman: ƒ.Node;
  let positionPacman: ƒ.Vector3;
  let grid: ƒ.Node;
  let speed: number = 1 / 60;
  let direction: ƒ.Vector3 = ƒ.Vector3.ZERO();
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    viewport.camera.mtxPivot.rotateY(180);
    viewport.camera.mtxPivot.translateZ(-27);
    viewport.camera.mtxPivot.translateX(-12);
    viewport.camera.mtxPivot.translateY(7.5);
    graph = viewport.getBranch();
    pacman = graph.getChildrenByName("PacMan")[0];
    grid = graph.getChildrenByName("Grid")[0];

    //console.log(pacman.getComponent(ƒ.ComponentTransform));

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    positionPacman = pacman.mtxLocal.translation;
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]) && (pacman.mtxLocal.translation.y + 0.025) % 1 < 0.05) {
      direction.set(1, 0, 0);
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A]) && (pacman.mtxLocal.translation.y + 0.025) % 1 < 0.05) {
      direction.set(- 1, 0, 0);
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W]) && (pacman.mtxLocal.translation.x + 0.025) % 1 < 0.05) {
      direction.set(0, 1, 0);
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S]) && (pacman.mtxLocal.translation.x + 0.025) % 1 < 0.05) {
      direction.set(0, -1, 0);
    }

    checkPath();

    viewport.draw();
    //ƒ.AudioManager.default.update();
  } //update

  function checkPath(): void {
    //check if next element is a path or wall
    let nextElementNumber: number;
    let nextElement: ƒ.Node;
    let rownr: number;
    nextElementNumber = Math.trunc(positionPacman.x) - direction.x;
    rownr = Math.trunc(positionPacman.y) - direction.y;
    if (nextElementNumber < 1 || nextElementNumber > 23 || rownr < 1 || rownr > 13) {
      direction.set(0, 0, 0);
    } else {
      nextElement = grid.getChild(rownr).getChild(nextElementNumber);
      let nextElementMesh: ƒ.Component = nextElement.getComponent(ƒ.ComponentMesh);
      let nextElementColor: ƒ.Color = nextElementMesh.node.getComponent(ƒ.ComponentMaterial).clrPrimary;
      console.log(nextElementColor);
      if (nextElementColor.r == 1 && nextElementColor.g == 1 && nextElementColor.b == 1 && nextElementColor.a == 1) {
        pacman.mtxLocal.translate(ƒ.Vector3.SCALE(direction, speed));
      } else {
        direction.set(0, 0, 0);
      }
    }
  } //checkpath
} //namespace
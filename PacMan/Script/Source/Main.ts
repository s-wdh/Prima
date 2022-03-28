namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let graph: ƒ.Node;
  let pacman: ƒ.Node;
  let grid: ƒ.Node;
  let speed: ƒ.Vector3 = new ƒ.Vector3(0, 0, 0);
  let direction: string;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    graph = viewport.getBranch();
    pacman = graph.getChildrenByName("PacMan")[0];
    grid = graph.getChildrenByName("Grid")[0];
    //console.log(pacman);

    //console.log(pacman.getComponent(ƒ.ComponentTransform));

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {

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

  function checkPath(): void {
    let position: ƒ.Vector3 = pacman.mtxLocal.translation;
    let nextElementNumber: number;
    let row: ƒ.Node;
    let nextElement: ƒ.Node;
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
        let nextElementMesh: ƒ.Component = nextElement.getComponent(ƒ.ComponentMesh);
        let nextElementColor: ƒ.Color = nextElementMesh.node.getComponent(ƒ.ComponentMaterial).clrPrimary;
        console.log(nextElementColor);
        if (nextElementColor.r == 1 && nextElementColor.g == 1 && nextElementColor.b == 1 && nextElementColor.a == 1) {
          console.log("YAY");
        } else {
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
        let nextElementMesh: ƒ.Component = nextElement.getComponent(ƒ.ComponentMesh);
        let nextElementColor: ƒ.Color = nextElementMesh.node.getComponent(ƒ.ComponentMaterial).clrPrimary;
        console.log(nextElementColor);
        if (nextElementColor.r == 1 && nextElementColor.g == 1 && nextElementColor.b == 1 && nextElementColor.a == 1) {
          console.log("YAY");
        } else {
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
        let nextElementMesh: ƒ.Component = nextElement.getComponent(ƒ.ComponentMesh);
        let nextElementColor: ƒ.Color = nextElementMesh.node.getComponent(ƒ.ComponentMaterial).clrPrimary;
        console.log(nextElementColor);
        if (nextElementColor.r == 1 && nextElementColor.g == 1 && nextElementColor.b == 1 && nextElementColor.a == 1) {
          console.log("YAY");
        } else {
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
        let nextElementMesh: ƒ.Component = nextElement.getComponent(ƒ.ComponentMesh);
        let nextElementColor: ƒ.Color = nextElementMesh.node.getComponent(ƒ.ComponentMaterial).clrPrimary;
        console.log(nextElementColor);
        if (nextElementColor.r == 1 && nextElementColor.g == 1 && nextElementColor.b == 1 && nextElementColor.a == 1) {
          console.log("YAY");
        } else {
          speed.set(0, 0, 0);
        }
        break;
      }
    }
  }
}
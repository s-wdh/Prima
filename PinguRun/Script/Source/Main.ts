namespace PinguRun {
  export import ƒ = FudgeCore;
  export import ƒAid = FudgeAid;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  export let graph: ƒ.Node;
  export let collectables: ƒ.Node;
  export let stars: ƒ.Node[] = [];
  export let coins: ƒ.Node[] = [];
  let pingu: Pingu;
  let camera: ƒ.Node;

  interface ExternalData {
    [name: string]: number;
  }

  let config: ExternalData;
  let gameDuration: number;
  export let starAmount: number;
  export let coinAmount: number;
  export let gameState: GameState;
  let looseAudio: ƒ.ComponentAudio;
  let winAudio: ƒ.ComponentAudio;

  let gameTime: ƒ.Time;
  export let timer: ƒ.Timer;

  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;
    graph = viewport.getBranch();
    let character: ƒ.Node = graph.getChildrenByName("Character")[0].getChildrenByName("Pingu")[0];
    pingu = new Pingu;
    character.addChild(pingu);
    collectables = graph.getChildrenByName("Collectables")[0];

    await getExternalData();
    createCollectables();
    adjustCamera();
    createBridge();
    gameTime = new ƒ.Time();
    timer = new ƒ.Timer(gameTime, 1000, 0, updateTimer);
    graph.addEventListener("checkGameEnd", loadEndScreen);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  } //start

  function update(_event: Event): void {
    pingu.walk();
    pingu.jump();
    pingu.checkPosition();
    pingu.hitCoin();

    ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  } //update

  async function getExternalData(): Promise<void> {
    let response: Response = await fetch("config.json");
    config = await response.json();
    gameDuration = config["gameDuration"];
    starAmount = config["starAmount"];
    coinAmount = config["coinAmount"];

    gameState = new GameState(gameDuration);
  } //getExternalData

  function createCollectables(): void {
    for (let i: number = 0; i < starAmount; i++) {
      let star: Star = new Star(i + 1);
      collectables.addChild(star);
      stars.push(star);
    }
    for (let i: number = 0; i < coinAmount; i++) {
      let coin: Coin = new Coin(i + 1);
      collectables.addChild(coin);
      coins.push(coin);
    }
  } //createCollectables

  function adjustCamera(): void {
    camera = graph.getChildrenByName("Character")[0].getChildrenByName("Camera")[0];
    let cmpCamera: ƒ.ComponentCamera = camera.getComponent(ƒ.ComponentCamera);
    viewport.camera = cmpCamera;
    viewport.camera.mtxPivot.rotateY(180);
    viewport.camera.mtxPivot.translateZ(-30);
  } //adjustCamera

  function createBridge(): void {
    let handle: ƒ.Node = graph.getChildrenByName("Track")[0].getChildrenByName("Bridge")[0].getChildrenByName("Handle")[0];
    let swing: ƒ.Node = graph.getChildrenByName("Track")[0].getChildrenByName("Bridge")[0].getChildrenByName("Swing")[0];
    let revoluteJoint: ƒ.JointRevolute = new ƒ.JointRevolute(handle.getComponent(ƒ.ComponentRigidbody), swing.getComponent(ƒ.ComponentRigidbody), new ƒ.Vector3(0, 0, 1));
    handle.addComponent(revoluteJoint);
    revoluteJoint.bodyTied.applyForce(new ƒ.Vector3(0, 0, 0));
    revoluteJoint.minMotor = 0;
    revoluteJoint.maxMotor = 90;
  } //createBridge

  export function moveCamera(_vector: ƒ.Vector3): void {
    _vector.scale(1 / 60);
    camera.mtxLocal.translate(_vector);
  } //moveCamera

  function updateTimer(): void {
    gameState.time -= 1;
    if (gameState.time <= 0) {
      timer.clear();
      pingu.dispatchEvent(new CustomEvent("checkGameEnd", {
        bubbles: true,
        detail: "timeOut"
      }));
    }
  } //updateTimer

  function loadEndScreen(_event: CustomEvent): void {
    ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, update);
    looseAudio = graph.getChildrenByName("Sound")[0].getChildrenByName("Loosing")[0].getComponents(ƒ.ComponentAudio)[0];
    winAudio = graph.getChildrenByName("Sound")[0].getChildrenByName("Winning")[0].getComponents(ƒ.ComponentAudio)[0];
    if (_event.detail == "loose") {
      looseAudio.play(true);
      console.log("loose");
      alert("Nooooo! Pingu fell down. Let's hope that he can swim.");
    }
    if (_event.detail == "win") {
      winAudio.play(true);
      timer.clear();
      console.log("win");
      if (gameState.coins > 0) {
        alert("Yayyhhh! Pingu is happy that you brought him back home on time. \nHe also wants to thank you for the " + gameState.coins + " coins you collected for him.");
      } else {
        alert("Yayyhhh! Pingu is happy that you brought him back home on time.");
      }
      
    }
    if (_event.detail == "timeOut") {
      looseAudio.play(true);
      console.log("loose");
      alert("Oh no! The time ran out. Let's hope that Pingu survives the night outside.");
    }
  } //loadEndScreen
}
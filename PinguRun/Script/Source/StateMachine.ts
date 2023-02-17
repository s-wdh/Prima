namespace PinguRun {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  export enum JOB {
    IDLE, FLY, SHINE
  }

  export class StarMachine extends ƒAid.ComponentStateMachine<JOB> {
    private static instructions: ƒAid.StateMachineInstructions<JOB> = StarMachine.get();

    public constructor() {
      super();
      this.instructions = StarMachine.instructions;

      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
    }
    public static get(): ƒAid.StateMachineInstructions<JOB> {
      let setup: ƒAid.StateMachineInstructions<JOB> = new ƒAid.StateMachineInstructions();
      setup.transitDefault = StarMachine.transitDefault;
      setup.actDefault = StarMachine.actDefault;
      setup.setAction(JOB.IDLE, <ƒ.General>this.actIdle);
      setup.setAction(JOB.FLY, <ƒ.General>this.actFly);
      setup.setAction(JOB.SHINE, <ƒ.General>this.actShine);
      return setup;
    }

    private static transitDefault(_machine: StarMachine): void {
      //console.log(_machine, `Default Transition   ${JOB[_machine.stateCurrent]} -> ${JOB[_machine.stateNext]}`);
    }
    private static async actDefault(_machine: StarMachine): Promise<void> {
      //console.log(_machine, `Default Action       ${JOB[_machine.stateCurrent]}`);
    }

    private static actIdle(_machine: StarMachine): void {
      //
    }

    private static actFly(_machine: StarMachine): void {
      let star: Star = <Star>_machine.node;
      star.removeComponent(star.rigidbody);
      star.animate();
      star.starAudio.play(true);
    } //actFly

    private static actShine(_machine: StarMachine): void {
      let star: Star = <Star>_machine.node;
      star.removeComponent(star.stateMachine);
      stars.splice(stars.indexOf(star));
      collectables.removeChild(star);
      gameState.stars += 1;
      switch (gameState.stars) {
        case 1: {
          let starImage: HTMLImageElement = <HTMLImageElement>document.getElementById("star1");
          starImage.style.display = "block";
          break;
        }
        case 2: {
          let starImage: HTMLImageElement = <HTMLImageElement>document.getElementById("star2");
          starImage.style.display = "block";
          break;
        }
        case 3: {
          let starImage: HTMLImageElement = <HTMLImageElement>document.getElementById("star3");
          starImage.style.display = "block";
          break;
        }
        default:
          break;
      }
    } //actShine

    public hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:
          ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
      }
    } //hndEvent
    public update = (_event: Event): void => {
      this.act();
    } //update

  }
}
namespace PinguRun {
    import ƒ = FudgeCore;
    import ƒUi = FudgeUserInterface;
  
    export class GameState extends ƒ.Mutable {
      public stars: number = 0;
      public coins: number = 0;
      public time: number = 60;
  
      public constructor(_time: number) {
        super();
        let domVui: HTMLDivElement = document.querySelector("div#vui");
        console.log(new ƒUi.Controller(this, domVui));
        this.time = _time;
      }
  
      protected reduceMutator(_mutator: ƒ.Mutator): void { /* */ }
    }
  }
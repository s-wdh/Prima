namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class Slenderman extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface

        //public target: ƒ.Vector3 = ƒ.Vector3.ZERO();
        /* private timeToChange: number = 0;
        private direction: ƒ.Vector3 = ƒ.Vector3.ZERO(); */


        constructor() {
            super();

            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;

            // Listen to this component being added to or removed from a node
            this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
        }

        // Activate the functions of this component as response to events
        public hndEvent = (_event: Event): void => {
            switch (_event.type) {
                case ƒ.EVENT.COMPONENT_ADD:
                    //this.node.addEventListener(ƒ.EVENT.RENDER_PREPARE, this.move);
                    break;
            }
        }

        /* private move = (_event: Event): void => {
            this.node.mtxLocal.translate(ƒ.Vector3.SCALE(this.direction, ƒ.Loop.timeFrameGame / 1000));
            //let currentPosition: ƒ.Vector3 = this.node.mtxLocal.clone.translation;
            //currentPosition.add(ƒ.Vector3.SCALE(this.target, ƒ.Loop.timeFrameGame / 1000));
            //if (currentPosition.x < 30 && currentPosition.z < 30 && currentPosition.x > -30 && currentPosition.z > -30)
            //    this.node.mtxLocal.translate(ƒ.Vector3.SCALE(this.target, ƒ.Loop.timeFrameGame / 1000));

            if (this.timeToChange > ƒ.Time.game.get())
                return;

            this.timeToChange = ƒ.Time.game.get() + 1000;

            this.direction = ƒ.Random.default.getVector3(new ƒ.Vector3(-1, 0, -1), new ƒ.Vector3(1, 0, 1));
        } */

        // protected reduceMutator(_mutator: ƒ.Mutator): void {
        //   // delete properties that should not be mutated
        //   // undefined properties and private fields (#) will not be included by default
        // }
    }
}
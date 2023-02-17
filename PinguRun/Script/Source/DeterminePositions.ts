namespace PinguRun {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(PinguRun);  // Register the namespace to FUDGE for serialization

    export class DeterminePositions extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        public message: string = "DeterminePositions added to ";

        index: number;
        totalAmount: number;

        constructor(_index: number, _totalAmount: number) {
            super();

            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            this.index = _index;
            this.totalAmount = _totalAmount;
            // Listen to this component being added to or removed from a node
            this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.calculatePosition);
        }

        // Activate the functions of this component as response to events
        public calculatePosition(): void {
            //calculate the positions based on how many collectables exist, so they get spread out evenly in the game
            let max: number = ((80 / this.totalAmount) * this.index);
            let min: number = (80 / this.totalAmount) * (this.index - 1) + 10;
            let position: number = min + Math.floor(Math.random() * (max - min));
            //console.log(position);
            this.node.mtxLocal.translateX(position);
        } //calculatePosition
    }
}
declare namespace PinguRun {
    import ƒ = FudgeCore;
    class Coin extends ƒ.Node {
        cmpAnimator: ƒ.ComponentAnimator;
        constructor(_index: number);
        initAnim(): void;
    }
}
declare namespace PinguRun {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace PinguRun {
    import ƒ = FudgeCore;
    class DeterminePositions extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        index: number;
        totalAmount: number;
        constructor(_index: number, _totalAmount: number);
        calculatePosition(): void;
    }
}
declare namespace PinguRun {
    import ƒ = FudgeCore;
    class GameState extends ƒ.Mutable {
        stars: number;
        coins: number;
        time: number;
        constructor(_time: number);
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
declare namespace PinguRun {
    export import ƒ = FudgeCore;
    export import ƒAid = FudgeAid;
    let graph: ƒ.Node;
    let collectables: ƒ.Node;
    let stars: ƒ.Node[];
    let coins: ƒ.Node[];
    let starAmount: number;
    let coinAmount: number;
    let gameState: GameState;
    let timer: ƒ.Timer;
    function moveCamera(_vector: ƒ.Vector3): void;
}
declare namespace PinguRun {
    import ƒ = FudgeCore;
    class Pingu extends ƒ.Node {
        spritePingu: ƒAid.NodeSprite;
        animation: ƒAid.SpriteSheetAnimation;
        direction: ƒ.Vector3;
        rigidbody: ƒ.ComponentRigidbody;
        jumpAudio: ƒ.ComponentAudio;
        jumpable: boolean;
        coinAudio: ƒ.ComponentAudio;
        constructor();
        createSprite(): Promise<void>;
        walk(): void;
        jump(): void;
        checkPosition(): void;
        hitCoin(): void;
    }
}
declare namespace PinguRun {
    import ƒ = FudgeCore;
    class Star extends ƒ.Node {
        starAudio: ƒ.ComponentAudio;
        stateMachine: ƒAid.ComponentStateMachine<JOB>;
        cmpAnimator: ƒ.ComponentAnimator;
        rigidbody: ƒ.ComponentRigidbody;
        constructor(_index: number);
        animate(): void;
    }
}
declare namespace PinguRun {
    import ƒAid = FudgeAid;
    enum JOB {
        IDLE = 0,
        FLY = 1,
        SHINE = 2
    }
    class StarMachine extends ƒAid.ComponentStateMachine<JOB> {
        private static instructions;
        constructor();
        static get(): ƒAid.StateMachineInstructions<JOB>;
        private static transitDefault;
        private static actDefault;
        private static actIdle;
        private static actFly;
        private static actShine;
        hndEvent: (_event: Event) => void;
        update: (_event: Event) => void;
    }
}
declare namespace PinguRun {
    let canvas: HTMLCanvasElement;
}

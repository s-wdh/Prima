declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class DropToGroundInitial extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        graph: ƒ.Node;
        environment: ƒ.Node;
        ground: ƒ.Node;
        cmpMeshOfGround: ƒ.ComponentMesh;
        meshTerrain: ƒ.MeshTerrain;
        constructor();
        hndEvent: (_event: Event) => void;
        adaptPosition: () => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    let viewport: ƒ.Viewport;
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Slenderman extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        target: ƒ.Vector3;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}

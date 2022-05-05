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
        graph: ƒ.Graph;
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
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Tree extends ƒ.Node {
        treeBlueprint: ƒ.Graph;
        tree: ƒ.GraphInstance;
        treeRigid: ƒ.ComponentRigidbody;
        constructor(_position: ƒ.Vector3);
    }
}

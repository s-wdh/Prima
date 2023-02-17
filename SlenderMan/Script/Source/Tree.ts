namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class Tree extends ƒ.Node {
        treeBlueprint: ƒ.Graph;
        tree: ƒ.GraphInstance;
        treeRigid: ƒ.ComponentRigidbody;

        constructor(_position: ƒ.Vector3) {
            super("Tree");
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            this.addComponent(new ƒ.ComponentTransform());
            this.cmpTransform.mtxLocal.translation = _position;
            this.treeBlueprint = <ƒ.Graph>ƒ.Project.resources["Graph|2022-04-28T12:10:55.160Z|97133"];
            this.tree = new ƒ.GraphInstance(this.treeBlueprint);
            this.tree.reset();
            this.addComponent(new DropToGroundInitial());
            this.treeRigid = new ƒ.ComponentRigidbody();
            this.addComponent(this.treeRigid);
            this.treeRigid.typeBody = ƒ.BODY_TYPE.STATIC;
            this.treeRigid.initialization = ƒ.BODY_INIT.TO_NODE;
            this.treeRigid.typeCollider = ƒ.COLLIDER_TYPE.CONE;
            this.addChild(this.tree);
        }
    } //class Tree
}
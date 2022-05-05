namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class DropToGroundInitial extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(DropToGroundInitial);
    // Properties may be mutated by users in the editor via the automatically created user interface

    public graph: ƒ.Graph;
    public ground: ƒ.Node;
    public cmpMeshOfGround: ƒ.ComponentMesh;
    public meshTerrain: ƒ.MeshTerrain;

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
          this.node.addEventListener(ƒ.EVENT.RENDER_PREPARE, this.adaptPosition);
          break;
      }
    }

    public adaptPosition = (): void => {
      this.graph = <ƒ.Graph>ƒ.Project.resources["Graph|2022-04-14T13:11:49.215Z|97520"];
      this.ground = this.graph.getChildrenByName("Environment")[0].getChildrenByName("Ground")[0];
      this.cmpMeshOfGround = this.ground.getComponent(ƒ.ComponentMesh);
      this.meshTerrain = <ƒ.MeshTerrain>this.cmpMeshOfGround.mesh;

      if (!this.node == undefined) {
        let distance: number = this.meshTerrain.getTerrainInfo(this.node.mtxLocal.translation, this.cmpMeshOfGround.mtxWorld)?.distance;
        if (distance != 0) {
          this.node.mtxLocal.translateY(-distance);
        }
      }

    }
  }
}
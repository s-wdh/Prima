namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization
  
    export class DropToGroundInitial extends ƒ.ComponentScript {
      // Register the script as component for use in the editor via drag&drop
      public static readonly iSubclass: number = ƒ.Component.registerSubclass(DropToGroundInitial);
      // Properties may be mutated by users in the editor via the automatically created user interface

      public graph: ƒ.Node = <ƒ.Graph>ƒ.Project.resources["Graph|2022-04-28T12:10:55.160Z|97133"];
      public ground: ƒ.Node = this.graph.getChildrenByName("Environment")[0].getChildrenByName("Ground")[0];
      public cmpMeshOfGround: ƒ.ComponentMesh = this.ground.getComponent(ƒ.ComponentMesh);
      public meshTerrain: ƒ.MeshTerrain = <ƒ.MeshTerrain>this.cmpMeshOfGround.mesh;
  
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
        let distance: number = this.meshTerrain.getTerrainInfo(this.node.mtxLocal.translation, this.cmpMeshOfGround.mtxWorld).distance;
        if (distance != 0) {
          this.node.mtxLocal.translateY(- distance);
        }
      }
    }
  }
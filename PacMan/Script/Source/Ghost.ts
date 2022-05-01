namespace Script {
    export class Ghost extends ƒ.Node {
        constructor() {
            super("Ghost");
            let node: ƒ.Node = new ƒ.Node("Ghost");
            let mesh: ƒ.MeshSphere = new ƒ.MeshSphere();
            let material: ƒ.Material = new ƒ.Material("Ghost", ƒ.ShaderLit, new ƒ.CoatColored());
            let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(mesh);
            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);
            let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform();
            node.addComponent(cmpMesh);
            node.addComponent(cmpMaterial);
            node.addComponent(cmpTransform);
            cmpMaterial.clrPrimary = new ƒ.Color(255, 0, 0, 1);
            //cmpMaterial.clrPrimary = ƒ.Color.CSS("red");  //alternative color change by css
            node.mtxLocal.translate(new ƒ.Vector3(2, 1, 0));         
        }

    }
}
namespace PinguRun {
    import ƒ = FudgeCore;

    export class Star extends ƒ.Node {
        starAudio: ƒ.ComponentAudio;
        stateMachine: ƒAid.ComponentStateMachine<JOB>;
        cmpAnimator: ƒ.ComponentAnimator;
        rigidbody: ƒ.ComponentRigidbody;

        constructor(_index: number) {
            super("Star");
            let mesh: ƒ.MeshQuad = new ƒ.MeshQuad();
            let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(mesh);
            let image: ƒ.TextureImage = new ƒ.TextureImage("Images/Star_Shadow.png");
            let material: ƒ.Material = new ƒ.Material("Star", ƒ.ShaderLitTextured, new ƒ.CoatTextured(undefined, image));
            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);
            let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform();
            cmpTransform.mtxLocal.scale(new ƒ.Vector3(1, 1, 1));
            this.addComponent(cmpMesh);
            this.addComponent(cmpMaterial);
            this.addComponent(cmpTransform);
            this.mtxLocal.translate(new ƒ.Vector3(1, 2, 0));
            this.addComponent(new DeterminePositions(_index, starAmount));
            
            this.starAudio = graph.getChildrenByName("Sound")[0].getChildrenByName("Star")[0].getComponents(ƒ.ComponentAudio)[0];

            //create rigidbody for physics
            this.rigidbody = new ƒ.ComponentRigidbody();
            this.rigidbody.effectRotation = new ƒ.Vector3(0, 0, 0);
            this.rigidbody.typeBody = 1; // 1=Bodytype static
            this.rigidbody.setVelocity(new ƒ.Vector3(0, 0, 0));
            this.addComponent(this.rigidbody);

            this.stateMachine = new StarMachine();
            this.addComponent(this.stateMachine);
            this.stateMachine.stateCurrent = JOB.IDLE;

            this.rigidbody.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, (_event: ƒ.EventPhysics) => {
                if (_event.cmpRigidbody.node.name == "Pingu") {
                    this.stateMachine.transit(JOB.FLY);
                    setTimeout(() => {
                        this.stateMachine.transit(JOB.SHINE);
                    },         2000);
                }
            });
        } //constructor

        animate(): void {
            let animseq: ƒ.AnimationSequence = new ƒ.AnimationSequence();
            animseq.addKey(new ƒ.AnimationKey(0, 2));
            animseq.addKey(new ƒ.AnimationKey(2000, 20));

            let animStructure: ƒ.AnimationStructure = {
                components: {
                    ComponentTransform: [
                        {
                            "ƒ.ComponentTransform": {
                                mtxLocal: {
                                    translation: {
                                        y: animseq
                                    }
                                }
                            }
                        }
                    ]
                }
            };
            let animation: ƒ.Animation = new ƒ.Animation("StarAnimation", animStructure);
            this.cmpAnimator = new ƒ.ComponentAnimator(animation, ƒ.ANIMATION_PLAYMODE.LOOP);
            this.addComponent(this.cmpAnimator);
            this.cmpAnimator.activate(true);
        } //animate
    }
}





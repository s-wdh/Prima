namespace PinguRun {
    import ƒ = FudgeCore;

    export class Coin extends ƒ.Node {
        cmpAnimator: ƒ.ComponentAnimator;

        constructor(_index: number) {
            super("Coin");
            let mesh: ƒ.MeshSprite = new ƒ.MeshSprite();
            let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(mesh);
            let image: ƒ.TextureImage = new ƒ.TextureImage("Images/Coin.png");
            let material: ƒ.Material = new ƒ.Material("Coin", ƒ.ShaderLitTextured, new ƒ.CoatTextured(undefined, image));
            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);
            let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform();
            cmpTransform.mtxLocal.scale(new ƒ.Vector3(1, 1, 1));
            this.addComponent(cmpMesh);
            this.addComponent(cmpMaterial);
            this.addComponent(cmpTransform);
            this.mtxLocal.translate(new ƒ.Vector3(1, 2, 0));
            this.addComponent(new DeterminePositions(_index, coinAmount));
            this.initAnim();
        }

        initAnim(): void {
            let animseq: ƒ.AnimationSequence = new ƒ.AnimationSequence();
            animseq.addKey(new ƒ.AnimationKey(0, 0));
            animseq.addKey(new ƒ.AnimationKey(8000, 360)); //rotate one turn around the middle

            let animStructure: ƒ.AnimationStructure = {
                components: {
                    ComponentTransform: [
                        {
                            "ƒ.ComponentTransform": {
                                mtxLocal: {
                                    rotation: {
                                        y: animseq
                                    }
                                }
                            }
                        }
                    ]
                }
            };
            let animation: ƒ.Animation = new ƒ.Animation("CoinAnimation", animStructure);
            this.cmpAnimator = new ƒ.ComponentAnimator(animation, ƒ.ANIMATION_PLAYMODE.LOOP);
            this.addComponent(this.cmpAnimator);
            this.cmpAnimator.activate(true);
        } //initAnim
    }
}
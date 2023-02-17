namespace PinguRun {
    import ƒ = FudgeCore;

    export class Pingu extends ƒ.Node {
        spritePingu: ƒAid.NodeSprite;
        animation: ƒAid.SpriteSheetAnimation;
        direction: ƒ.Vector3 = ƒ.Vector3.ZERO();
        rigidbody: ƒ.ComponentRigidbody;
        jumpAudio: ƒ.ComponentAudio;
        jumpable: boolean = true;
        coinAudio: ƒ.ComponentAudio;

        constructor() {
            super("Pingu");
            let mesh: ƒ.MeshSprite = new ƒ.MeshSprite();
            let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(mesh);
            let material: ƒ.Material = new ƒ.Material("Pingu", ƒ.ShaderLit, new ƒ.CoatColored());
            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);
            cmpMaterial.clrPrimary = new ƒ.Color(0, 0, 0, 0);
            let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform();
            this.addComponent(cmpMesh);
            this.addComponent(cmpMaterial);
            this.addComponent(cmpTransform);
            this.mtxLocal.translate(new ƒ.Vector3(1, 0, 0));
            this.createSprite();

            //create rigidbody for physics
            this.rigidbody = new ƒ.ComponentRigidbody();
            this.rigidbody.effectRotation = new ƒ.Vector3(0, 0, 0);
            this.rigidbody.friction = 0;
            this.rigidbody.effectGravity = 10;
            this.rigidbody.setVelocity(new ƒ.Vector3(0, 0, 0));
            this.addComponent(this.rigidbody);
            this.jumpAudio = graph.getChildrenByName("Sound")[0].getChildrenByName("Jump")[0].getComponents(ƒ.ComponentAudio)[0];
            this.coinAudio = graph.getChildrenByName("Sound")[0].getChildrenByName("Coin")[0].getComponents(ƒ.ComponentAudio)[0];
        }

        async createSprite(): Promise<void> {
            let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
            await imgSpriteSheet.load("Images/PinguSprite.png");
            let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);

            this.animation = new ƒAid.SpriteSheetAnimation("Pingu", coat);
            this.animation.generateByGrid(ƒ.Rectangle.GET(0, 0, 32, 32), 4, 32, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(32));

            this.spritePingu = new ƒAid.NodeSprite("Sprite");
            this.spritePingu.setAnimation(this.animation);
            this.spritePingu.setFrameDirection(1);
            this.spritePingu.framerate = 5;

            let cmpTransfrom: ƒ.ComponentTransform = new ƒ.ComponentTransform();
            this.spritePingu.addComponent(cmpTransfrom);

            this.addChild(this.spritePingu);
        } //createSprite

        public walk(): void {
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])) {
                this.direction.set(5, 0, 0);
                this.spritePingu.mtxLocal.reset();
            }
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])) {
                this.direction.set(-5, 0, 0);
                this.spritePingu.mtxLocal.reset();
                this.spritePingu.mtxLocal.rotateY(180);
            }
            if (!ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]) && !ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])) {
                this.direction.set(0, 0, 0);
            }
            //this.mtxLocal.translate(ƒ.Vector3.SCALE(this.direction, 1 / 60));
            this.rigidbody.setVelocity(this.direction);
            moveCamera(this.direction);
        } //walk

        public jump(): void {
            /* if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
                this.jumpAudio.play(true);
                if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
                    this.direction.set(-1, 1, 0);
                else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]))
                    this.direction.set(1, 1, 0);
                else
                    this.direction.set(0, 1, 0);
            }
            this.mtxLocal.translate(ƒ.Vector3.SCALE(this.direction, 1 / 60)); */

            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && this.jumpable == true) {
                this.jumpAudio.play(true);
                this.jumpable = false;
                if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]))
                    this.rigidbody.applyLinearImpulse(new ƒ.Vector3(-80, 160, 0));
                else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
                    this.rigidbody.applyLinearImpulse(new ƒ.Vector3(80, 160, 0));
                else
                    this.rigidbody.applyLinearImpulse(new ƒ.Vector3(0, 160, 0));

                setTimeout(() => {
                    this.jumpable = true;
                },         2000);
            } //jump
        }

        public checkPosition(): void {
            if (this.mtxLocal.translation.y < -2) {
                this.dispatchEvent(new CustomEvent("checkGameEnd", { bubbles: true, detail: "loose" }));
            }
            if (this.mtxLocal.translation.x >= 109.5 && gameState.stars >= 3) {
                this.dispatchEvent(new CustomEvent("checkGameEnd", { bubbles: true, detail: "win" }));
            }
        } //checkPosition

        public hitCoin(): void {
            if (this.mtxLocal.translation.y > 1.5) {
                for (let i: number = 0; i < coins.length; i++) {
                    if ((coins[i].mtxLocal.translation.x - 0.5) < this.mtxLocal.translation.x && this.mtxLocal.translation.x < (coins[i].mtxLocal.translation.x + 0.5)) {
                        let coin: ƒ.Node = coins[i];
                        gameState.coins += 1;
                        collectables.removeChild(coin);
                        coins.splice(coins.indexOf(coin), 1);
                        this.coinAudio.play(true);
                    }
                }
            }
        } //hitCoin
    }
}
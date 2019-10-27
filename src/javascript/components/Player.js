class Player {
    constructor(canvas) {
        this._canvas = canvas;

        this._spriteProperties = {
            x: 270,
            width: 170,
            translate: 70
        }

        this.setup()
    }

    setup() {
        this._spriteContainer = new PIXI.Container();
        this._loadAssets()
    }

    _loadAssets() {
        this._textureLoader = new PIXI.loaders.Loader();

        this._textureLoader.add('sprite1', '../assets/sprite_01.png');
        this._textureLoader.add('sprite2', '../assets/sprite_02.png');
        // this._textureLoader.onProgress.add(this._loaderProgressHandler);
        this._textureLoader.load(() => { this.createAnimatedSprite() });
    }

    createAnimatedSprite() {
        this.animatedTextures = [
            this._textureLoader.resources['sprite1'].texture,
            this._textureLoader.resources['sprite2'].texture,
        ]

        this._animatedSprite = new PIXI.extras.AnimatedSprite(this.animatedTextures);
        let ratio = this._animatedSprite.width / this._animatedSprite.height;

        this._animatedSprite.animationSpeed = .10;
        this._animatedSprite.play();
        this._spriteContainer.addChild(this._animatedSprite);

        this._animatedSprite.width = this._spriteProperties.width
        this._animatedSprite.height = this._spriteProperties.width / ratio

        this._animatedSprite.position.x = this._spriteProperties.x;
        this._animatedSprite.position.y = this._canvas.height - this._animatedSprite.height - this._spriteProperties.translate;
    }
    drawPlayer() {
        return this._spriteContainer
    }
}
export default Player;
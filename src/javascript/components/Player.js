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

        for (let i = 0; i <= 25; i++) {
            this._textureLoader.add(`frame${i}`, `../assets/sprites/jump/jump_0${i}.png`);
        }
        for (let i = 0; i <= 31; i++) {
            this._textureLoader.add(`frame${26 + i}`, `../assets/sprites/pedale/pedale_0${i}.png`);
        }
        // this._textureLoader.onProgress.add(this._loaderProgressHandler);
        this._textureLoader.load(() => { this.createAnimatedSprite() });
    }

    createAnimatedSprite() {
        let animatedTextures = []
        for (let i = 0; i <= 25 + 31; i++) {
            animatedTextures.push(this._textureLoader.resources[`frame${i}`].texture);
        }

        this._animatedSprite = new PIXI.extras.AnimatedSprite(animatedTextures);
        let ratio = this._animatedSprite.width / this._animatedSprite.height;

        this._animatedSprite.animationSpeed = .3;
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
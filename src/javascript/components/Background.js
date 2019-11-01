class Background {
    constructor(canvas, resources) {
        this._canvas = canvas
        this._resources = resources
        this._wallProperties = {
            x: this._canvas.width - 300,
            y: 50,
            height: 450,
            width: 350,
            speed: 7
        }
        this.setup()

    }
    setup() {
        this._obstaclesContainer = new PIXI.Container();
        // this._loadAssets()
    }

    _loadAssets() {
        this._textureLoader = new PIXI.loaders.Loader();

        this._textureLoader.add();
        this._textureLoader.load(() => { this._createAnimatedBackground() });
    }

    _createAnimatedBackground() {
        let texture = this._textureLoader.resources[`wall_01`].texture;

        this._animatedObstacle = new PIXI.Sprite(texture)
        this._animatedObstacle.width = this._wallProperties.width
        this._animatedObstacle.height = this._wallProperties.height

        this._animatedObstacle.position.x = this._wallProperties.x - this._wallProperties.width
        this._animatedObstacle.position.y = this._wallProperties.y

        this._obstaclesContainer.addChild(this._animatedObstacle);
    }
    updateBackgroundPosition() {
    }
    drawBackground() {
        return this._obstaclesContainer;
    }
}
export default Background;
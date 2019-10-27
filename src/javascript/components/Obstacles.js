class Obstacles {
    constructor(canvas) {
        this._canvas = canvas
        this._obstacleProperties = {
            x: this._canvas.width,
            y: 0,
            height: 100,
            width: 100,
            speed: 7
        }
        this.setup()

    }
    setup() {
        this._obstaclesContainer = new PIXI.Container();
        this._loadAssets()
    }

    _loadAssets() {
        this._textureLoader = new PIXI.loaders.Loader();

        this._textureLoader.add('obstacle_01', '../assets/sprites/obstacles/obstacle_01.png');
        this._textureLoader.load(() => { this._createAnimatedObstacles() });
    }

    _createAnimatedObstacles() {
        let texture = this._textureLoader.resources[`obstacle_01`].texture;

        this._animatedObstacle = new PIXI.Sprite(texture)
        this._animatedObstacle.width = this._obstacleProperties.width
        this._animatedObstacle.height = this._obstacleProperties.height

        this._animatedObstacle.position.x = this._obstacleProperties.x - this._obstacleProperties.width
        this._animatedObstacle.position.y = this._obstacleProperties.y

        this._obstaclesContainer.addChild(this._animatedObstacle);
    }
    updateObstaclesPosition() {
        if (this._animatedObstacle) {
            this._animatedObstacle.position.x += this._obstacleProperties.speed * -1;
            if (this._animatedObstacle.position.x < 0 - this._obstacleProperties.width) {
                this._animatedObstacle.position.x = this._canvas.width * Math.random() * 3;
                this._animatedObstacle.position.y = Math.round(Math.random()) * 200
            }
        }
    }
    getBounds() {
        return this._obstaclesContainer.getBounds()
    }
    drawObstacles() {
        return this._obstaclesContainer;
    }
}
export default Obstacles;
class Obstacles {
    constructor(canvas, resources) {
        this._canvas = canvas;
        this._resources = resources;

        this._obstacleProperties = {
            x: this._canvas.width,
            y: 0,
            width: 350,
            degree: (Math.PI * 30.75 / 180)
        }

        this._velocity = {};

        this.setup();
    }
    setup() {
        this._obstaclesContainer = new PIXI.Container();
        this._obstaclesContainer.transform.skew.x = - this._obstacleProperties.degree / 1.45;

        this._createAnimatedObstacles();
    }

    _createAnimatedObstacles() {
        this._textures = [];
        for (let i in this._resources.textures) {
            this._textures.push(this._resources.textures[i]);
        }

        this._animatedObstacle = new PIXI.extras.AnimatedSprite(this._textures);
        this._animatedObstacle.gotoAndStop(Math.round(Math.random() * this._textures.length));

        let ratio = this._animatedObstacle.width / this._animatedObstacle.height;

        this._animatedObstacle.width = this._obstacleProperties.width;
        this._animatedObstacle.height = this._obstacleProperties.width / ratio;

        this._animatedObstacle.position.x = this._obstacleProperties.x;
        this._animatedObstacle.position.y = this._obstacleProperties.y;

        this._animatedObstacle.rotation = this._obstacleProperties.degree;

        this._obstaclesContainer.addChild(this._animatedObstacle);
    }

    updateObstaclesPosition(speed, deltaTime) {
        if (this._animatedObstacle) {
            this._animatedObstacle.position.x += -1 * speed * deltaTime;
            if (this._animatedObstacle.position.x < 0) {
                this._animatedObstacle.gotoAndStop(Math.round(Math.random() * this._textures.length));
                this._animatedObstacle.transform.position.x = this._obstacleProperties.x
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
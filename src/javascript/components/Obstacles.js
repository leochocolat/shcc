class Obstacles {
    constructor(canvas, resources) {
        this._canvas = canvas;
        this._resources = resources;

        this._obstacleProperties = {
            x: this._canvas.width * 2,
            y: 10,
            height: 130,
            width: 250,
            degree: (Math.PI * 30.75 / 180)
        }

        this.setup();
    }

    setup() {
        this._obstaclesContainer = new PIXI.Container();
        this._obstaclesContainer.transform.skew.x = - this._obstacleProperties.degree / 1.45;

        this.x = 10 * Math.cos(11 * Math.PI / 180);
        this.y = 10 * Math.sin(11 * Math.PI / 180);

        this._createAnimatedObstacles();
        this._createFakeObstacle();
    }

    _createAnimatedObstacles() {
        this._textures = [];
        for (let i in this._resources.textures) {
            this._textures.push(this._resources.textures[i]);
        }

        this._animatedObstacle = new PIXI.extras.AnimatedSprite(this._textures);
        console.log(this._animatedObstacle.getBounds)
        this._animatedObstacle.gotoAndStop(Math.round(Math.random() * this._textures.length));

        let ratio = this._animatedObstacle.width / this._animatedObstacle.height;
        console.log(ratio)
        this._obstacleProperties.width = this._obstacleProperties.height * ratio;

        this._animatedObstacle.width = this._obstacleProperties.width;
        this._animatedObstacle.height = this._obstacleProperties.height;

        this._animatedObstacle.position.x = this._obstacleProperties.x;
        this._animatedObstacle.position.y = this._obstacleProperties.y;

        this._animatedObstacle.rotation = this._obstacleProperties.degree;

        this._obstaclesContainer.addChild(this._animatedObstacle);
    }

    updateObstaclesPosition(speed, deltaTime) {
        if (this._animatedObstacle && this.obstacleRect) {
            this._animatedObstacle.position.x += -1 * speed * deltaTime;
            this.obstacleRect.position.x = this._animatedObstacle.position.x
            this.obstacleRect.position.y = this._animatedObstacle.position.y
            if (this._animatedObstacle.position.x < 0) {
                this._animatedObstacle.gotoAndStop(Math.round(Math.random() * this._textures.length));
                this._animatedObstacle.transform.position.x = this._canvas.width + Math.random() * this._canvas.width / 2;
                this._animatedObstacle.transform.position.y = this._obstacleProperties.y + 150 * (Math.round(Math.random() * 1));
            }
        }
    }

    _createFakeObstacle() {
        this.obstacleRect = new PIXI.Graphics();
        // this.obstacleRect.alpha = 0
        this.obstacleRect.drawRect(0, 0, this._animatedObstacle.width, this._animatedObstacle.height);
    }

    drawFakeObstacle() {
        return this.obstacleRect;
    }

    getFakeObstacle() {
        return this.obstacleRect;
    }

    getFakeObstacleBounds() {
        return this.obstacleRect.getBounds()
    }

    drawObstacles() {
        return this._obstaclesContainer;
    }
}
export default Obstacles;
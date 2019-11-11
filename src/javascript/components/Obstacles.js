class Obstacles {
    constructor(canvas, resources) {
        this._canvas = canvas;
        this._resources = resources;

        this._obstacleProperties = {
            x: this._canvas.width,
            y: (350/2) / 2,
            height: 180,
            degree: Math.PI * 30.75 / 180
        }

        this.setup();
    }

    setup() {
        this._obstaclesContainer = new PIXI.Container();
        this._obstaclesContainer.transform.skew.x = - this._obstacleProperties.degree / 1.45;

        this._createAnimatedObstacles();
        this._createFakeObstacle();
    }

    _createAnimatedObstacles() {
        this._textures = [];
        this._sprites = [];

        for (let i in this._resources.textures) {
            this._textures.push(this._resources.textures[i]);
            let sprite = new PIXI.Sprite.from(this._resources.textures[i]);

            let ratio = sprite.width / sprite.height;
            sprite.height = this._obstacleProperties.height;
            sprite.width = this._obstacleProperties.height * ratio;

            sprite.position.x = this._obstacleProperties.x;
            sprite.position.y = this._obstacleProperties.y;

            sprite.anchor.set(0.5);
            sprite.rotation = this._obstacleProperties.degree;

            this._sprites.push(sprite)
            // this._obstaclesContainer.addChild(sprite);
        }

        this._obstaclesContainer.addChild(this._randomSprite(this._sprites));

        this._allowUpdate = true;

        // this._oldAnimatedObstacles();
    }

    updateObstaclesPosition(speed, deltaTime) {
        if (!this._allowUpdate) return;

        this._obstaclesContainer.children[0].position.x += -1 * speed * deltaTime;
        this.obstacleRect.position.x = this._obstaclesContainer.children[0].position.x
        this.obstacleRect.position.y = this._obstaclesContainer.children[0].position.y

        if (this._obstaclesContainer.children[0].position.x < 0) {
            this._obstaclesContainer.removeChildAt(0);
            this._obstaclesContainer.addChild(this._randomSprite(this._sprites));
            this._obstaclesContainer.children[0].position.x = this._canvas.width * 1.5 + Math.random() * this._canvas.width / 2;
            this._obstaclesContainer.children[0].position.y = this._obstacleProperties.y + (this._obstacleProperties.y * 2) * Math.round(Math.random());
            this._updateFakeObstacle();
        }
    }

    _oldAnimatedObstacles() {
        this._animatedObstacle = new PIXI.extras.AnimatedSprite(this._textures);
        this._animatedObstacle.gotoAndStop(3);

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

    _updateOldObstacles() {
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

    _randomSprite(sprites) {
        let randomIndex = Math.ceil(Math.random() * sprites.length - 1);
        let sprite = sprites[randomIndex];

        return sprite
    }

    _createFakeObstacle() {
        this.obstacleRect = new PIXI.Graphics();
        this.obstacleRect.alpha = 0
        this.obstacleRect.drawRect(0, 0, this._obstaclesContainer.children[0].width, this._obstaclesContainer.children[0].height);
    }

    _updateFakeObstacle() {
        this.obstacleRect.width = this._obstaclesContainer.children[0].width;
        this.obstacleRect.height = this._obstaclesContainer.children[0].height;
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
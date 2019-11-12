class Obstacles {
    constructor(canvas, resources) {
        this._canvas = canvas;
        this._resources = resources;

        this._obstacleProperties = {
            x: this._canvas.width,
            y: (350 / 2) / 2,
            height: 180,
            degree: Math.PI * 30.75 / 180,
            sizes: [
                80,
                180,
                70,
                150,
                150,
                70
            ],
            obstacleSizes: [
                { width: 0, height: 0 },
                { width: 0, height: 0 },
                { width: 0, height: 0 },
                { width: 0, height: 0 },
            ]
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

        let index = -1;
        for (let i in this._resources.textures) {
            index++

            this._textures.push(this._resources.textures[i]);
            let sprite = new PIXI.Sprite.from(this._resources.textures[i]);

            let ratio = sprite.width / sprite.height;

            sprite.height = this._obstacleProperties.sizes[index];
            sprite.width = this._obstacleProperties.sizes[index] * ratio;

            sprite.position.x = this._obstacleProperties.x;
            sprite.position.y = this._obstacleProperties.y;

            sprite.anchor.set(0.5);
            sprite.rotation = this._obstacleProperties.degree;

            this._sprites.push(sprite)
        }

        this._spriteTest = 5;

        // this._obstaclesContainer.addChild(this._sprites[this._spriteTest]);
        this._obstaclesContainer.addChild(this._randomSprite(this._sprites));

        this._allowUpdate = true;
    }

    updateObstaclesPosition(speed, deltaTime) {
        if (!this._allowUpdate) return;

        this._obstaclesContainer.children[0].position.x += -1 * speed * deltaTime;
        this.obstacleRect.position.x = this._obstaclesContainer.children[0].position.x
        this.obstacleRect.position.y = this._obstaclesContainer.children[0].position.y

        if (this._obstaclesContainer.children[0].position.x < 0) {
            this._obstaclesContainer.removeChildAt(0);
            // this._obstaclesContainer.addChild(this._sprites[this._spriteTest]);
            this._obstaclesContainer.addChild(this._randomSprite(this._sprites));
            this._obstaclesContainer.children[0].position.x = this._canvas.width * 1.5 + Math.random() * this._canvas.width / 2;
            this._obstaclesContainer.children[0].position.y = this._obstacleProperties.y + (this._obstacleProperties.y * 2) * Math.round(Math.random());
            this._updateFakeObstacle();
        }
    }

    _randomSprite(sprites) {
        let randomIndex = Math.ceil(Math.random() * sprites.length - 1);
        let sprite = sprites[randomIndex];

        return sprite
    }

    _createFakeObstacle() {
        this.obstacleRect = new PIXI.Graphics();
        this.obstacleRect.alpha = 1
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
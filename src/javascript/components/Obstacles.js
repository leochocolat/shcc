import { TweenLite } from "gsap";

class Obstacles {
    constructor(canvas, resources) {
        this._canvas = canvas;
        this._resources = resources;

        this._obstacleProperties = {
            x: this._canvas.width + this._canvas.width/2,
            y: (350 / 2) / 2,
            height: 180,
            degree: Math.PI * 30.75 / 180,
            sizes: [
                80,
                320,
                70,
                150,
                150,
                70
            ],
            obstacleSizes: [
                { width: 30, height: 350/4 },
                { width: 500, height: 350/3.5 },
                { width: 120, height: 350/3 },
                { width: 120, height: 350/3 },
                { width: 120, height: 350/3 },
                { width: 120, height: 350/2 },
                { width: 120, height: 350/2 },
                { width: 50, height: 110 }
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

    start() {
        this._allowUpdate = true;
        
        TweenLite.to(this._sprites[0], .5, { alpha: 1 });
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

            sprite.alpha = 0;

            this._sprites.push(sprite);
        }

        this._spriteTest = 0;
        this._currentSpriteIndex = this._spriteTest;
        this._obstaclesContainer.addChild(this._sprites[this._spriteTest]);
    }

    updateObstaclesPosition(speed, deltaTime) {
        if (!this._allowUpdate) return;

        this._obstaclesContainer.children[0].position.x += -1 * speed * deltaTime;

        this.obstacleRect.position.x = this._obstaclesContainer.children[0].position.x;
        this.obstacleRect.position.y = this._obstaclesContainer.children[0].position.y;

        if (this._obstaclesContainer.children[0].position.y === this._obstacleProperties.y + (this._obstacleProperties.y * 2)) {
            this.obstacleRect.position.x = this._obstaclesContainer.children[0].position.x - 180;
        }

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
        this._currentSpriteIndex = randomIndex;

        return sprite;
    }

    _createFakeObstacle() {
        this.obstacleRect = new PIXI.Graphics();
        this.obstacleRect.alpha = 0;
        this.obstacleRect.drawRect(0, 0, this._obstacleProperties.obstacleSizes[this._currentSpriteIndex].width, this._obstacleProperties.obstacleSizes[this._currentSpriteIndex].height);
        this.obstacleRect.position.x = this._obstaclesContainer.children[0].position.x;
        this.obstacleRect.position.y = this._obstaclesContainer.children[0].position.y;
        this.obstacleRect.pivot.x = this.obstacleRect.width / 2;
        this.obstacleRect.pivot.y = this.obstacleRect.height / 2;
    }

    _updateFakeObstacle() {
        this.obstacleRect.width = this._obstacleProperties.obstacleSizes[this._currentSpriteIndex].width;
        this.obstacleRect.height = this._obstacleProperties.obstacleSizes[this._currentSpriteIndex].height;
        this.obstacleRect.position.x = this._obstaclesContainer.children[0].position.x;
        this.obstacleRect.position.y = this._obstaclesContainer.children[0].position.y;
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
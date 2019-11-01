import { Z_ASCII } from "zlib";

class Background {

    constructor(canvas, resources) {
        this._canvas = canvas;
        this._resources = resources;

        this._wallProperties = {
            x: 0,
            y: this._canvas.height - 200,
            height: 850,
            speed: 7
        }

        this.velocity = {};
        this.velocity.x = this._wallProperties.speed * Math.cos(Math.PI * 30.75 / 180);
        this.velocity.y = this._wallProperties.speed * Math.sin(Math.PI * 30.75 / 180);

        this.setup();
    }

    setup() {
        this._obstaclesContainer = new PIXI.Container();
        this._createAnimatedBackground();
    }

    _createAnimatedBackground() {
        this._textures = [];
        for (let i in this._resources.textures) {
            this._textures.push(this._resources.textures[i]);
        }
        
        this._animatedObstacle = new PIXI.extras.AnimatedSprite(this._textures);
        this._animatedObstacle.gotoAndStop(Math.round(Math.random() * this._textures.length));

        let ratio = this._animatedObstacle.width / this._animatedObstacle.height;
        this._wallProperties.width = this._wallProperties.height * ratio;

        this._animatedObstacle.width = this._wallProperties.width;
        this._animatedObstacle.height = this._wallProperties.height;

        this._animatedObstacle.position.x = this._wallProperties.x;
        this._animatedObstacle.position.y = this._wallProperties.y - this._wallProperties.height/2;
        
        this._obstaclesContainer.addChild(this._animatedObstacle);
    }
    
    updateBackgroundPosition() {
        this._animatedObstacle.transform.position.x += - this.velocity.x
        this._animatedObstacle.transform.position.y += this.velocity.y;

        if (this._animatedObstacle.position.x + this._wallProperties.width < 0) {
            this._animatedObstacle.position.x = this._wallProperties.x;
            this._animatedObstacle.position.y = this._wallProperties.y - this._wallProperties.height/2;
            this._animatedObstacle.gotoAndStop(Math.round(Math.random() * this._textures.length));
        }
    }

    drawBackground() {
        return this._obstaclesContainer;
    }
}
export default Background;
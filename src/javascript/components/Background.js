import { Z_ASCII } from "zlib";

class Background {

    constructor(canvas, resources) {
        this._canvas = canvas
        this._resources = resources
        this._wallProperties = {
            x: this._canvas.width + 500,
            y: -500,
            height: 450,
            width: 350,
            speed: { x: 6, y: 6 / 1.66 }
        }

        // todo find perfect angle 
        // this.x +=   this.speed * Math.cos(angle * Math.PI / 180);
        // this.y -=   this.speed * Math.sin(angle * Math.PI / 180);

        this.setup()
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
        this._animatedObstacle.width = this._wallProperties.width;
        this._animatedObstacle.height = this._wallProperties.height;

        this._animatedObstacle.position.x = this._wallProperties.x;
        this._animatedObstacle.position.y = this._wallProperties.y;
        
        this._obstaclesContainer.addChild(this._animatedObstacle);
    }
    
    updateBackgroundPosition() {
        this._animatedObstacle.transform.position.x += - this._wallProperties.speed.x;
        this._animatedObstacle.transform.position.y += this._wallProperties.speed.y;

        if (this._animatedObstacle.position.x + this._wallProperties.width < 0) {
            this._animatedObstacle.position.x = this._wallProperties.x;
            this._animatedObstacle.position.y = this._wallProperties.y;
            this._animatedObstacle.gotoAndStop(Math.round(Math.random() * this._textures.length));
        }
    }

    drawBackground() {
        return this._obstaclesContainer;
    }
}
export default Background;
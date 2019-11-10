class GameManager {
    constructor(stage, player, obstacle, timer) {
        this._stage = stage
        this._player = player;
        this._obstacle = obstacle;
        this._timer = timer;
        this._allowHit = false;
        this.gameSpeed = 0.8;
        setTimeout(() => {
            this._allowHit = true;
        }, 5000);
        this.message = new PIXI.Text("You Lose!");
        this.message.position.set(window.innerWidth / 2, window.innerHeight / 2);
        this.message.anchor.set(.5, .5);
        this.message.alpha = 1;
        this.message.scale.set(1.5, 1.5);

    }
    tick() {
        let playerBounds = this._player.getFakePlayerBounds(),
            obstacleBounds = this._obstacle.getFakeObstacleBounds(),
            isJumping = this._player.isPlayerJumping();
        this.levelDifficulty();
        if (playerBounds.x + playerBounds.width > obstacleBounds.x && playerBounds.x < obstacleBounds.x + obstacleBounds.width && playerBounds.y + playerBounds.height > obstacleBounds.y && playerBounds.y < obstacleBounds.y + obstacleBounds.height && this._allowHit && !isJumping) {
            this._hitText();
        }
    }
    levelDifficulty() {
        if (this._timer.seconds > 8.00 && this.gameSpeed == 0.8) {
            this.gameSpeed = 1
        } else if (this._timer.seconds > 15.00 && this.gameSpeed == 1) {
            this.gameSpeed = 1.3
        } else if (this._timer.seconds > 20.00 && this.gameSpeed == 1.3) {
            this.gameSpeed = 1.5
        } else if (this._timer.seconds > 30.00 && this.gameSpeed == 1.5) {
            this.gameSpeed = 1.7
        }
        return this.levelValue;
    }
    _hitText() {
        this._stage.addChild(this.message);
        setTimeout(() => {
            this._stage.removeChild(this.message);
        }, 300);
    }
}
export default GameManager
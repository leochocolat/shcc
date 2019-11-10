class GameManager {
    constructor(stage, player, obstacle) {
        this._stage = stage
        this._player = player;
        this._obstacle = obstacle;
        this._allowHit = false;
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
        let playerBounds = this._player.getBounds(),
            obstacleBounds = this._obstacle.getBounds();
        if (playerBounds.x + playerBounds.width > obstacleBounds.x && playerBounds.x < obstacleBounds.x + obstacleBounds.width && playerBounds.y + playerBounds.height > obstacleBounds.y && playerBounds.y < obstacleBounds.y + obstacleBounds.height && this._allowHit) {
            this._hitText();
        }
    }

    _hitText() {
        this._stage.addChild(this.message);
        setTimeout(() => {
            this._stage.removeChild(this.message);
        }, 300);
    }
}
export default GameManager
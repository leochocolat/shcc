class GameManager {
    constructor(stage, player, obstacle) {
        this._stage = stage
        this._player = player;
        this._obstacle = obstacle;
        // this._setup()
    }
    _setup() {
        // TESTS
    }
    tick() {
        let playerBounds = this._player.getBounds(),
            obstacleBounds = this._obstacle.getBounds();

        console.log(obstacleBounds.y);

        if (playerBounds.x + playerBounds.width >= obstacleBounds.x && playerBounds.x < obstacleBounds.x + obstacleBounds.width && playerBounds.y + playerBounds.height >= obstacleBounds.y) {
            // this._hitText();
        }
    }
    _hitText() {
        let message = new PIXI.Text("You Lose!");
        message.position.set(window.innerWidth / 2, window.innerHeight / 2);
        message.anchor.set(.5, .5);
        message.alpha = 1;
        message.scale.set(1.5, 1.5);
        this._stage.addChild(message);
    }
}
export default GameManager
class GameManager {
    constructor(stage, player, obstacle, timer) {
        this._stage = stage
        this._player = player
        this._obstacle = obstacle
        this._timer = timer
        this._allowHit = false
        this.isGameFinished = false
        this.gameSpeed = 0.8
        setTimeout(() => {
            this._allowHit = true
        }, 5000)
        this.message = new PIXI.Text("You Lose!")
        this.message.position.set(window.innerWidth / 2, window.innerHeight / 2)
        this.message.anchor.set(.5, .5)
        this.message.alpha = 1
        this.message.scale.set(1.5, 1.5)

    }
    tick() {
        let playerBounds = this._player.getFakePlayerBounds(),
            obstacleBounds = this._obstacle.getFakeObstacleBounds(),
            isJumping = this._player.isPlayerJumping()
        this.levelDifficulty()
        if (playerBounds.x + playerBounds.width > obstacleBounds.x && playerBounds.x < obstacleBounds.x + obstacleBounds.width && playerBounds.y + playerBounds.height > obstacleBounds.y && playerBounds.y < obstacleBounds.y + obstacleBounds.height && this._allowHit && !isJumping) {
            this._hitTest()
        }
    }
    levelDifficulty() {
        if (this._timer.seconds > 10.00 && this.gameSpeed == 0.8) {
            this.gameSpeed = 1
        } else if (this._timer.seconds > 20.00 && this.gameSpeed == 1) {
            this.gameSpeed = 1.2
        } else if (this._timer.seconds > 30.00 && this.gameSpeed == 1.2) {
            this.gameSpeed = 1.4
        } else if (this._timer.seconds > 50.00 && this.gameSpeed == 1.4) {
            this._endGame()
        }
    }
    _hitTest() {
        this.gameSpeed = 0.8
        this._timer.resetTimer()
        this._stage.addChild(this.message)
        setTimeout(() => {
            this._stage.removeChild(this.message)
        }, 300)
    }
    _endGame() {
        this.gameSpeed = 0
        this.isGameFinished = true
    }

}
export default GameManager
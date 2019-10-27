class GameManager {
    constructor(player, obstacle) {
        this._player = player;
        this._obstacle = obstacle;
        this._setup()
    }
    _setup() {
        console.log(this._player, this._obstacle)
    }
}
export default GameManager
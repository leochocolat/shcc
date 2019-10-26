import _ from 'underscore';
import Pixi from './Pixi'
class SelectPlayer {
    constructor() {
        // _.bindAll(this, '_selectPlayer');
        this.container = document.querySelector('.js-container');
        this.firstPlayer = this.container.querySelector('.js-firstPlayer');
        this.secondPlayer = this.container.querySelector('.js-secondPlayer');
        this.clicked = false;
        this._setup()
    }
    _selectPlayer(playerType) {
        if (!this.clicked) {
            this.clicked = true;
            // console.log(Pixi)
            // new Pixi()
        }
    }
    _setup() {
        this._setupEventListeners();
    }
    _setupEventListeners() {
        const playerOne = 'bmx',
            playerTwo = 'skate';
        this.firstPlayer.addEventListener('click', this._selectPlayer.bind(this, playerOne));
        this.secondPlayer.addEventListener('click', this._selectPlayer.bind(this, playerTwo));
    }
}
export default SelectPlayer;
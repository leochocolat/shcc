import _ from 'underscore';
import Pixi from './Pixi'
import { TweenLite, Power3 } from 'gsap';

class SelectPlayer {
    constructor() {
        // _.bindAll(this, '_selectPlayer');
        this.container = document.querySelector('.js-container');
        this.playerContainer = this.container.querySelector('.js-playerContainer');
        this.players = this.container.querySelectorAll('.js-player img');
        this.clicked = false;
        this._setup()
    }
    _selectPlayer(index) {
        if (!this.clicked) {
            this.clicked = true;
            TweenLite.to(this.players[index], 1, { y: -20, ease: Power3.easeOut })
            TweenLite.to(this.playerContainer, 0.5, { autoAlpha: 0, delay: 0.1 })
            // this.playerContainer.classList.add('hidden');
            // new Pixi(index)
        }
    }
    _setup() {
        this._setupEventListeners();
    }
    _setupEventListeners() {
        for (let index = 0; index < this.players.length; index++) {
            this.players[index].addEventListener('click', () => { this._selectPlayer(index) });
        }
    }
}
export default SelectPlayer;
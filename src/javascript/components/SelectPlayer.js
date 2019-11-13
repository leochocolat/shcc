import _ from 'underscore';
import Pixi from './Pixi'
import TextureLoader from '../modules/TextureLoader'
import { TweenLite, Power3 } from 'gsap';

class SelectPlayer {
    constructor() {
        this.container = document.querySelector('.js-container');
        this.playerContainer = this.container.querySelector('.js-playerContainer');
        this.backgroundTransitionContainer = document.querySelector('.js-bgContainer');
        this.players = this.container.querySelectorAll('.js-player');
        this.playerTimerHead = document.querySelector('.js-player-head')
        this.clicked = false;
        this._setup();
    }

    _selectPlayer(index) {
        if (!this.clicked) {
            this.clicked = true;
            new TextureLoader(index);
            this.playerTimerHead.src = `assets/images/player${index + 1}-head-progressBar.png`
            TweenLite.to(this.playerContainer, 0.2, { autoAlpha: 0, delay: 1.2 });
            TweenLite.to(this.backgroundTransitionContainer, 1.5, { right: '300%', top: '50%', delay: 0.9 });
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
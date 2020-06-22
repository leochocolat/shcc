import _ from 'underscore';
import Pixi from './Pixi'
import TextureLoader from '../modules/TextureLoader'
import { TweenLite, TweenMax, Power3 } from 'gsap';

class SelectPlayer {
    constructor() {
        this.container = document.querySelector('.js-container');

        this.clicked = false;

        this._ui = {
            playerContainer: this.container.querySelector('.js-playerContainer'),
            backgroundTransitionContainer: document.querySelector('.js-bgContainer'),
            players: this.container.querySelectorAll('.js-player'),
            playerTimerHead: document.querySelector('.js-player-head')
        }

        this._textureLoader = new TextureLoader();
        this._setup();
    }

    _selectPlayer(index) {
        if (!this.clicked) {
            this.clicked = true;
            this._textureLoader.loadPlayerTexture(index);
            let playerHead = this._ui.players[index].querySelector(".player__head")
            TweenLite.to(playerHead, 0.5, { y: 2 });

            this._ui.playerTimerHead.src = `assets/images/player${index + 1}-head-progressBar.png`
            TweenLite.to(this._ui.playerContainer, 0.2, { autoAlpha: 0, delay: 2 });
            TweenLite.to(this._ui.backgroundTransitionContainer, 1.5, { right: window.innerWidth * 4, top: '50%', delay: 1.5 });
        }
    }

    _setup() {
        this._setupEventListeners();
    }

    _setupEventListeners() {
        for (let index = 0; index < this._ui.players.length; index++) {
            this._ui.players[index].addEventListener('click', () => { this._selectPlayer(index) });
        }

    }
}
export default SelectPlayer;
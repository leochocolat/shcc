import _ from 'underscore';
import TextureLoader from '../modules/TextureLoader'
import { TimelineLite, Power4 } from 'gsap';

class SelectPlayer {
    constructor() {
        this.container = document.querySelector('.js-container');

        this.clicked = false;

        this._ui = {
            playerContainer: this.container.querySelector('.js-playerContainer'),
            backgroundTransitionContainer: document.querySelector('.js-bgContainer'),
            backgroundTransitionRed: document.querySelector('.js-bgContainer-red'),
            backgroundTransitionWhite: document.querySelector('.js-bgContainer-white'),
            players: this.container.querySelectorAll('.js-player'),
            playerTimerHead: document.querySelector('.js-player-head')
        }

        this._textureLoader = new TextureLoader();
        this._setup();
    }

    _setup() {
        this._initStyle();
        this._setupEventListeners();
    }

    _initStyle() {
        let width = window.innerWidth;
        let height = window.innerHeight;
        let hyp = Math.sqrt(width * width + height * height);

        this._ui.backgroundTransitionWhite.style.width = `${hyp}px`;
        this._ui.backgroundTransitionWhite.style.height = `${hyp}px`;
        this._ui.backgroundTransitionRed.style.width = `${hyp}px`;
        this._ui.backgroundTransitionRed.style.height = `${hyp}px`;
    }

    _selectPlayer(index) {
        if (!this.clicked) {
            this.clicked = true;
            this._textureLoader.loadedPlayerTexture(index);
            let playerHead = this._ui.players[index].querySelector(".player__head");
            this._ui.playerTimerHead.src = `assets/images/player${index + 1}-head-progressBar.png`;

            let timeline = new TimelineLite();

            timeline.set(this._ui.playerContainer, { autoAlpha: 0 }, 0.8);
            timeline.set(this._ui.backgroundTransitionContainer, { autoAlpha: 1 }, 0);
            timeline.to(this._ui.backgroundTransitionWhite, 1.6, { x: '-200%', ease: Power4.easeInOut }, 0);
            timeline.to(this._ui.backgroundTransitionRed, 1.6, { x: '-200%', ease: Power4.easeInOut }, 0.1);
        }
    }

    _setupEventListeners() {
        for (let index = 0; index < this._ui.players.length; index++) {
            this._ui.players[index].addEventListener('click', () => { this._selectPlayer(index) });
        }
        window.addEventListener('resize', () => { this._initStyle() });
    }
}
export default SelectPlayer;
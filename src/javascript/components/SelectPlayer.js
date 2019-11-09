import _ from 'underscore';
import Pixi from './Pixi'
import TextureLoader from '../modules/TextureLoader'
import { TweenLite, Power3 } from 'gsap';

class SelectPlayer {
    constructor() {
        this.container = document.querySelector('.js-container');
        this.playerContainer = this.container.querySelector('.js-playerContainer');
        this.players = this.container.querySelectorAll('.js-player img');
        this.clicked = false;
        this._setup();
    }
    _selectPlayer(index) {
        if (!this.clicked) {
            this.clicked = true;
            TweenLite.to(this.playerContainer, 0.5, { autoAlpha: 0, delay: 0.1 });
            console.log(index)
            new TextureLoader(index);
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
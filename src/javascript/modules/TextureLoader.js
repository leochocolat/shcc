import _ from 'underscore';
import Pixi from '../components/Pixi';
import DeviceUtils from '../utils/DeviceUtils';
import SplitText from '../vendors/SplitText';

import { TweenLite, Power3, Power4, TweenMax } from 'gsap';

class TextureLoader {
    constructor(playerIndex) {
        this._playerIndex = playerIndex;

        _.bindAll(this, '_onTextureLoaded');

        this._spritesheetsUrl = [
            'assets/spriteheets/bikeSpritesheet.json',
            'assets/spriteheets/skateSpritesheet.json',
            'assets/spriteheets/buildingSpritesheet.json',
            'assets/spriteheets/obstackesSpritesheets1.json',
            'assets/spriteheets/objectsSpritesheets.json',
            'assets/spriteheets/shadowSpritesheet.json'
        ]

        this._loaderSectionContainer = document.querySelector('.js-loader');
        this._canvas = document.querySelector('.js-canvas');

        this._ui = {
            loaderProgress: this._loaderSectionContainer.querySelector('.js-loader-progress'),
            logoLoader: this._loaderSectionContainer.querySelector('.js-loader-logo'),
            playerText: document.querySelector('.js-player-text'),
            playerTextSpans: document.querySelectorAll('.js-player-text-span'),
            players: document.querySelectorAll('.js-player')
        }

        this._setup();
        this._setupSplitAnimtation();
        this._setupEventListeners();
    }

    _setup() {
        this._progressValue = 0;

        this._textureLoader = new PIXI.loaders.Loader();
        this._textureLoader.add('animationSpritesheetBike', this._spritesheetsUrl[0]);
        this._textureLoader.add('animationSpritesheetSkate', this._spritesheetsUrl[1]);
        this._textureLoader.add('buildingSpritesheet', this._spritesheetsUrl[2]);
        this._textureLoader.add('obstaclesSpritesheet', this._spritesheetsUrl[3]);
        this._textureLoader.add('objectsSpritesheet', this._spritesheetsUrl[4]);
        this._textureLoader.add('shadowSpritesheet', this._spritesheetsUrl[5]);

        this._textureLoader.onProgress.add((loader) => this._updateProgress(loader.progress))

        this._loaderEnterAnimation();
    }

    _setupSplitAnimtation() {
        for (let i = 0; i < this._ui.playerTextSpans.length; i++) {
            const element = this._ui.playerTextSpans[i];
            new SplitText(element, 
                {
                    type: 'chars', 
                    charsClass: `char char--++`,
                }
            )
        }
    }

    _setupEventListeners() {
        this._textureLoader.load(this._onTextureLoaded)
    }

    _onTextureLoaded(e) {
        this._start();
    }

    _updateProgress(progress) {
        this._ui.loaderProgress.innerHTML = progress.toFixed(0);
    }

    _loaderEnterAnimation() {
        TweenLite.to(this._ui.loaderProgress, 1.3, { autoAlpha: 1, y: 0 })
    }

    _loaderOutAnimation() {
        TweenLite.to(this._ui.loaderProgress, 0.8, { autoAlpha: 0, y: "-100%", ease: Power4.easeOut, delay: 1 });
        TweenLite.to(this._loaderSectionContainer, 1, { height: 0, ease: Power4.easeInOut, delay: 1.2 });
        TweenMax.staggerFrom(this._ui.players, 1.3, { y: 50, autoAlpha: 0, ease: Power4.easeOut, delay: 1.6 }, 0.1);

        setTimeout(() => {
            this._ui.playerText.classList.add('transitionIn');
        }, 1800)
    }

    loadedPlayerTexture(index) {
        let spritesheet = this._textureLoader.resources;
        // this._textureLoader.add('animationSpritesheet', this._spritesheetsUrl[index]);
        this._requestFullScreen();
        this.pixiComponent.setupPlayer(index, spritesheet)

    }

    _requestFullScreen() {
        if(DeviceUtils.isMobile()) {
            document.addEventListener('click',() => {
                // this._canvas.requestFullscreen();
                document.body.requestFullscreen();
            })
        }
    }

    _start() {
        let spritesheet = this._textureLoader.resources;
        this.pixiComponent = new Pixi(spritesheet);

        this._loaderOutAnimation();
    }

}

export default TextureLoader; 
import _ from 'underscore';
import Pixi from '../components/Pixi';
import DeviceUtils from '../utils/DeviceUtils';

import { TweenLite, Power3 } from 'gsap';
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
            logoLoader: this._loaderSectionContainer.querySelector('.js-loader-logo')
        }

        this._setup();
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
        // TweenLite.from(this._ui.logoLoader, 1.7, { autoAlpha: 0, delay: 1 })
        TweenLite.to(this._ui.loaderProgress, 1.3, { autoAlpha: 1, y: 0 })

    }

    _loaderOutAnimation() {
        TweenLite.to(this._ui.loaderProgress, 1.3, { autoAlpha: 0, y: "-100%", ease: Power3.easeOut, delay: 1 })
        TweenLite.to(this._loaderSectionContainer, 1, { height: 0, ease: Power3.easeOut, delay: 1.5 })


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
                this._canvas.requestFullscreen();
            })
        }
    }

    _start() {
        let spritesheet = this._textureLoader.resources;


        console.log('ready')
        this.pixiComponent = new Pixi(spritesheet);

        this._loaderOutAnimation();

        // this._textureLoader.destroy();
    }

}

export default TextureLoader; 
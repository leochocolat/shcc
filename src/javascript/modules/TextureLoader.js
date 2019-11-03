import _ from 'underscore';
import Pixi from '../components/Pixi';

class TextureLoader {
    constructor(playerIndex) {
        this._playerIndex = playerIndex;

        _.bindAll(this, '_onTextureLoaded');

        this._spritesheetsUrl = [
            '../assets/spriteheets/bikeSpritesheet.json',
            '../assets/spriteheets/skateSpritesheet.json',
            '../assets/spriteheets/buildingSpritesheet.json',
            '../assets/spriteheets/obstacles.json'
        ]

        this._setup();
        this._setupEventListeners();
    }

    _setup() {
        this._textureLoader = new PIXI.loaders.Loader();
        this._textureLoader.add('animationSpritesheet', this._spritesheetsUrl[this._playerIndex]);
        this._textureLoader.add('buildingSpritesheet', this._spritesheetsUrl[2]);
        this._textureLoader.add('obstaclesSpritesheet', this._spritesheetsUrl[3]);
    }

    _setupEventListeners() {
        this._textureLoader.load(this._onTextureLoaded)
    }

    _onTextureLoaded(e) {
        this._start();
    }

    _start() {
        let spritesheet = this._textureLoader.resources;
        new Pixi(this._playerIndex, spritesheet);
    }

}

export default TextureLoader; 
import _ from 'underscore';
import Pixi from '../components/Pixi';

class TextureLoader {
    constructor(playerIndex) {
        this._playerIndex = playerIndex;

        _.bindAll(this, '_onTextureLoaded');

        this._spritesheetsUrl = [
            '../assets/spriteheets/bikeSpritesheet.json',
            '../assets/spriteheets/skateSpritesheet.json'
        ]

        this._setup();
        this._setupEventListeners();
    }

    _setup() {
        this._textureLoader = new PIXI.loaders.Loader();
        this._textureLoader.add('animationSpritesheet', this._spritesheetsUrl[this._playerIndex]);
    }

    _setupEventListeners() {
        this._textureLoader.load(this._onTextureLoaded)
    }

    _onTextureLoaded(e) {
        this._start();
    }    
    
    _start() {
        let animationSpritesheet = this._textureLoader.resources['animationSpritesheet'];
        new Pixi(this._playerIndex, animationSpritesheet);
    }

}

export default TextureLoader; 
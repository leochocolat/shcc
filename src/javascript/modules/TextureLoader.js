import _ from 'underscore';

class TextureLoader {
    constructor() {
        _.bindAll(this, '_onTextureLoaded');

        this._setup();
        this._setupEventListeners();
    }

    _setup() {
        this._textureLoader = new PIXI.loaders.Loader();
        this._textureLoader.add('animationSpritesheet', '../assets/spriteheets/animations.json');
    }

    _setupEventListeners() {
        this._textureLoader.load(this._onTextureLoaded)
    }

    _onTextureLoaded() {
        this._start();
    }    
    
    _start() {
        let animationSpritesheet = PIXI.loader.resources['animationSpritesheet'];
    }

}

export default TextureLoader; 
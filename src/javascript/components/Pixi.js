import _ from 'underscore';
import { TweenLite } from 'gsap';
import * as PIXI from 'pixi.js'
import Stats from 'stats.js';

class Pixi {
    constructor() {
        _.bindAll(this, '_tickHandler', '_resizeHandler', '_textureLoadedHandler', '_loaderProgressHandler');

        this.el = document.querySelector('.js-canvas');
        this.ui = {};
        this.components = {};

        this._isReady = false;
        this._setup();
    }

    _setup() {
        this._setupStats();
        this._setupPixi();
        this._resize();
        this._setupEventListeners();

        this._setupLayers();
        this._loadAssets();
    }

    _setupStats() {
        this._stats = new Stats();
        this._stats.showPanel(0);
        // document.body.appendChild(this._stats.dom);
    }

    _setupPixi() {
        this._app = new PIXI.Application({
            view: this.el,
            width: window.innerWidth,
            height: window.innerHeight,
            transparent: true,
            antialias: true
        });

        this._canvas = this._app.view;
        this._container = new PIXI.Container();

        this._stage = this._app.stage;
        this._stage.addChild(this._container);
    }

    _resize() {
        this._width = window.innerWidth;
        this._height = window.innerHeight;

        this._canvas.width = this._width;
        this._canvas.height = this._height;
    }

    _setupLayers() {
        this._spriteContainer = new PIXI.Container();
        this._backgroundContainer = new PIXI.Container();
    }

    _loadAssets() {
        this._textureLoader = new PIXI.loaders.Loader();
        this._textureLoader.add('sprite', '../assets/test.jpg');
        this._textureLoader.add('sprite1', '../assets/test1.jpg');
        this._textureLoader.onProgress.add(this._loaderProgressHandler);
        this._textureLoader.load(this._textureLoadedHandler);
    }

    _start() {
        this._createAnimatedSprite();

        this._isReady = true;
    }

    _createAnimatedSprite() {
        let animatedSprites = [
            this._textureLoader.resources['sprite'].texture,
            this._textureLoader.resources['sprite1'].texture,
        ]

        this._animatedSprite = new PIXI.extras.AnimatedSprite(animatedSprites);
        this._animatedSprite.animationSpeed = .10;
        this._animatedSprite.play();

        this._spriteContainer.addChild(this._animatedSprite);
    }

    _removeChilds() {
        this._container.removeChild(this._spriteContainer);
    }

    _addChilds() {
        this._container.addChild(this._spriteContainer);
    }

    _tick() {
        if (!this._isReady) return;

        this._removeChilds();
        this._addChilds();

        this._app.render(this._stage);
    }

    _setupEventListeners() {
        TweenLite.ticker.addEventListener('tick', this._tickHandler);
        window.addEventListener('resize', this._resizeHandler);
    }

    _tickHandler() {
        this._stats.begin();
        this._tick();
        this._stats.end();
    }

    _resizeHandler() {
        this._resize();
    }

    _textureLoadedHandler() {
        this._start();
    }

    _loaderProgressHandler(e) {
        console.log(`loading ${e.progress}%`);
    }
}

export default Pixi;
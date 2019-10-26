import _ from 'underscore';
import { TweenLite } from 'gsap';
import * as PIXI from 'pixi.js'
import Stats from 'stats.js';

class Pixi {
    constructor() {
        _.bindAll(this, '_tickHandler', '_resizeHandler', '_textureLoadedHandler');

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
        this._loadAssets();

        this._setupEventListeners();
    }

    _setupStats() {
        this._stats = new Stats();
        this._stats.showPanel(0);
        document.body.appendChild(this._stats.dom);
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

    _loadAssets() {
        this._textureLoader = new PIXI.loaders.Loader();
        this._textureLoader.add('https://picsum.photos/200/300');

        this._textureLoader.load(this._textureLoadedHandler);
    }

    _start() {
        this._isReady = true;
    }

    _removeChilds() {

    }

    _addChilds() {

    }

    _tick() {
        if (!this._isReady) return;
        this._removeChilds();

        this._addChilds();
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
}

export default Pixi;
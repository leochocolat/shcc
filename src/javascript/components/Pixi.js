import _ from 'underscore';
import { TweenLite } from 'gsap';
import Stats from 'stats.js';

class Pixi {
    constructor() {
        _.bindAll(this, 'tickHandler');

        this.el = document.querySelector('.js-canvas');
        this.ui = {};
        this.components = {};

        this._setup();
    }

    _setup() {
        this._resize();
        this._setupStats();
        this._setupPixi();

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

        console.log(this._canvas);
    }

    _tick() {
        
    }

    _setupEventListeners() {
        TweenLite.ticker.addEventListener('tick', this._tickHandler);
    }

    _tickHandler() {
        this._stats.begin();
        this._tick();
        this._stats.end();
    }


}

export default Pixi;
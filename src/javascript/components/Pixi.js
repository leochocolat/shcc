import _ from 'underscore';
import { TweenLite } from 'gsap';
import * as PIXI from 'pixi.js'
import Stats from 'stats.js';
import * as dat from 'dat.gui';
import Timer from './Timer';
import Player from './Player';
import Road from './Road';
import Obstacles from './Obstacles';
import GameManager from './GameManager'
import Background from './Background';
import TimerBox from './TimerBox';


class Pixi {
    constructor(playerIndex, resources) {
        this._playerIndex = playerIndex;
        this._resources = resources;

        _.bindAll(this, '_tickHandler', '_resizeHandler');


        this.el = document.querySelector('.js-canvas');
        this.ui = {};
        this.components = {};

        this._delta = 0;
        this._isReady = false;

        this._settings = {
            speed: .5,
            allowSkew: true
        }

        this._skewProperties = {
            x: -100,
            y: window.innerHeight + 50,
            degrees: Math.PI * 30.75 / 180
        }

        // const gui = new dat.GUI({ closed: false });
        // gui.add(this._settings, 'speed', 0.1, 100).step(0.1);
        // gui.add(this._settings, 'allowSkew');
        // const roads = gui.addFolder('road');
        // const player = gui.addFolder('player');
        // roads.add(this._roadProperties, 'height', 1, 1000).step(1).onChange(() => { this._createRoad() });
        // roads.add(this._roadProperties, 'linesPadding', 1, 1000).step(1).onChange(() => { this._createRoad() });
        // roads.add(this._roadProperties, 'linesAmount', 1, 1000).step(1).onChange(() => { this._createRoad() });
        // roads.add(this._roadProperties, 'linesWidth', 1, 1000).step(1).onChange(() => { this._createRoad() });
        // roads.add(this._roadProperties, 'linesHeight', 1, 1000).step(1).onChange(() => { this._createRoad() });
        // player.add(this._spriteProperties, 'x', 1, 1000).step(1).onChange(() => { this._createAnimatedSprite() });
        // player.add(this._spriteProperties, 'width', 1, 1000).step(1).onChange(() => { this._createAnimatedSprite() });
        // player.add(this._spriteProperties, 'translate', 1, 1000).step(1).onChange(() => { this._createAnimatedSprite() });

        this._setup();
    }

    _setup() {
        this._dateNow = Date.now()
        this._lastTime = this._dateNow;
        this._deltaTime = 16;

        this._setupStats();
        this._setupPixi();
        this._resize();
        this._setupEventListeners();

        this._setupLayers();
        this._setupSkewContainer();
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
            antialias: true,
            preserveDrawingBuffer: true,
            transparent: false,
            backgroundColor: 0x808080
        });
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        this._canvas = this._app.view;
        this._container = new PIXI.Container();
        this._stage = this._app.stage;
        this._stage.addChild(this._container);
    }

    _setupSkewContainer() {
        this._skewedContainer = new PIXI.Container();

        if (!this._settings.allowSkew) return;
        this._skewedContainer.position.x = 0;
        this._skewedContainer.position.y = 0;

        this._skewedContainer.position.x = this._skewProperties.x;
        this._skewedContainer.position.y = this._skewProperties.y;

        this._skewedContainer.transform.skew.x = this._skewProperties.degrees;
        this._skewedContainer.rotation = - this._skewProperties.degrees;
    }

    _resize() {
        this._width = window.innerWidth;
        this._height = window.innerHeight;

        this._canvas.width = this._width;
        this._canvas.height = this._height;
    }

    _setupLayers() {
        this._spriteContainer = new Player(this._canvas, this._playerIndex, this._resources['animationSpritesheet']);
        this._roadContainer = new Road(this._canvas);
        this._obstaclesContainer = new Obstacles(this._canvas, this._resources['obstaclesSpritesheet']);
        this._backgroundContainer = new Background(this._canvas, this._resources['buildingSpritesheet']);
        this._timerBoxContainer = new TimerBox(this._canvas);
        this._gameManager = new GameManager(this._stage, this._spriteContainer.getPlayer(), this._obstaclesContainer);

        this._start();
    }

    _start() {
        this._createTimer()

        this._isReady = true;
    }

    _createTimer() {
        this._timer = new Timer()
    }

    _updateTimerSeconds() {
        this._timer.getDeltaTime()
    }

    _updateTimerSeconds() {
        this._currentTime = this._timer.getDeltaTime();
    }

    _removeChilds() {
        this._container.removeChild(this._backgroundContainer.drawBackground());

        this._skewedContainer.removeChild(this._roadContainer.drawRoad())
        this._skewedContainer.removeChild(this._timerBoxContainer.drawTimerBox());

        this._container.removeChild(this._skewedContainer);
        this._skewedContainer.removeChild(this._obstaclesContainer.drawObstacles())

        this._container.removeChild(this._timer.drawTimer());

        this._container.removeChild(this._spriteContainer.drawPlayer());
    }

    _addChilds() {
        this._container.addChild(this._backgroundContainer.drawBackground());

        this._skewedContainer.addChild(this._roadContainer.drawRoad());
        this._skewedContainer.addChild(this._timerBoxContainer.drawTimerBox());

        this._container.addChild(this._skewedContainer);
        this._skewedContainer.addChild(this._obstaclesContainer.drawObstacles());

        this._container.addChild(this._timer.drawTimer());

        this._container.addChild(this._spriteContainer.drawPlayer());
    }

    _tick() {
        if (!this._isReady) return;
        this._updateDeltaTime();

        this._delta += 1 * this._settings.speed * this.deltaTime;

        this._removeChilds();
        this._addChilds();

        this._roadContainer.updateRoadLinesPosition(this._settings.speed, this._deltaTime);
        this._obstaclesContainer.updateObstaclesPosition(this._settings.speed, this._deltaTime);
        this._backgroundContainer.updateBackgroundPosition(this._settings.speed, this._deltaTime);

        // this._spriteContainer.tick('TODO: DeltaTime');
        this._gameManager.tick();
        this._updateTimerSeconds();

        this._app.render(this._stage);
    }

    _updateDeltaTime() {
        this._dateNow = Date.now();
        this._deltaTime = this._dateNow - this._lastTime;
        this._lastTime = this._dateNow;
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
}

export default Pixi;
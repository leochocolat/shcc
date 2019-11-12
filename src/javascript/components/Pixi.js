import _ from 'underscore';
import { TweenLite } from 'gsap';
import * as PIXI from 'pixi.js'
import Stats from 'stats.js';
import * as dat from 'dat.gui';
import Player from './Player';
import Road from './Road';
import Obstacles from './Obstacles';
import GameManager from './GameManager'
import Buildings from './Buildings';
import Objects from './Objects';

class Pixi {
    constructor(playerIndex, resources) {
        this._playerIndex = playerIndex;
        this._resources = resources;

        _.bindAll(this, '_tickHandler', '_resizeHandler');


        this.el = document.querySelector('.js-canvas');
        this.ui = {};
        this.components = {};
        this._deltaTime = 0;

        this._isReady = false;

        this._settings = {
            allowSkew: true
        }

        this._skewProperties = {
            x: -100,
            y: window.innerHeight + 50,
            degrees: Math.PI * 30.75 / 180
        }

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
            backgroundColor: 0x808080,
        });

        // PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        PIXI.settings.SORTABLE_CHILDREN;

        this._canvas = this._app.view;
        this._container = new PIXI.Container();
        this._stage = this._app.stage;
        this._stage.addChild(this._container);
    }

    _setupSkewContainer() {
        this._skewedContainer = new PIXI.Container();

        if (!this._settings.allowSkew) return;

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
        this._spriteContainer = new Player(this._canvas, this._playerIndex, this._resources['animationSpritesheet'], this._resources['shadowSpritesheet']);
        this._roadContainer = new Road(this._canvas);
        this._obstaclesContainer = new Obstacles(this._canvas, this._resources['obstaclesSpritesheet']);
        this._buildingsContainer = new Buildings(this._canvas, this._resources['buildingSpritesheet']);
        this._objectsContainer = new Objects(this._canvas, this._resources['objectsSpritesheet']);
        this._gameManager = new GameManager(this._stage, this._spriteContainer, this._obstaclesContainer, this._deltaTime);

        this._start();
    }

    _start() {
        this._isReady = true;
    }

    _removeChilds() {
        this._skewedContainer.removeChild(this._buildingsContainer.drawBuildings());
        this._skewedContainer.removeChild(this._objectsContainer.drawObjects());

        this._skewedContainer.removeChild(this._roadContainer.drawRoad())

        this._container.removeChild(this._skewedContainer);
        this._skewedContainer.removeChild(this._obstaclesContainer.drawObstacles())


        this._container.removeChild(this._spriteContainer.getRealPlayer());
        this._container.removeChild(this._spriteContainer.getFakePlayer());
        this._container.removeChild(this._obstaclesContainer.drawFakeObstacle());
    }

    _addChilds() {
        this._skewedContainer.addChild(this._buildingsContainer.drawBuildings());
        this._skewedContainer.addChild(this._objectsContainer.drawObjects());

        this._skewedContainer.addChild(this._roadContainer.drawRoad());

        this._container.addChild(this._skewedContainer);
        this._skewedContainer.addChild(this._obstaclesContainer.drawObstacles());

        this._container.addChild(this._spriteContainer.getRealPlayer());
        this._container.addChild(this._spriteContainer.getFakePlayer());
        this._container.addChild(this._obstaclesContainer.drawFakeObstacle());

    }

    _tick() {
        if (!this._isReady) return;

        if (!this._gameManager.isGameFinished) {
            this._updateDeltaTime();
            this._removeChilds();
            this._addChilds();
            this._roadContainer.updateRoadLinesPosition(this._gameManager.gameSpeed, this._deltaTime);
            this._obstaclesContainer.updateObstaclesPosition(this._gameManager.gameSpeed, this._deltaTime);
            this._buildingsContainer.updateBuildingsPosition(this._gameManager.gameSpeed, this._deltaTime);
            // this._spriteContainer.updatePositionFakePlayer(this._gameManager.gameSpeed, this._deltaTime)
            this._objectsContainer.updateObjectsPosition(this._gameManager.gameSpeed, this._deltaTime);

            this._spriteContainer.isPlayerJumping();
            this._gameManager.tick();

            this._reloadPage();
        }

        if (this._gameManager.isGameFinished) {
            this._spriteContainer._stopAnimations()
        }

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
    _reloadPage() {
        if (this._deltaTime > 1500) {
            window.location.reload()
        }
    }
}

export default Pixi;
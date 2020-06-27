import _ from 'underscore';
import * as PIXI from 'pixi.js'
import { TweenLite } from 'gsap';
import Stats from 'stats.js';
import * as dat from 'dat.gui';

import SizeUtils from '../utils/SizeUtils';

import Player from './Player';
import Road from './Road';
import Obstacles from './Obstacles';
import GameManager from './GameManager'
import Buildings from './Buildings';
import Objects from './Objects';

const WIDTH = 800;
const HEIGHT = 600;

class Pixi {
    constructor(resources) {
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

        this._allowZoomAnimation = true;

        this._setup();
    }

    _setup() {
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

        // PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        PIXI.settings.SORTABLE_CHILDREN;
        PIXI.settings.ROUND_PIXELS

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

        SizeUtils.getSize(
            this._width,
            this._height,
            this._canvas.width,
            this._canvas.height,
            SizeUtils.COVER
        );
        
        this._app.renderer.resize(this._width, this._height);

        // if (this._playerContainer) {
        //     this._playerContainer.getRealPlayer().scale.x = this._playerContainer.scale.y = ratio;
        // }

        // this._app.renderer.resize(Math.ceil(this._width * ratio), Math.ceil(this._height * ratio));
    }

    _setupLayers() {
        this._roadContainer = new Road(this._canvas);
        this._obstaclesContainer = new Obstacles(this._canvas, this._resources['obstaclesSpritesheet']);
        this._buildingsContainer = new Buildings(this._canvas, this._resources['buildingSpritesheet']);
        this._objectsContainer = new Objects(this._canvas, this._resources['objectsSpritesheet']);

        this._start();
    }

    setupPlayer(index, ressources) {
        this._playerIndex = index;
        if (this._playerIndex === 1) {
            this._playerContainer = new Player(this._canvas, this._playerIndex, ressources['animationSpritesheetSkate'], ressources['shadowSpritesheet']);
        } else {
            this._playerContainer = new Player(this._canvas, this._playerIndex, ressources['animationSpritesheetBike'], ressources['shadowSpritesheet']);
        }
        this._setupGameManager();
    }

    _setupGameManager() {
        this._gameManager = new GameManager(this._stage, this._playerContainer, this._obstaclesContainer, this._deltaTime);

        this._dateNow = Date.now()
        this._lastTime = this._dateNow;
        this._deltaTime = 16;
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

        if (this._playerContainer) {
            this._container.removeChild(this._playerContainer.getRealPlayer());
            this._container.removeChild(this._playerContainer.getFakePlayer());
        }

        this._container.removeChild(this._obstaclesContainer.drawFakeObstacle());
    }

    _addChilds() {
        this._skewedContainer.addChild(this._buildingsContainer.drawBuildings());
        this._skewedContainer.addChild(this._objectsContainer.drawObjects());

        this._skewedContainer.addChild(this._roadContainer.drawRoad());

        this._container.addChild(this._skewedContainer);
        this._skewedContainer.addChild(this._obstaclesContainer.drawObstacles());

        if (this._playerContainer) {
            this._container.addChild(this._playerContainer.getRealPlayer());
            this._container.addChild(this._playerContainer.getFakePlayer());
        }

        this._container.addChild(this._obstaclesContainer.drawFakeObstacle());

    }

    _tick() {
        if (!this._isReady || !this._gameManager) return;
        if (!this._gameManager.isGameFinished) {
            this._updateDeltaTime();
            this._removeChilds();
            this._addChilds();
            this._roadContainer.updateRoadLinesPosition(this._gameManager.gameSpeed, this._deltaTime);
            this._obstaclesContainer.updateObstaclesPosition(this._gameManager.gameSpeed, this._deltaTime);
            this._buildingsContainer.updateBuildingsPosition(this._gameManager.gameSpeed, this._deltaTime);
            this._objectsContainer.updateObjectsPosition(this._gameManager.gameSpeed, this._deltaTime);

            if (this._playerContainer) {
                // this._isPlayerJumping = this._playerContainer.isPlayerJumping();
            }
            this._gameManager.tick();

            this._reloadPage();
        }

        if (this._gameManager.isGameFinished && this._playerContainer) {
            this._playerContainer._stopAnimations()
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
        if (this._gameManager && this._deltaTime > 1500) {
            window.location.reload()
        }
    }
}

export default Pixi;
import _ from 'underscore';
import { TweenLite } from 'gsap';
import * as PIXI from 'pixi.js'
import Stats from 'stats.js';
import * as dat from 'dat.gui';

class Pixi {
    constructor() {
        _.bindAll(this, '_tickHandler', '_resizeHandler', '_textureLoadedHandler', '_loaderProgressHandler');

        this.el = document.querySelector('.js-canvas');
        this.ui = {};
        this.components = {};

        this._delta = 0;
        this._isReady = false;

        this._settings = {
            speed: 7
        }

        this._roadProperties = {
            x: -100,
            y: window.innerHeight + 50,
            height: 350,
            linesPadding: 100,
            linesAmount: 20,
            linesWidth: 45,
            linesHeight: 15
        }

        this._spriteProperties = {
            x: 270,
            width: 170,
            translate: 70
        }

        const gui = new dat.GUI({ closed: false });
        gui.add(this._settings, 'speed', 0.1, 100).step(0.1);
        const roads = gui.addFolder('road');
        const player = gui.addFolder('player');
        roads.add(this._roadProperties, 'height', 1, 1000).step(1).onChange(() => {this._createRoad()});
        roads.add(this._roadProperties, 'linesPadding', 1, 1000).step(1).onChange(() => {this._createRoad()});
        roads.add(this._roadProperties, 'linesAmount', 1, 1000).step(1).onChange(() => {this._createRoad()});
        roads.add(this._roadProperties, 'linesWidth', 1, 1000).step(1).onChange(() => {this._createRoad()});
        roads.add(this._roadProperties, 'linesHeight', 1, 1000).step(1).onChange(() => {this._createRoad()});
        player.add(this._spriteProperties, 'x', 1, 1000).step(1).onChange(() => {this._createAnimatedSprite()});
        player.add(this._spriteProperties, 'width', 1, 1000).step(1).onChange(() => {this._createAnimatedSprite()});
        player.add(this._spriteProperties, 'translate', 1, 1000).step(1).onChange(() => {this._createAnimatedSprite()});


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
        document.body.appendChild(this._stats.dom);
    }

    _setupPixi() {
        this._app = new PIXI.Application({
            view: this.el,
            width: window.innerWidth,
            height: window.innerHeight,
            transparent: true,
            antialias: true,
            preserveDrawingBuffer: true
        });
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

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
        this._roadContainer = new PIXI.Container();

    }

    _loadAssets() {
        this._textureLoader = new PIXI.loaders.Loader();

        // for (let i = 0; i < 18; i++) {
        //     this._textureLoader.add('sprite1', '../assets/sprite_01.png');
        // }
        this._textureLoader.add('sprite1', '../assets/sprite_01.png');
        this._textureLoader.add('sprite1', '../assets/sprite_01.png');
        this._textureLoader.onProgress.add(this._loaderProgressHandler);
        this._textureLoader.load(this._textureLoadedHandler);
    }

    _start() {
        this._createAnimatedSprite();
        this._createRoad();

        this._isReady = true;
    }

    _createAnimatedSprite() {

        let animatedTextures = [
            this._textureLoader.resources['sprite1'].texture,
            this._textureLoader.resources['sprite2'].texture,
        ]

        this._animatedSprite = new PIXI.extras.AnimatedSprite(animatedTextures);

        let ratio = this._animatedSprite.width / this._animatedSprite.height;

        this._animatedSprite.animationSpeed = .10;
        this._animatedSprite.play();
        this._spriteContainer.addChild(this._animatedSprite);

     

        this._animatedSprite.width = this._spriteProperties.width
        this._animatedSprite.height = this._spriteProperties.width / ratio

        this._animatedSprite.position.x = this._spriteProperties.x;
        this._animatedSprite.position.y = this._canvas.height - this._animatedSprite.height - this._spriteProperties.translate;
    }

    _createRoad() {
        const degrees = Math.PI * 30.75 / 180

        this._road = new PIXI.Graphics();
        this._road.beginFill(0xC6C6C6);
        this._road.drawRect(0, 0, this._canvas.width * 4, this._roadProperties.height);
        this._roadContainer.addChild(this._road);

        this._roadLinesContainer = new PIXI.Container();
        
        for (let i = 0; i < this._roadProperties.linesAmount; i++) {
            let roadLine = new PIXI.Graphics();
            roadLine.beginFill(0xFFFFFF);
            roadLine.drawRect(0, 0, this._roadProperties.linesWidth, this._roadProperties.linesHeight);
            roadLine.transform.skew.x = degrees;
            roadLine.transform.position.x = i * this._roadProperties.linesPadding
            roadLine.transform.position.y = (this._roadProperties.height/2) - (this._roadProperties.linesHeight/2)
            this._roadLastPositionX = i * this._roadProperties.linesPadding;
            this._roadLinesContainer.addChild(roadLine);
        }

        this._roadContainer.addChild(this._roadLinesContainer);

        this._roadContainer.position.x = this._roadProperties.x;
        this._roadContainer.position.y = this._roadProperties.y;
        this._roadContainer.transform.skew.x = degrees;
        this._roadContainer.rotation = -degrees;
    }

    _updateRoadLinesPosition() {
        for (let i = 0; i < this._roadLinesContainer.children.length; i++) {
        this._roadLinesContainer.children[i].position.x += this._settings.speed * -1;
            if (this._roadLinesContainer.children[i].position.x < 0) {
                this._roadLinesContainer.children[i].position.x = this._roadLastPositionX + this._roadProperties.linesPadding;
            }
        }
    }

    _removeChilds() {
        this._container.removeChild(this._roadContainer);
        this._container.removeChild(this._spriteContainer);
    }

    _addChilds() {
        this._container.addChild(this._roadContainer);
        this._container.addChild(this._spriteContainer);
    }

    _tick() {
        if (!this._isReady) return;

        this._delta += 1 * this._settings.speed;

        this._removeChilds();
        this._addChilds();
        this._updateRoadLinesPosition();

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
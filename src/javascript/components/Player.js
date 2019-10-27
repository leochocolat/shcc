import _ from 'underscore';
import { TweenLite, Power3 } from 'gsap';

class Player {
    constructor(canvas) {
        _.bindAll(this, '_keyDownHandler', '_keyUpHandler');

        this._canvas = canvas;

        this._spriteProperties = {
            x: 270,
            width: 170,
            translate: 70
        }

        this._horizontalDisplacement = 0;

        this._setup();
    }

    _setup() {
        this._spriteContainer = new PIXI.Container();
        this._loadAssets();
        this._setupEventListeners();
    }

    _loadAssets() {
        this._textureLoader = new PIXI.loaders.Loader();

        for (let i = 0; i <= 25; i++) {
            this._textureLoader.add(`frame${i}`, `../assets/sprites/jump/jump_0${i}.png`);
        }
        for (let i = 0; i <= 31; i++) {
            this._textureLoader.add(`frame${26 + i}`, `../assets/sprites/pedale/pedale_0${i}.png`);
        }
        // this._textureLoader.onProgress.add(this._loaderProgressHandler);
        this._textureLoader.load(() => { this._createAnimatedSprites() });
    }

    _createAnimatedSprites() {
        let preJumpSprites = []
        for (let i = 0; i <= 3; i++) {
            preJumpSprites.push(this._textureLoader.resources[`frame${i}`].texture);
        }
        this._preJumpAnimation = new PIXI.extras.AnimatedSprite(preJumpSprites);

        let jumpSprites = []
        for (let i = 3; i <= 10; i++) {
            jumpSprites.push(this._textureLoader.resources[`frame${i}`].texture);
        }

        this._jumpAnimation = new PIXI.extras.AnimatedSprite(jumpSprites);

        let fallSprites = []
        for (let i = 11; i <= 25; i++) {
            fallSprites.push(this._textureLoader.resources[`frame${i}`].texture);
        }

        this._fallAnimation = new PIXI.extras.AnimatedSprite(fallSprites);

        let pedalingSprites = []
        for (let i = 26; i <= 26 + 31; i++) {
            pedalingSprites.push(this._textureLoader.resources[`frame${i}`].texture);
        }

        this._pedalingAnimation = new PIXI.extras.AnimatedSprite(pedalingSprites);

        let ratio = this._preJumpAnimation.width / this._preJumpAnimation.height;

        this._preJumpAnimation.animationSpeed = .3;
        this._jumpAnimation.animationSpeed = .3;
        this._fallAnimation.animationSpeed = .3;
        this._pedalingAnimation.animationSpeed = .3;

        this._preJumpAnimation.loop = false
        this._jumpAnimation.loop = false
        this._fallAnimation.loop = false
        this._pedalingAnimation.loop = true

        this._preJumpAnimation.play()
        this._jumpAnimation.play()
        this._fallAnimation.play()
        this._pedalingAnimation.play()

        this._preJumpAnimation.width = this._spriteProperties.width
        this._preJumpAnimation.height = this._spriteProperties.width / ratio;

        this._jumpAnimation.width = this._spriteProperties.width
        this._jumpAnimation.height = this._spriteProperties.width / ratio;

        this._fallAnimation.width = this._spriteProperties.width
        this._fallAnimation.height = this._spriteProperties.width / ratio;

        this._pedalingAnimation.width = this._spriteProperties.width
        this._pedalingAnimation.height = this._spriteProperties.width / ratio;

        this._preJumpAnimation.position.x = this._spriteProperties.x;
        this._preJumpAnimation.position.y = this._canvas.height - this._preJumpAnimation.height - this._spriteProperties.translate;

        this._jumpAnimation.position.x = this._spriteProperties.x;
        this._jumpAnimation.position.y = this._canvas.height - this._preJumpAnimation.height - this._spriteProperties.translate;

        this._fallAnimation.position.x = this._spriteProperties.x;
        this._fallAnimation.position.y = this._canvas.height - this._preJumpAnimation.height - this._spriteProperties.translate;

        this._pedalingAnimation.position.x = this._spriteProperties.x;
        this._pedalingAnimation.position.y = this._canvas.height - this._preJumpAnimation.height - this._spriteProperties.translate;

        this._addChild(this._pedalingAnimation);
    }

    _playPreJumpAnimation() {
        this._removeChilds(this._spriteContainer);
        this._addChild(this._preJumpAnimation);
        this._preJumpAnimation.gotoAndPlay(0);
    }

    _playJumpAnimation() {
        this._removeChilds(this._spriteContainer);
        this._addChild(this._jumpAnimation);
        this._jumpAnimation.gotoAndPlay(0);
        TweenLite.to(this._spriteContainer.transform.position, .5, {
            y: -40, onComplete: () => {
                this._playFallAnimation();
            }
        });
    }

    _playFallAnimation() {
        this._removeChilds(this._spriteContainer);
        this._addChild(this._fallAnimation);
        this._fallAnimation.gotoAndPlay(0);
        TweenLite.to(this._spriteContainer.transform.position, 0.4, {
            y: 0, onComplete: () => {
                this._isJumping = false;
                this._playPedalingAnimation();
            }
        });
    }

    _playPedalingAnimation() {
        this._removeChilds(this._spriteContainer);
        this._addChild(this._pedalingAnimation);
        this._pedalingAnimation.gotoAndPlay(0);
    }

    _removeChilds(container) {
        container.removeChild(this._preJumpAnimation);
        container.removeChild(this._jumpAnimation);
        container.removeChild(this._fallAnimation);
        container.removeChild(this._pedalingAnimation);
    }

    _addChild(animatedSprite) {
        this._spriteContainer.addChild(animatedSprite);
    }

    _updatePositionsArrow(direction) {
        TweenLite.to(this._spriteContainer.transform.position, .7, { y: 10 * direction, x: 300 * direction, ease: Power3.easeOut });
    }

    tick() {

    }

    drawPlayer() {
        return this._spriteContainer
    }

    _setupEventListeners() {
        window.addEventListener('keydown', this._keyDownHandler);
        window.addEventListener('keyup', this._keyUpHandler);
    }

    _keyDownHandler(e) {
        switch (e.code) {
            case 'Space':
            case 'ArrowUp':
                if (this._isPressed || this._isJumping) return;
                this._isJumping = true;
                this._isPressed = true;
                this._playPreJumpAnimation();
                break;
            case 'ArrowLeft':
                this._arrowPressed = true;
                this._updatePositionsArrow(0);
                break;
            case 'ArrowRight':
                this._arrowPressed = true;
                this._updatePositionsArrow(1);
                break;
        }
    }

    _keyUpHandler(e) {
        switch (e.code) {
            case 'Space':
            case 'ArrowUp':
                this._isPressed = false;
                this._playJumpAnimation();
                break;
            case 'ArrowLeft':
                this._arrowPressed = false;
                break;
            case 'ArrowRight':
                this._arrowPressed = false;
                break;
        }
    }
}
export default Player;
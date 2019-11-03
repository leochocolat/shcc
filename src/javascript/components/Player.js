import _ from 'underscore';
import { TweenLite, Power3 } from 'gsap';

class Player {
    constructor(canvas, playerIndex, resources) {
        _.bindAll(this, '_keyDownHandler', '_keyUpHandler');
        this._canvas = canvas;
        this._playerIndex = playerIndex;
        this._resources = resources;

        this._animationProperties = [
            [
                { start: 0, end: 3 },
                { start: 4, end: 10 },
                { start: 11, end: 25 },
                { start: 0, end: 35 },
            ],
            [
                { start: 0, end: 2 },
                { start: 3, end: 9 },
                { start: 10, end: 16 },
                { start: 0, end: 16 },
                { start: 0, end: 16 },
            ]
        ]

        this._spritesNames = [
            ['saute', 'pedale'],
            ['saute', 'roule', 'pousse'],
        ]

        this._spriteProperties = {
            x: 270,
            width: 170,
            translate: 70
        }
        this._fakePlayerProperties = {
            x: 0,
            y: 0
        }
        this._horizontalDisplacement = 0;

        this._setup();
    }

    _setup() {
        this._spriteContainer = new PIXI.Container();
        this._createAnimatedSprites();
        this._setupEventListeners();
    }

    _createAnimatedSprites() {
        let preJumpSprites = []
        for (let i = this._animationProperties[this._playerIndex][0].start; i <= this._animationProperties[this._playerIndex][0].end; i++) {
            preJumpSprites.push(this._resources.textures[`${this._spritesNames[this._playerIndex][0]}_0${i}.png`]);
        }
        this._preJumpAnimation = new PIXI.extras.AnimatedSprite(preJumpSprites);

        let jumpSprites = []
        for (let i = this._animationProperties[this._playerIndex][1].start; i <= this._animationProperties[this._playerIndex][1].end; i++) {
            jumpSprites.push(this._resources.textures[`${this._spritesNames[this._playerIndex][0]}_0${i}.png`]);
        }
        this._jumpAnimation = new PIXI.extras.AnimatedSprite(jumpSprites);

        let fallSprites = []
        for (let i = this._animationProperties[this._playerIndex][2].start; i <= this._animationProperties[this._playerIndex][2].end; i++) {
            fallSprites.push(this._resources.textures[`${this._spritesNames[this._playerIndex][0]}_0${i}.png`]);
        }
        this._fallAnimation = new PIXI.extras.AnimatedSprite(fallSprites);

        let pedalingSprites = []
        for (let i = this._animationProperties[this._playerIndex][3].start; i <= this._animationProperties[this._playerIndex][3].end; i++) {
            pedalingSprites.push(this._resources.textures[`${this._spritesNames[this._playerIndex][1]}_0${i}.png`]);
        }
        this._standardAnimation = new PIXI.extras.AnimatedSprite(pedalingSprites);

        let ratio = this._preJumpAnimation.width / this._preJumpAnimation.height;

        this._preJumpAnimation.animationSpeed = .3;
        this._jumpAnimation.animationSpeed = .3;
        this._fallAnimation.animationSpeed = .3;
        this._standardAnimation.animationSpeed = .3;

        this._preJumpAnimation.loop = false
        this._jumpAnimation.loop = false
        this._fallAnimation.loop = false
        this._standardAnimation.loop = true

        this._preJumpAnimation.play()
        this._jumpAnimation.play()
        this._fallAnimation.play()
        this._standardAnimation.play()

        this._preJumpAnimation.width = this._spriteProperties.width
        this._preJumpAnimation.height = this._spriteProperties.width / ratio;

        this._jumpAnimation.width = this._spriteProperties.width
        this._jumpAnimation.height = this._spriteProperties.width / ratio;

        this._fallAnimation.width = this._spriteProperties.width
        this._fallAnimation.height = this._spriteProperties.width / ratio;

        this._standardAnimation.width = this._spriteProperties.width
        this._standardAnimation.height = this._spriteProperties.width / ratio;

        this._preJumpAnimation.position.x = this._spriteProperties.x;
        this._preJumpAnimation.position.y = this._canvas.height - this._preJumpAnimation.height - this._spriteProperties.translate;

        this._jumpAnimation.position.x = this._spriteProperties.x;
        this._jumpAnimation.position.y = this._canvas.height - this._preJumpAnimation.height - this._spriteProperties.translate;

        this._fallAnimation.position.x = this._spriteProperties.x;
        this._fallAnimation.position.y = this._canvas.height - this._preJumpAnimation.height - this._spriteProperties.translate;

        this._standardAnimation.position.x = this._spriteProperties.x;
        this._standardAnimation.position.y = this._canvas.height - this._preJumpAnimation.height - this._spriteProperties.translate;

        if (this._playerIndex == 1) {
            let poussingSprites = []
            for (let i = this._animationProperties[this._playerIndex][4].start; i <= this._animationProperties[this._playerIndex][4].end; i++) {
                poussingSprites.push(this._resources.textures[`${this._spritesNames[this._playerIndex][2]}_0${i}.png`]);
            }
            this._poussingAnimation = new PIXI.extras.AnimatedSprite(poussingSprites);
            this._poussingAnimation.animationSpeed = .3;
            this._poussingAnimation.loop = true;
            this._poussingAnimation.width = this._spriteProperties.width;
            this._poussingAnimation.height = this._spriteProperties.width / ratio;
            this._poussingAnimation.position.x = this._spriteProperties.x;
            this._poussingAnimation.position.y = this._canvas.height - this._preJumpAnimation.height - this._spriteProperties.translate;
        }

        this._addChild(this._standardAnimation);
    }

    getPlayer() {
        return this._spriteContainer;
    }

    _playPreJumpAnimation() {
        this._removeChilds(this._spriteContainer);
        this._addChild(this._preJumpAnimation);
        this._preJumpAnimation.gotoAndPlay(0);
    }

    _playJumpAnimation() {
        if (this._isTweening) return;
        this._isTweening = true;

        this._removeChilds(this._spriteContainer);
        this._addChild(this._jumpAnimation);

        this._jumpAnimation.gotoAndPlay(0);
        TweenLite.to(this._spriteContainer.transform.position, .5, {
            y: -40, onComplete: () => {
                this._isTweening = false;
                this._playFallAnimation();
            }
        });
    }

    _playFallAnimation() {
        this._isTweening = true;
        this._removeChilds(this._spriteContainer);
        this._addChild(this._fallAnimation);
        this._fallAnimation.gotoAndPlay(0);
        TweenLite.to(this._spriteContainer.transform.position, 0.4, {
            y: 0, onComplete: () => {
                this._isTweening = false;
                this._isJumping = false;
                this._playPedalingAnimation();
            }
        });
    }

    _playPedalingAnimation() {
        this._removeChilds(this._spriteContainer);
        this._addChild(this._standardAnimation);
        this._standardAnimation.gotoAndPlay(0);
    }

    _removeChilds(container) {
        container.removeChild(this._preJumpAnimation);
        container.removeChild(this._jumpAnimation);
        container.removeChild(this._fallAnimation);
        container.removeChild(this._standardAnimation);
    }

    _addChild(animatedSprite) {
        this._spriteContainer.addChild(animatedSprite);
    }

    _updatePositionsArrow(direction) {
        if (this._isTweening) return;
        TweenLite.to(this._spriteContainer.transform.position, .7, { y: 10 * direction, x: 300 * direction, ease: Power3.easeOut });
    }

    tick() {

    }

    drawPlayer() {
        return this._spriteContainer;
    }

    getBounds() {
        return this._spriteContainer.getBounds();

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
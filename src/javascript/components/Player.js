import _ from 'underscore';
import { TweenLite, Power3, TweenMax } from 'gsap';

// const SCALESTART = 1.05;
// const SCALEPRESS = 1.07;
// const SCALEJUMP = 1;
const SCALESTART = 1;
const SCALEPRESS = 1.02;
const SCALEJUMP = .95;

const EASEPRESS = Power3.easeOut;
const EASEJUMP = Power3.easeOut;
const EASEEND = '';

class Player {
    constructor(canvas, playerIndex, resources, shadows) {
        _.bindAll(this, '_keyDownHandler', '_keyUpHandler');

        this._canvas = canvas;
        this._playerIndex = playerIndex;
        this._resources = resources;
        this._shadows = shadows;

        this.ui = {
            gameInfos: document.querySelector('.js-game-infos-borders')
        }

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
            width: [170, 140],
            translate: 70,
            shadowTranslateX: [-120, -160],
            shadowTranslateY: [-65, -70]
        }

        this._horizontalDisplacement = 0;
        this._isPlayerJumping = false;
        this.animationNeedToStop = false;
        this._setup();
    }

    _setup() {
        TweenLite.set(this._canvas, { scale: SCALESTART });

        this._spriteContainer = new PIXI.Container();
        this._createShadow();
        this._createAnimatedSprites();
        this._createFakePlayer();
        this._setupEventListeners();
    }

    _createShadow() {
        let shadowTexture = this._shadows.textures[`shadow_${this._playerIndex}.png`];

        this._shadowSprite = new PIXI.Sprite.from(shadowTexture);

        if (!this._shadowSprite) return;

        let ratio = this._shadowSprite.width / this._shadowSprite.height;
        this._shadowSprite.width = 280;
        this._shadowSprite.height = 280 / ratio;

        this._shadowSprite.position.x = this._spriteProperties.x + this._spriteProperties.shadowTranslateX[this._playerIndex];
        this._shadowSprite.position.y = this._canvas.height - this._shadowSprite.height + this._spriteProperties.shadowTranslateY[this._playerIndex];

        this._addChild(this._shadowSprite);
    }

    _createFakePlayer() {
        this.fakePlayerRect = new PIXI.Graphics();
        this.fakePlayerRect.fill = 0x0000ff;
        this.fakePlayerRect.alpha = 0;
        this.fakePlayerRect.drawRect(635, (350 / 2) / 2, 200, 125);
        this.fakePlayerRect.pivot.x = this.fakePlayerRect.width / 2;
        this.fakePlayerRect.pivot.y = this.fakePlayerRect.height / 2;
    }

    updatePositionFakePlayer(direction) {
        TweenLite.to(this.fakePlayerRect, .7, { y: (350 / 2) * direction, ease: Power3.easeOut });
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

        this._preJumpAnimation.width = this._spriteProperties.width[this._playerIndex]
        this._preJumpAnimation.height = this._spriteProperties.width[this._playerIndex] / ratio;

        this._jumpAnimation.width = this._spriteProperties.width[this._playerIndex]
        this._jumpAnimation.height = this._spriteProperties.width[this._playerIndex] / ratio;

        this._fallAnimation.width = this._spriteProperties.width[this._playerIndex]
        this._fallAnimation.height = this._spriteProperties.width[this._playerIndex] / ratio;

        this._standardAnimation.width = this._spriteProperties.width[this._playerIndex]
        this._standardAnimation.height = this._spriteProperties.width[this._playerIndex] / ratio;

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
            this._poussingAnimation.width = this._spriteProperties.width[this._playerIndex];
            this._poussingAnimation.height = this._spriteProperties.width[this._playerIndex] / ratio;
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

        TweenLite.to(this._canvas, 0.3, { scale: SCALEPRESS, ease: EASEPRESS });
        // TweenLite.to(this.ui.gameInfos, 0.3, { 
        //     borderTopWidth: `${SCALEPRESS * 12}px`,
        //     borderRightWidth: `${SCALEPRESS * 12}px`,
        //     borderBottomWidth: `${SCALEPRESS * 12}px`,
        //     borderLeftWidth: `${SCALEPRESS * 12}px`,
        //     ease: EASEPRESS,
        //  });
    }

    _playJumpAnimation() {
        if (this._isTweening) return;
        this._isTweening = true;

        this._removeChilds(this._spriteContainer);
        this._addChild(this._jumpAnimation);

        this._jumpAnimation.gotoAndPlay(0);

        TweenLite.to(this._canvas, 0.3, { scale: SCALEJUMP, ease: EASEJUMP });
        TweenLite.to(this.ui.gameInfos, 0.3, { 
            borderTopWidth: `${SCALEJUMP * 12}px`,
            borderRightWidth: `${SCALEJUMP * 12}px`,
            borderBottomWidth: `${SCALEJUMP * 12}px`,
            borderLeftWidth: `${SCALEJUMP * 12}px`,
            ease: EASEJUMP,
         });

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

        TweenLite.to(this._canvas, 0.5, { scale: SCALESTART, ease: EASEEND });
        TweenLite.to(this.ui.gameInfos, 0.5, { 
            borderTopWidth: `${SCALESTART * 12}px`,
            borderRightWidth: `${SCALESTART * 12}px`,
            borderBottomWidth: `${SCALESTART * 12}px`,
            borderLeftWidth: `${SCALESTART * 12}px`,
            ease: EASEEND,
         });

        TweenLite.to(this._spriteContainer.transform.position, 0.4, {
            y: 0, onComplete: () => {
                this._isTweening = false;
                this._isJumping = false;
                this._isPlayerJumping = false;
                this._playPedalingAnimation();
            }
        });
    }

    _playPedalingAnimation() {
        this._removeChilds(this._spriteContainer);
        this._addChild(this._standardAnimation);
        this._standardAnimation.gotoAndPlay(0);
    }

    _stopAnimations() {
        this._standardAnimation.gotoAndStop(0);
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

    getRealPlayer() {
        return this._spriteContainer;
    }

    getFakePlayer() {
        return this.fakePlayerRect;
    }

    getFakePlayerBounds() {
        return this.fakePlayerRect.getBounds();
    }

    isPlayerJumping() {
        return this._isPlayerJumping;
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
                this.updatePositionFakePlayer(0);
                break;
            case 'ArrowRight':
                this._arrowPressed = true;
                this._updatePositionsArrow(1);
                this.updatePositionFakePlayer(1);
                break;
        }
    }

    _keyUpHandler(e) {
        switch (e.code) {
            case 'Space':
            case 'ArrowUp':
                this._isPressed = false;
                this._isPlayerJumping = true;
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
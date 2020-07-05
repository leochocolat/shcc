import Loose from './Loose';
import Timer from './Timer';
import Form from '../modules/Form';
import Cinematic from '../components/Cinematic';
import CountDown from './CountDown';
import ControlsIndications from './ControlsIndications';
import { TweenLite } from 'gsap';


class GameManager {
    constructor(stage, player, obstacle, timer) {
        this._stage = stage
        this._player = player
        this._obstacle = obstacle
        this._timer = timer
        this._allowHit = false
        this.isGameFinished = false
        this.gameSpeed = 0.8

        this._isGameReadyToStart = false;
        this._isWaitingToStart = false;

        this.keyPressed = {
            right: false,
            left: false,
            up: false
        };

        this._setup();

        this.progressBarCompletion = document.querySelectorAll('.progress-completion');
        this.looseComponent = new Loose(document.querySelector('.js-section-loose'));
    }

    _setup() {
        this._setupEventListeners();

        this._timer = new Timer();
        this._timer.resetTimer();

        this._setupContolsTutorial();
    }

    _setupContolsTutorial() {
        this._countDown = new CountDown(document.querySelector('.js-countdown'));
        this._controlsDown = new ControlsIndications(document.querySelector('.js-controlsIndications'));
        this._countDown.setupTweens();

        setTimeout(() => {
            this._controlsDown.transitionIn();
            setTimeout(() => {
                this._controlsDown.transitionInKey(this._controlsDown.ui.spacebar);
            }, 400);
        }, 2000);
    }

    _startCountdown() {
        this._timer.resetTimer();

        setTimeout(() => {

            this._countDown.animateIn();
        }, 2000);
        this._isWaitingToStart = true;

        let counter = 3;

        setTimeout(() => {
            this.counterInterval = setInterval(() => {
                counter--;
                this._countDown.updateContent(counter);
            }, 1000)
        }, 2000);

        setTimeout(() => {
            this._startGame();
        }, 6000);
    }

    _startGame() {
        this._isGameReadyToStart = true;

        this._obstacle.start();
        this._countDown.animateOut();

        clearInterval(this.counterInterval);

        for (let index = 0; index < this._obstacle._sprites.length; index++) {
            this._obstacle._sprites[index].alpha = 1
        }

        setTimeout(() => {
            this._allowHit = true;
        }, 2000);

        this._timer.resetTimer();
    }

    tick() {
        if (!this._isGameReadyToStart) return;

        let playerBounds = this._player.getFakePlayerBounds(),
            obstacleBounds = this._obstacle.getFakeObstacleBounds(),
            isJumping = this._player.isPlayerJumping();

        this._levelDifficulty();
        this._animateProgressBar();

        if (this._isGameReadyToStart) {
            this._updateTimerSeconds();
        }

        if (playerBounds.x + playerBounds.width > obstacleBounds.x && playerBounds.x < obstacleBounds.x + obstacleBounds.width && playerBounds.y + playerBounds.height > obstacleBounds.y && playerBounds.y < obstacleBounds.y + obstacleBounds.height && this._allowHit && !isJumping) {
            this._hitTest()
        }
    }

    _levelDifficulty() {
        if (this._timer.seconds > 2.00 && this.gameSpeed == 0.8) {
            this.gameSpeed = 1
        } else if (this._timer.seconds > 20.00 && this.gameSpeed == 1) {
            this.gameSpeed = 1.2
        } else if (this._timer.seconds > 30.00 && this.gameSpeed == 1.2) {
            this.gameSpeed = 1.4
        } else if (this._timer.seconds > 50.00 && this.gameSpeed == 1.4) {
            this._endGame()
        }
    }

    _allowHitManager() {
        this._allowHit = false;
        setTimeout(() => {
            this._allowHit = true;
        }, 5000)
    }

    _hitTest() {
        this.gameSpeed = 0.8;
        this._allowHitManager();
        this._timer.resetTimer();
        this.looseComponent.animate();
    }

    _updateTimerSeconds() {
        this._currentTime = this._timer.getDeltaTime();
    }

    _animateProgressBar() {
        let progressPercentage = 100 * this._timer.seconds / 50
        for (let index = 0; index < this.progressBarCompletion.length; index++) {
            this.progressBarCompletion[index].style.width = `${progressPercentage}%`;
        }
    }

    _endGame() {
        this._allowHit = false;
        TweenLite.to(this, 5, {
            gameSpeed: 0, ease: Power0.easeNone,
            onComplete: () => { this.isGameFinished = true; }
        });

        this._player.disableControls();
        this._player.playerOutAnimation();

        this._cinematic = new Cinematic();
        this._cinematic.transitionIn();

        setTimeout(() => {
            this._cinematic.play().then(() => {
                this.form = new Form(document.querySelector('.js-form-component'));
                this.form.transitionIn();
            
                setTimeout(() => {
                    this._cinematic.transitionOut();
                }, 800);
            })
        }, 800);
    }

    _setupEventListeners() {
        window.addEventListener('keydown', this._keyDownHandler.bind(this));
        window.addEventListener('keyup', this._keyUpHandler.bind(this));
        
        this._player.hammer.on('swipeleft', (event) => this._swipeHandler(event))
        this._player.hammer.on('swiperight', (event) => this._swipeHandler(event))
        this._player.hammer.on('swipeup', (event) => this._swipeHandler(event))
        this._player.hammer.on('tap', (event) => this._swipeHandler(event))
    }

    _keyPressedAnimation() {
        if (this.keyPressed.left && this.keyPressed.right && this._allowArrowKey) {
            this._allowArrowKey = false;
            setTimeout(() => {
                this._controlsDown.transitionOutKeys([this._controlsDown.ui.left, this._controlsDown.ui.right]);
            }, 1800);
        }

        if (this.keyPressed.up && !this.keyPressed.left && !this.keyPressed.right && !this._allowArrowKey) {
            this._allowArrowKey = true;
            setTimeout(() => {
                this._controlsDown.transitionInKeys([this._controlsDown.ui.left, this._controlsDown.ui.right]);
            }, 1000);
        }

        if (this.keyPressed.left && this.keyPressed.right && this.keyPressed.up && !this._isWaitingToStart) {
            this._startCountdown();
        }
    }

    _keyDownHandler(event) {
        switch (event.code) {
            case 'Space':
            case 'ArrowUp':
                this.keyPressed.up = true;
                this._controlsDown._playTween(this._controlsDown.ui.spacebar);
                setTimeout(() => {
                    this._controlsDown.transitionOutKey(this._controlsDown.ui.spacebar);
                }, 1200);
                break;
            case 'ArrowLeft':
                if (!this._allowArrowKey) return;

                this.keyPressed.left = true;
                this._controlsDown._playTween(this._controlsDown.ui.left);
                if (this.keyPressed.right) {
                    setTimeout(() => {
                        this._controlsDown.transitionOut();
                    }, 1200);
                }
                break;
            case 'ArrowRight':
                if (!this._allowArrowKey) return;

                this.keyPressed.right = true;
                this._controlsDown._playTween(this._controlsDown.ui.right);

                if (this.keyPressed.left) {
                    setTimeout(() => {
                        this._controlsDown.transitionOut();
                    }, 1200);
                }

                break;
        }
        this._keyPressedAnimation();
    }

    _keyUpHandler(e) {
        switch (e.code) {
            case 'Space':
            case 'ArrowUp':
                this._controlsDown._validateControl(this._controlsDown.ui.spacebar);
                break;
            case 'ArrowLeft':
                if (!this.keyPressed.left) return;
                this._controlsDown._validateControl(this._controlsDown.ui.left);
                break;
            case 'ArrowRight':
                if (!this.keyPressed.right) return;
                this._controlsDown._validateControl(this._controlsDown.ui.right);
                break;
        }
    }

    _swipeHandler(swipeEvent) {
        switch (swipeEvent.type) {
            case 'swipeup':
            case 'tap':
                this._controlsDown._validateControl(this._controlsDown.ui.spacebar);
                this.keyPressed.up = true;

                this._controlsDown._playTween(this._controlsDown.ui.spacebar);

                setTimeout(() => { this._controlsDown.transitionOutKey(this._controlsDown.ui.spacebar) }, 1200);

                break;
            case 'swipeleft':
                if (!this._allowArrowKey) return;

                this.keyPressed.left = true;
                this._controlsDown._validateControl(this._controlsDown.ui.left);

                this._controlsDown._playTween(this._controlsDown.ui.left);

                if (this.keyPressed.right) {
                    setTimeout(() => { this._controlsDown.transitionOut() }, 1200) 
                }
                break;
            case 'swiperight':
                if (!this._allowArrowKey) return;

                this.keyPressed.right = true;
                this._controlsDown._validateControl(this._controlsDown.ui.right);

                this._controlsDown._playTween(this._controlsDown.ui.right);

                if (this.keyPressed.left) {
                    setTimeout(() => { this._controlsDown.transitionOut() }, 1200);
                }
                break;
        }
        this._keyPressedAnimation();
    }
}


export default GameManager
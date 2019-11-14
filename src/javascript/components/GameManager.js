import Loose from './Loose';
import Timer from './Timer';
import Form from './Form';
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

        // POUR DISPLAY LE FORM
        // this.form = new Form(document.querySelector('.js-form-component'));
        // this.form.transitionIn();

        this._timer = new Timer()
        this._countDown = new CountDown(document.querySelector('.js-countdown'));
        this._controlsDown = new ControlsIndications(document.querySelector('.js-controlsIndications'));


        this._countDown.setupTweens();
        setTimeout(() => {
            this._controlsDown.transitionIn();
            setTimeout(() => {
                this._controlsDown.transitionInKey(this._controlsDown.ui.spacebar);
            }, 400);
        }, 2000);

        this._timer.resetTimer();

        for (let index = 0; index < this._obstacle._sprites.length; index++) {
            this._obstacle._sprites[index].alpha = 0
        }

        window.addEventListener('keydown', this._keyDownHandler.bind(this));
        window.addEventListener('keyup', this._keyUpHandler.bind(this));

        this.progressBarCompletion = document.querySelectorAll('.progress-completion');
        this.looseComponent = new Loose(document.querySelector('.js-section-loose'));
    }

    tick() {
        let playerBounds = this._player.getFakePlayerBounds(),
            obstacleBounds = this._obstacle.getFakeObstacleBounds(),
            isJumping = this._player.isPlayerJumping();

        this._levelDifficulty()
        this._animateProgressBar()
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
            this._endGame()

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
        TweenLite.to(this, 10, {
            gameSpeed: 0, ease: Power3.easeInOut
        })
        setTimeout(() => {
            this._player.playerOutAnimation()
        }, 5000);

        // setInterval(() => {
        //     if (this.gameSpeed > 0 && this.gameSpeed < 0) {
        //         this.gameSpeed -= 0.1
        //     }
        //     if (this.gameSpeed < 0.5) {
        //         this._allowHit = false
        //     }
        // }, 500);
        // if (this.gameSpeed < 0) {
        //     setTimeout(() => {

        //         this.isGameFinished = true
        //     }, 2000);
        // }
    }

    _keyDownHandler(event) {
        switch (event.code) {
            case 'Space':
            case 'ArrowUp':
                this.keyPressed.up = true;
                this._controlsDown._playTween(this._controlsDown.ui.spacebar);
                setTimeout(() => {
                    this._controlsDown.transitionOutKey(this._controlsDown.ui.spacebar);
                }, 1000);
                break;
            case 'ArrowLeft':
                this.keyPressed.left = true;
                this._controlsDown._playTween(this._controlsDown.ui.left);
                setTimeout(() => {
                    this._controlsDown.transitionOutKey(this._controlsDown.ui.left);
                }, 1000);
                break;
            case 'ArrowRight':
                this.keyPressed.right = true;
                this._controlsDown._playTween(this._controlsDown.ui.right);
                setTimeout(() => {
                    this._controlsDown.transitionOutKey(this._controlsDown.ui.right);
                }, 1000);
                break;
        }
        if (this.keyPressed.up && !this.keyPressed.left && !this.keyPressed.right) {
            setTimeout(() => {
                this._controlsDown.transitionInKey(this._controlsDown.ui.left);
                this._controlsDown.transitionInKey(this._controlsDown.ui.right);
            }, 2000);

        }
        if (this.keyPressed.left && this.keyPressed.right && this.keyPressed.up && !this._isWaitingToStart) {
            this._timer.resetTimer();
            this._controlsDown.transitionOut();
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
    }
    _keyUpHandler(e) {
        switch (e.code) {
            case 'Space':
                this._controlsDown._validateControl(this._controlsDown.ui.spacebar);
                break;
            case 'ArrowUp':
                break;
            case 'ArrowLeft':
                this._controlsDown._validateControl(this._controlsDown.ui.left);
                break;
            case 'ArrowRight':
                this._controlsDown._validateControl(this._controlsDown.ui.right);
                break;
        }
    }
    _startGame() {
        this._isGameReadyToStart = true;

        this._countDown.animateOut();

        clearInterval(this.counterInterval)

        for (let index = 0; index < this._obstacle._sprites.length; index++) {
            this._obstacle._sprites[index].alpha = 1
        }
        setTimeout(() => {
            this._allowHit = true;
        }, 2000);

        this._timer.resetTimer();
    }
}


export default GameManager
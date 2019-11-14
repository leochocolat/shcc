import Loose from './Loose';
import Timer from './Timer';
import CountDown from './CountDown';
import ControlsIndications from './ControlsIndications';


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

        this._timer = new Timer()
        this._countDown = new CountDown(document.querySelector('.js-countdown'));
        this._controlsDown = new ControlsIndications(document.querySelector('.js-controlsIndications'));


        this._countDown.setupTweens();

        this._timer.resetTimer();

        for (let index = 0; index < this._obstacle._sprites.length; index++) {
            this._obstacle._sprites[index].alpha = 0
        }

        window.addEventListener('keydown', this._keyPressedHandler.bind(this));

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
        if (this._timer.seconds > 10.00 && this.gameSpeed == 0.8) {
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
        this.gameSpeed = 0
        this.isGameFinished = true
    }

    _keyPressedHandler(event) {
        switch (event.code) {
            case 'Space':
            case 'ArrowUp':
                this.keyPressed.up = true;
                break;
            case 'ArrowLeft':
                this.keyPressed.left = true;
                break;
            case 'ArrowRight':
                this.keyPressed.right = true;
                break;
        }
        if (this.keyPressed.left && this.keyPressed.right && this.keyPressed.up && !this._isWaitingToStart) {
            this._timer.resetTimer();
            this._countDown.animateIn();
            this._isWaitingToStart = true;


            let counter = 3;
            this.counterInterval = setInterval(() => {
                counter--;

                this._countDown.updateContent(counter);
            }, 1000)

            setTimeout(() => {
                this._startGame();
            }, 4000);
        }
    }
    _startGame() {
        this._isGameReadyToStart = true;
        this._countDown.animateOut();
        clearInterval(this.counterInterval)

        for (let index = 0; index < this._obstacle._sprites.length; index++) {
            this._obstacle._sprites[index].alpha = 1
        }
        this._allowHit = true

        this._timer.resetTimer();
    }
}

export default GameManager
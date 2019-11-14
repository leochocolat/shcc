import _ from 'underscore';
import { TimelineLite, TweenLite, Power1 } from 'gsap';
import checkIcon from '../../check-icon.png';

class ControlsIndications {
    constructor(el) {
        _.bindAll(this, '_keyDownHandler', '_keyUpHandler')

        this.el = el;

        this.ui = { 
            spacebar: this.el.querySelector('.js-key-spacebar'),
            left: this.el.querySelector('.js-key-left'),
            right: this.el.querySelector('.js-key-right'),
        }

        this._setup();
    }

    _setup() {
        this._setupEventListeners();
    }

    _playTween(el) {
        const TRANSLATEX = 10 * Math.cos((Math.PI * 30.75) / 180);
        const TRANSLATEY = 10 * Math.cos((Math.PI * 30.75) / 180);
        const DURATION = 0.3; 
        const EASE = Power3.easeOut;

        let boxTop = el.querySelector('.js-box-top');
        let boxRight = el.querySelector('.js-box-right');

        TweenLite.to(el, DURATION, { x: TRANSLATEX, y: -TRANSLATEY, ease: EASE });
    }

    _validateControl(el) {
        const DURATION = 0.2; 
        const EASE = Power3.easeOut;

        let boxTop = el.querySelector('.js-box-top');
        let boxRight = el.querySelector('.js-box-right');
        let content = el.querySelector('.js-key-content');
        let check = el.querySelector('.js-image-check');


        let timeline = new TimelineLite();

        timeline.to(boxTop, DURATION, { backgroundColor: '#33CC3C', ease: EASE }, 0);
        timeline.to(boxRight, DURATION, { backgroundColor: '#29B236', ease: EASE }, 0);
        timeline.to(el, DURATION, { x: '0%', y: '0%', backgroundColor: '#229931', ease: EASE }, 0);

        if (el.classList.contains('isChecked')) return;
        el.classList.add('isChecked');

        timeline.to(el, .5, { x: '0%', y: '0%', backgroundColor: '#229931', ease: EASE }, 0);

        timeline.to(content, .5, { y: '-100%', ease: Power3.easeInOut, onComplete: () => {
            content.querySelector('span').style.display = 'none';
            check.style.display = 'initial';
            timeline.fromTo(content, .5, { y: '100%' }, { y: '0%', ease: Power3.easeInOut });
        } }, DURATION);
    }

    _setupEventListeners() {
        window.addEventListener('keydown', this._keyDownHandler);
        window.addEventListener('keyup', this._keyUpHandler);
    }

    _keyDownHandler(e) {
        switch (e.code) {
            case 'Space':
                this._playTween(this.ui.spacebar);
                break;
            case 'ArrowUp':
                break;
            case 'ArrowLeft':    
                this._playTween(this.ui.left);
                break;
            case 'ArrowRight':
                this._playTween(this.ui.right);
                break;
        }
    }

    _keyUpHandler(e) {
        switch (e.code) {
            case 'Space':
                this._validateControl(this.ui.spacebar);
                break;
            case 'ArrowUp':
                break;
            case 'ArrowLeft':    
                this._validateControl(this.ui.left);
                break;
            case 'ArrowRight':
                this._validateControl(this.ui.right);
                break;
        }
    }


}

export default ControlsIndications;
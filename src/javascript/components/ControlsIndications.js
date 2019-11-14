import _ from 'underscore';
import { TimelineLite, TweenLite, Power1, Power3, TweenMax } from 'gsap';

class ControlsIndications {
    constructor(el) {
        _.bindAll(this, '_keyDownHandler', '_keyUpHandler')

        this.el = el;

        this.ui = {
            title: this.el.querySelector('.js-title'),
            spacebar: this.el.querySelector('.js-key-spacebar'),
            left: this.el.querySelector('.js-key-left'),
            right: this.el.querySelector('.js-key-right'),
            contentContainer: this.el.querySelector('.js-content-container'),
            content: this.el.querySelector('.js-content')
        }

        this._setup();
    }

    _setup() {
        this._setupTransitionTween();

        TweenLite.set(this.ui.left, { autoAlpha: 0 });
        TweenLite.set(this.ui.right, { autoAlpha: 0 });
        TweenLite.set(this.ui.spacebar, { autoAlpha: 0 });

        setTimeout(() => {
            this.transitionIn();

            setTimeout(() => {
                this.transitionInKey(this.ui.spacebar);
                setTimeout(() => {
                    this.transitionOutKey(this.ui.spacebar);
                }, 1000)
            }, 1000)
            setTimeout(() => {
                this.transitionInKey(this.ui.left);
                this.transitionInKey(this.ui.right);
                setTimeout(() => {
                    // this.transitionOutKey(this.ui.left);
                    // this.transitionOutKey(this.ui.right);
                }, 1000)
            }, 2000)
            setTimeout(() => {
                setTimeout(() => {
                    this.transitionOut();
                }, 1000)
            }, 3000)
        }, 2000);

        this._setupEventListeners();
    }

    _setupTransitionTween() {
        const TRANSLATE = 1000;
        const INTERVAL = 0.1;
        const DURATION = 1;

        this.timelineIn = new TimelineLite({ paused: true });

        this.timelineIn.fromTo(this.ui.contentContainer, DURATION, { height: 0 }, { height: '100%', ease: Power3.easeInOut }, INTERVAL * 0);
        this.timelineIn.fromTo(this.ui.title, DURATION, { y: TRANSLATE }, { y: 0, ease: Power3.easeInOut }, INTERVAL * 1);

        this.timelineOut = new TimelineLite({ paused: true });

        this.timelineOut.fromTo(this.ui.title, DURATION, { y: 0 }, { y: -TRANSLATE, ease: Power3.easeInOut }, INTERVAL * 0);
        this.timelineOut.fromTo(this.ui.contentContainer, DURATION, { height: '100%' }, { height: 0, ease: Power3.easeInOut }, INTERVAL * 4);
    }

    transitionIn() {
        this.timelineIn.play();
    }

    transitionOut() {
        this.timelineOut.play();
    }

    transitionInKey(el) {
        const TRANSLATE = 1000;
        const DURATION = 1;

        TweenLite.fromTo(el, DURATION, { y: TRANSLATE }, { y: 0, ease: Power3.easeInOut });
        TweenLite.set(el, { autoAlpha: 1 });
    }

    transitionOutKey(el) {
        const TRANSLATE = 1000;
        const DURATION = 1;

        TweenLite.fromTo(el, DURATION, { y: 0 }, { y: -TRANSLATE, ease: Power3.easeInOut, onUpdate: () => {
            if (el.getBoundingClientRect().y < 0) {
                TweenLite.set(el, { autoAlpha: 0 });
            }
        } });
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
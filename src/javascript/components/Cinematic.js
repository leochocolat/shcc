import bindAll from '../utils/bindAll';
import SizeUtils from '../utils/SizeUtils';
import { TimelineLite, Power4, TweenLite } from 'gsap';

class Cinematic {
    constructor() {
        this.el = document.querySelector('.js-cinematic');

        this.ui = {
            video: this.el.querySelector('video'),
            backgroundTransitionContainer: document.querySelector('.js-bgContainer'),
            backgroundTransitionRed: document.querySelector('.js-bgContainer-red'),
            backgroundTransitionWhite: document.querySelector('.js-bgContainer-white'),
        }

        bindAll(
            this,
            '_resizeHandler'
        );

        this._setup();
    }

    transitionIn() {
        let timeline = new TimelineLite();

        timeline.set(this.ui.backgroundTransitionContainer, { autoAlpha: 1 }, 0);
        timeline.fromTo(this.ui.backgroundTransitionWhite, 1.6, { x: '0%' }, { x: '-200%', ease: Power4.easeInOut }, 0);
        timeline.fromTo(this.ui.backgroundTransitionRed, 1.6, { x: '0%' }, { x: '-200%', ease: Power4.easeInOut }, 0.1);
        timeline.set(this.el, { autoAlpha: 1 }, 0.8);
    }

    transitionOut() {
        TweenLite.set(this.el, { autoAlpha: 0 });
    }

    play() {
        return new Promise(resolve => {
            this.ui.video.play();
            this.ui.video.addEventListener('ended', () => {
                resolve();
                // let timeline = new TimelineLite();

                // timeline.fromTo(this.ui.backgroundTransitionWhite, 1.6, { x: '0%' }, { x: '-200%', ease: Power4.easeInOut }, 0);
                // timeline.fromTo(this.ui.backgroundTransitionRed, 1.6, { x: '0%' }, { x: '-200%', ease: Power4.easeInOut }, 0.1);
                // timeline.set(this.el, { autoAlpha: 0 }, 0.8);
            });
        })
    }

    _setup() {
        this._resize();
        this._setupEventListeners();
    }

    _resize() {
        this._width = window.innerWidth;
        this._height = window.innerHeight;

        let sizes = SizeUtils.getSize(
            this._width,
            this._height,
            this.ui.video.videoWidth,
            this.ui.video.videoHeight,
            SizeUtils.COVER
        );

        console.log(this.ui.video.videoWidth);
        console.log(this.ui.video.videoHeight);

        this.ui.video.style.height = `${sizes.height}'px`;
        this.ui.video.style.width = `${sizes.width}px`;
        this.ui.video.style.left = `${sizes.x}px`;
        this.ui.video.style.top = `${sizes.y}px`;
    }

    _setupEventListeners() {
        window.addEventListener('resize', this._resizeHandler)
    }

    _resizeHandler() {

    }
}

export default Cinematic;
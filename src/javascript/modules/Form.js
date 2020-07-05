import { TweenLite, TimelineLite } from "gsap";

const ACTIONURL = 'https://leomouraire.us5.list-manage.com/subscribe/post?u=865e089434b6e7d78112f0878&amp;id=4a0729be21';

class Form {
    constructor(el) {
        this.el = el;

        this.form = this.el.querySelector('.js-form') 

        this.ui = {
            backgroundTransitionContainer: document.querySelector('.js-bgContainer'),
            backgroundTransitionRed: document.querySelector('.js-bgContainer-red'),
            backgroundTransitionWhite: document.querySelector('.js-bgContainer-white'),
        } 

        this._setup();
    }

    _setup() {
        this.form.action = ACTIONURL;
    }

    transitionIn() {
        let timeline = new TimelineLite();

        timeline.set(this.ui.backgroundTransitionContainer, { autoAlpha: 1 }, 0);
        timeline.fromTo(this.ui.backgroundTransitionWhite, 1.6, { x: '0%' }, { x: '-200%', ease: Power4.easeInOut }, 0);
        timeline.fromTo(this.ui.backgroundTransitionRed, 1.6, { x: '0%' }, { x: '-200%', ease: Power4.easeInOut }, 0.1);
        timeline.set(this.el, { autoAlpha: 1, display: 'block' }, 0.8);
    } 
}

export default Form;
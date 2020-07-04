import _ from 'underscore';
import { TimelineLite, Power0, TweenMax } from "gsap";

class Loose {
    constructor(el) {
        _.bindAll(this, '_onCompleteHandler')

        this.el = el;
        
        this.ui = {
            container: this.el.querySelector('.js-loose-container'),
            heading: this.el.querySelector('.js-heading'),
            subheading: this.el.querySelector('.js-subheading'),
            shadow: this.el.querySelector('.js-shadow'),
            backgroundTransition: document.querySelector('.js-bgContainer'),
            boxTop: this.el.querySelector('.js-box-top'),
            boxRight: this.el.querySelector('.js-box-right'),
        }

        this._setup();
    }

    _setup() {
        this.timeline = new TimelineLite({ paused: true, onComplete: this._onCompleteHandler });
        this.timeline.timeScale(1.5);

        TweenMax.set(this.el, { display: 'flex' });

        this.timeline.fromTo(this.el, .5, { height: 0 }, { height: '100%', ease: Power3.easeOut }, 0);
        
        this.timeline.fromTo(this.ui.container, 1.5, { scaleY: 0 }, { scaleY: 1, ease: Power3.easeOut }, 0.5);
        this.timeline.fromTo(this.ui.heading, 1.5, { y: 500 }, { y: 0, ease: Power3.easeOut }, 0.5);
        this.timeline.fromTo(this.ui.subheading, 1.5, { y: 300 }, { y: 0, ease: Power3.easeOut }, 0.5);

        this.timeline.fromTo(this.ui.boxTop, 1, { height: '0%' }, { height: '100%', ease: Power3.easeOut }, 1.4);
        this.timeline.fromTo(this.ui.boxRight, 1, { width: '0%' }, { width: '62%', ease: Power3.easeOut }, 1.4);

        this.timeline.fromTo(this.ui.heading, 0.5, { scale: .98 }, { scale: 1, ease: Power3.easeOut }, 1.5);
        this.timeline.fromTo(this.ui.shadow, 0.5, { x: 0, y: 0 }, { x: -5, y: 5, ease: Power3.easeOut }, 1.5);

        this.timeline.to(this.ui.boxTop, 0.5, { height: 0, ease: Power3.easeOut }, 2.3);
        this.timeline.to(this.ui.boxRight, 0.5, { width: 0, ease: Power3.easeOut }, 2.3);

        this.timeline.to(this.el, 1, { top: 0, height: '0%', y: '-10%', ease: Power3.easeOut }, 2.5);
        this.timeline.to(this.ui.container, .5, { y: '-100%', ease: Power3.easeOut }, 2.7);

        //debug
        // this.timeline.progress(0.5);
    }

    animate() {
        // this.timeline.restart();
        // this.timeline.play();
    }
    
    _onCompleteHandler() {
    }
    
    
}

export default Loose;
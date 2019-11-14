import { TimelineLite, Power3, TweenLite, TweenMax } from "gsap";

class CountDown {
    constructor(el) {
        this.el = el;

        this.ui = {
            content: this.el.querySelector('.js-countdown-content'),
            boxContainer: this.el.querySelector('.js-box-container'),
            boxTop: this.el.querySelector('.js-box-top'),
            boxRight: this.el.querySelector('.js-box-right'),
        };

        // this.velocity.x = this._wallProperties.speed * Math.cos((Math.PI * 30.75) / 180);
        // this.velocity.y = this._wallProperties.speed * Math.sin((Math.PI * 30.75) / 180);

    }

    setupTweens() {
        const TRANSLATE = 1500;
        const TRANSLATEOUT = 3000;

        this.timelineIn = new TimelineLite({ paused: true });
        this.timelineIn.timeScale(1.2);

        this.timelineIn.fromTo(this.ui.boxContainer, 1, { x: TRANSLATE * Math.cos((Math.PI * 30.75) / 180), y: -TRANSLATE * Math.sin((Math.PI * 30.75) / 180) }, { x: 0, y: 0, ease: Power4.easeOut }, 0);
        this.timelineIn.fromTo(this.ui.boxTop, 0.5, { scaleY: 10 }, { scaleY: 0.25, ease: Power3.easeOut }, 0.3);
        this.timelineIn.fromTo(this.ui.boxRight, 0.5, { scaleX: 7.5 }, { scaleX: 0.41, ease: Power3.easeOut }, 0.3);

        this.timelineOut = new TimelineLite({ paused: true, onComplete: () => { this.ui.boxContainer.style.display = 'none' } });
        this.timelineOut.timeScale(1.2);

        this.timelineOut.to(this.ui.boxContainer, 1, { x: -TRANSLATEOUT * Math.cos((Math.PI * 30.75) / 180), y: TRANSLATEOUT * Math.sin((Math.PI * 30.75) / 180), ease: Power3.easeIn }, 0);
        this.timelineOut.to(this.ui.boxTop, .8, { scaleY: 10, ease: Power3.easeOut });
        this.timelineOut.to(this.ui.boxRight, .8, { scaleX: 7.5, ease: Power3.easeOut });
    }

    animateIn() {
        this.timelineIn.play();
    }

    animateOut() {
        this.timelineOut.play();
    }

    updateContent(content) {
        TweenLite.to(this.ui.content, .3, {
            y: -100, onComplete: () => {
                this.ui.content.innerHTML = content;
                TweenLite.fromTo(this.ui.content, .3, { y: 100 }, { y: 0 });
            }
        })
    }

}

export default CountDown;
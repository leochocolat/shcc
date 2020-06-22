import { TweenLite } from "gsap";

const ACTIONURL = 'https://leomouraire.us5.list-manage.com/subscribe/post?u=865e089434b6e7d78112f0878&amp;id=4a0729be21';

class Form {
    constructor(el) {
        this.el = el;

        this.form = this.el.querySelector('.js-form') 
        this._setup();
    }

    _setup() {
        this.form.action = ACTIONURL;
    }

    transitionIn() {
        TweenLite.set(this.el, { display: 'block' });
        TweenLite.to(this.el, .5, { autoAlpha: 1 });
    } 


}

export default Form;
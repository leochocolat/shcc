import SelectPlayer from './components/SelectPlayer';
import TextureLoader from './modules/TextureLoader'
import Pixi from './components/Pixi';
import CountDown from './components/CountDown';

document.addEventListener('DOMContentLoaded', () => {
    new SelectPlayer()
    // ._selectPlayer(0)

    new CountDown(document.querySelector('.js-countdown'));
});
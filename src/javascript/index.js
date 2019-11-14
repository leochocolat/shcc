import SelectPlayer from './components/SelectPlayer';
import TextureLoader from './modules/TextureLoader'
import Pixi from './components/Pixi';
import CountDown from './components/CountDown';
import ControlsIndications from './components/ControlsIndications';

document.addEventListener('DOMContentLoaded', () => {
    new SelectPlayer()
    ._selectPlayer(0)

    new CountDown(document.querySelector('.js-countdown'));
    new ControlsIndications(document.querySelector('.js-controlsIndications'));
});
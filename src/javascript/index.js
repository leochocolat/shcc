import SelectPlayer from './components/SelectPlayer';

let width, height;
let orientationMessage = document.querySelector('.js-orientation-message');

document.addEventListener('DOMContentLoaded', () => {
    setup();
});

function setup() {
    new SelectPlayer();
    checkSize();
    setupEventListeners();
}

function checkSize() {
    width = window.innerWidth;
    height = window.innerHeight;

    if (width < height) {
        displayOrientationMessage();
    } else {
        removeOrientationMessage();
    }
}

function displayOrientationMessage() {
    if (!orientationMessage.classList.contains('isDisable')) return;

    orientationMessage.classList.remove('isDisable');
}

function removeOrientationMessage() {
    if (orientationMessage.classList.contains('isDisable')) return;
    
    orientationMessage.classList.add('isDisable');
}

function setupEventListeners() {
    window.addEventListener('orientationchange', orientationchangeHandler);
}

function orientationchangeHandler(e) {
    window.addEventListener('resize', resizeOrientationHandler);
}

function resizeOrientationHandler() {
    checkSize();
    window.removeEventListener('resize', resizeOrientationHandler);
}
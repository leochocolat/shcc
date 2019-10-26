import _ from 'underscore';

class ControlsManager {
    constructor() {
        _.bindAll(this, '_keyDownHandler')
        this._setup();
    }

    _setup() {
        this._createEvents();
        this._setupEventListeners();
    }

    _createEvents() {
        
    }

    _setupEventListeners() {
        window.addEventListener('keydown', this._keyDownHandler)
    }

    _keyDownHandler(e) {

    }
}

export default ControlsManager;
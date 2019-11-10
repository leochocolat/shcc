class TimerBox {
    constructor(canvas) {
        this._canvas = canvas
        this._timerBoxContainer = new PIXI.Container();
        this._timerBoxProperties = {
            width: 500,
            height: 300,
            degrees: Math.PI * 30.75 / 180
        }
        this._createTimerBoxTop()
        this._createTimerBoxFront()
        this._createTimerBoxRight()

    }
    _createTimerBoxTop() {
        this._timerBoxGraphicTop = new PIXI.Graphics();
        this._timerBoxGraphicTop.beginFill(0xf74041);
        this._timerBoxGraphicTop.drawRect(0, 0, this._timerBoxProperties.width * 2, this._timerBoxProperties.height);
        this._timerBoxGraphicTop.position.x = (this._canvas.width - this._timerBoxProperties.width - 51.5)
        this._timerBoxGraphicTop.position.y = (this._canvas.height - this._timerBoxProperties.height - 51.5)
        this._timerBoxGraphicTop.transform.skew.x = this._timerBoxProperties.degrees;
    }
    _createTimerBoxFront() {
        this._timerBoxGraphicFront = new PIXI.Graphics();
        this._timerBoxGraphicFront.beginFill(0x832324);
        this._timerBoxGraphicFront.drawRect(0, 0, this._timerBoxProperties.width, this._timerBoxProperties.height);
        this._timerBoxGraphicFront.position.x = (this._canvas.width - this._timerBoxProperties.width + 103)
        this._timerBoxGraphicFront.position.y = (this._canvas.height - this._timerBoxProperties.height + 205)
        this._timerBoxGraphicFront.rotation = Math.PI
        this._timerBoxGraphicFront.transform.skew.x = this._timerBoxProperties.degrees;
        this._timerBoxGraphicFront.transform.skew.y = -this._timerBoxProperties.degrees * Math.PI / 2.18;

    }
    _createTimerBoxRight() {
        this._timerBoxGraphicRight = new PIXI.Graphics();
        this._timerBoxGraphicRight.beginFill(0x8f2626);
        this._timerBoxGraphicRight.drawRect(0, 0, this._timerBoxProperties.width, this._timerBoxProperties.height * 2);
        this._timerBoxGraphicRight.position.x = (this._canvas.width - this._timerBoxProperties.width + 103)
        this._timerBoxGraphicRight.position.y = (this._canvas.height - this._timerBoxProperties.height + 205)
        this._timerBoxGraphicRight.transform.skew.x = -this._timerBoxProperties.degrees * Math.PI / 2.115;
        this._addGraphics()
    }
    _addGraphics() {
        this._timerBoxContainer.addChild(this._timerBoxGraphicTop);
        this._timerBoxContainer.addChild(this._timerBoxGraphicRight);
        this._timerBoxContainer.addChild(this._timerBoxGraphicFront);
        this._timerBoxContainer.position.x += this._canvas.width / 18
        this._timerBoxContainer.position.y += this._canvas.width / 18
    }
    drawTimerBox() {
        return this._timerBoxContainer
    }
}
export default TimerBox;
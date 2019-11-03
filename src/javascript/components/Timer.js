class Timer {
    constructor(stage) {
        this._stage = stage;
        this.startTime = Date.now();
        this.seconds = 0;
        const style = new PIXI.TextStyle();
        this.timerText = new PIXI.Text('0', style);
        style.dropShadow = true
        style.dropShadowAlpha = 0.3
        style.dropShadowAngle = Math.PI / 8
        style.dropShadowDistance = 2
        style.fill = 'white'
        style.fontFamily = 'Krungthep'
        this.timerText.position.set(window.innerWidth - 320, window.innerHeight - 250);
        this.timerText.transform.skew.y = 0.125
        this.timerText.scale.set(2.5, 2.5);
    }

    getDeltaTime() {
        let elapsedTime = Date.now() - this.startTime;
        let seconds = (elapsedTime / 1000).toFixed(2)
        this.timerText.text = `${seconds}s`
        return seconds
    }
    drawTimer() {
        return this.timerText
    }

    stopTimer() {
        clearInterval(this.interval);
    }
}
export default Timer;
class Timer {
    constructor(stage) {
        this._stage = stage;
        this.startTime = Date.now();
        this.seconds = 0;
        let degrees = Math.PI * 30.75 / 180
        const style = new PIXI.TextStyle();
        this.timerText = new PIXI.Text('0', style);
        style.dropShadow = true
        style.dropShadowAlpha = 0.2
        this.timerText.position.set(window.innerWidth - 150, window.innerHeight - 150);
        this.timerText.transform.skew.y = degrees / 2
        this.timerText.alpha = 1;
        this.timerText.scale.set(1.5, 1.5);
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
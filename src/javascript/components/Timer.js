class Timer {
    constructor() {
        this.initTimerValues();
    }
    initTimerValues() {
        this.startTime = Date.now();
        this.seconds = 0;
    }
    getDeltaTime() {
        this.elapsedTime = Date.now() - this.startTime;
        this.seconds = (this.elapsedTime / 1000).toFixed(2)
        document.querySelector('.timer-value').innerHTML = `${this.seconds}s`
        return this.seconds
    }
    drawTimer() {
        return this.timerText
    }
    animateProgressBar() {
        // console.log(this.seconds)
    }
    resetTimer() {
        this.initTimerValues();
        this.getDeltaTime();
    }
}
export default Timer;
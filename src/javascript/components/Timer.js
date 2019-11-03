class Timer {
    constructor() {
        const timerContainer = document.querySelector('.infos__timer')
        this.timer = timerContainer.querySelector('.timer-value');
        this.shadowTimer = this.timer.cloneNode(true)
        timerContainer.appendChild(this.shadowTimer)
        this.shadowTimer.classList.add('shadow-timer')
        this.startTime = Date.now();
        this.seconds = 0;
    }

    getDeltaTime() {
        let elapsedTime = Date.now() - this.startTime;
        this.seconds = (elapsedTime / 1000).toFixed(2)
        this.timer.innerHTML = `${this.seconds}s`;
        this.shadowTimer.innerHTML = this.timer.innerHTML
        return this.seconds
    }

    stopTimer() {
        clearInterval(this.interval);
    }
}
export default Timer;
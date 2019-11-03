class Road {
    constructor(canvas) {
        this._canvas = canvas

        this._roadProperties = {
            x: -100,
            y: window.innerHeight + 50,
            height: 350,
            linesPadding: 100,
            linesAmount: 20,
            linesWidth: 45,
            linesHeight: 15
        }

        this._settings = {
            speed: 7
        }

        this._roadContainer = new PIXI.Container();
        this.createRoad()
    }

    createRoad() {
        const degrees = Math.PI * 30.75 / 180

        this._road = new PIXI.Graphics();
        this._road.beginFill(0xC6C6C6);
        this._road.drawRect(0, 0, this._canvas.width * 4, this._roadProperties.height);
        this._roadContainer.addChild(this._road);

        this._borderRoadLeft = new PIXI.Graphics();
        this._borderRoadLeft.beginFill(0x666666);
        this._borderRoadLeft.drawRect(0, 0, this._canvas.width * 4, 10);
        this._roadContainer.addChild(this._borderRoadLeft);

        this._borderRoadRight = new PIXI.Graphics();
        this._borderRoadRight.beginFill(0x666666);
        this._borderRoadRight.drawRect(0, this._roadProperties.height + 100, this._canvas.width * 4, 10);
        this._roadContainer.addChild(this._borderRoadRight);

        this._roadLinesContainer = new PIXI.Container();

        for (let i = 0; i < this._roadProperties.linesAmount; i++) {
            let roadLine = new PIXI.Graphics();
            roadLine.beginFill(0xFFFFFF);
            roadLine.drawRect(0, 0, this._roadProperties.linesWidth, this._roadProperties.linesHeight);
            roadLine.transform.skew.x = degrees;
            roadLine.transform.position.x = i * this._roadProperties.linesPadding
            roadLine.transform.position.y = (this._roadProperties.height / 2) - (this._roadProperties.linesHeight / 2)
            this._roadLastPositionX = i * this._roadProperties.linesPadding;
            this._roadLinesContainer.addChild(roadLine);
        }

        this._roadContainer.addChild(this._roadLinesContainer);
    }

    updateRoadLinesPosition(speed, deltaTime) {
        for (let i = 0; i < this._roadLinesContainer.children.length; i++) {
            this._roadLinesContainer.children[i].position.x += speed * -1 * deltaTime;
            if (this._roadLinesContainer.children[i].position.x < 0) {
                this._roadLinesContainer.children[i].position.x = this._roadLastPositionX + this._roadProperties.linesPadding;
            }
        }
    }

    drawRoad() {
        return this._roadContainer
    }
}
export default Road
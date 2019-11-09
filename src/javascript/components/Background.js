class Background {
  constructor(canvas, resources) {
    this._canvas = canvas;
    this._resources = resources;

    this._wallProperties = {
      x: this._canvas.width * 1.9,
      y: -this._canvas.height * 2,
      height: 2050,
      padding: 400,
      degrees: Math.PI * 30.75 / 180
    };

    this.velocity = {};

    this.setup();
  }

  setup() {
    this._buildingsContainer = new PIXI.Container();
    this._buildingsContainer.transform.skew.x = - this._wallProperties.degrees / 1.45;

    this._createAnimatedBackground();
  }

  _createAnimatedBackground() {
    this._textures = [];
    for (let i in this._resources.textures) {
      this._textures.push(this._resources.textures[i]);
    }

    this._buildings = [];

    let limit = 5;
    for (let i = 0; i < limit; i++) {
      let building = new PIXI.extras.AnimatedSprite(this._textures);

      building.gotoAndStop(Math.round(Math.random() * this._textures.length));

      let ratio = building.width / building.height;
      this._wallProperties.width = this._wallProperties.height * ratio;

      building.rotation = this._wallProperties.degrees;

      building.position.x = this._canvas.width - this._wallProperties.padding * i;
      building.position.y = - this._canvas.height / 2;

      this._buildings.push(building);
      this._buildingsContainer.addChild(building);
    }
  }

  updateBackgroundPosition(speed, deltaTime) {
    for (let i = 0; i < this._buildingsContainer.children.length; i++) {
      this._buildingsContainer.children[i].transform.position.x += - speed * deltaTime;
      if (this._buildingsContainer.children[i].position.x + this._wallProperties.width < 0) {
        this._buildingsContainer.children[i].gotoAndStop(Math.round(Math.random() * this._textures.length));
        // this._buildingsContainer.children[i].transform.position.x = this._buildingsContainer.position.x + this._buildingsContainer.width / 2;
        this._buildingsContainer.children[i].transform.position.x = this._canvas.width * 1.5;
      }
    }
  }

  drawBackground() {
    return this._buildingsContainer;
  }
}
export default Background;

class Background {
  constructor(canvas, resources) {
    this._canvas = canvas;
    this._resources = resources;

    this._wallProperties = {
      x: this._canvas.width * 1.9,
      y: -this._canvas.height * 1.8,
      height: 750,
      padding: 400,
      degrees: Math.PI * 30.75 / 180
    };

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

      building.width = this._wallProperties.width;
      building.height = this._wallProperties.height;

      building.rotation = this._wallProperties.degrees;

      building.position.x = (this._canvas.width / 2) + this._wallProperties.padding * (1 + i);
      // building.position.x = this._canvas.width - this._wallProperties.padding * i;
      building.position.y = - this._canvas.height / 1.8;

      this._buildings.push(building);
      this._buildingsContainer.addChildAt(building, 0);
    }
  }

  updateBackgroundPosition(speed, deltaTime) {
    for (let i = 0; i < this._buildingsContainer.children.length; i++) {
      this._buildingsContainer.children[i].transform.position.x += - speed * deltaTime;
      if (this._buildingsContainer.children[i].position.x < 0) {
        this._buildingsContainer.children[i].gotoAndStop(Math.round(Math.random() * this._textures.length));
        this._buildingsContainer.children[i].transform.position.x = this._buildingsContainer.position.x + this._buildingsContainer.width - this._wallProperties.padding;
        let building = this._buildingsContainer.children[i];
        this._buildingsContainer.removeChild(this._buildingsContainer.children[i]);
        this._buildingsContainer.addChildAt(building, 0);
      }
    }
  }

  _removeChilds() {
    
  }

  drawBackground() {
    this._removeChilds();

    return this._buildingsContainer;
  }
}
export default Background;

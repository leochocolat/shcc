class Buildings {
  constructor(canvas, resources) {
    this._canvas = canvas;
    this._resources = resources;

    this._buildingsProperties = {
      x: this._canvas.width * 1.9,
      y: 100,
      height: 750,
      padding: 400,
      degrees: Math.PI * 30.75 / 180
    };

    this.setup();
  }

  setup() {
    this._buildingsContainer = new PIXI.Container();
    this._buildingsContainer.transform.skew.x = - this._buildingsProperties.degrees / 1.45;

    this._createBuildings();
  }

  _createBuildings() {
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

      this._buildingsProperties.width = this._buildingsProperties.height * ratio;

      building.width = this._buildingsProperties.width;
      building.height = this._buildingsProperties.height;

      building.rotation = this._buildingsProperties.degrees;

      building.position.x = (this._canvas.width / 2) + this._buildingsProperties.padding * (1 + i);
      building.position.y = this._buildingsProperties.y - building.height;

      this._buildings.push(building);
      this._buildingsContainer.addChildAt(building, 0);
    }
  }

  updateBuildingsPosition(speed, deltaTime) {
    for (let i = 0; i < this._buildingsContainer.children.length; i++) {
      this._buildingsContainer.children[i].transform.position.x += - speed * deltaTime;
      if (this._buildingsContainer.children[i].position.x < 0) {
        this._buildingsContainer.children[i].gotoAndStop(Math.round(Math.random() * this._textures.length));
        this._buildingsContainer.children[i].transform.position.x = this._buildingsContainer.position.x + this._buildingsContainer.width - this._buildingsProperties.padding;
        let building = this._buildingsContainer.children[i];
        this._buildingsContainer.removeChild(this._buildingsContainer.children[i]);
        this._buildingsContainer.addChildAt(building, 0);
      }
    }
  }

  drawBuildings() {
    return this._buildingsContainer;
  }
}
export default Buildings;

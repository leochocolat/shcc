class Background {
  constructor(canvas, resources) {
    this._canvas = canvas;
    this._resources = resources;

    this._wallProperties = {
      x: this._canvas.width * 1.9,
      y: -this._canvas.height * 2,
      height: 850,
      speed: 7,
      padding: 400
    };

    this.velocity = {};

    this.setup();
  }

  setup() {
    this._buildingsContainer = new PIXI.Container();
    // this._buildingsContainer.transform.skew.x = - Math.PI * 30.75 / 180;
    // this._buildingsContainer.rotation = Math.PI * 30.75 / 180;
    this._createAnimatedBackground();
  }

  _createAnimatedBackground() {
    this._textures = [];
    for (let i in this._resources.textures) {
      this._textures.push(this._resources.textures[i]);
    }
  }

  setup() {
    this._buildingsContainer = new PIXI.Container();
    this._createAnimatedBackground();
  }

  _createAnimatedBackground() {
    this._textures = [];
    for (let i in this._resources.textures) {
      this._textures.push(this._resources.textures[i]);
    }
  }

  setup() {
    this._buildingsContainer = new PIXI.Container();
    this._createAnimatedBackground();
  }

  _createAnimatedBackground() {
    this._textures = [];
    for (let i in this._resources.textures) {
      this._textures.push(this._resources.textures[i]);
    }

    this._buildings = [];

    let limit = 9;
    for (let i = 0; i < limit; i++) {
      let building = new PIXI.extras.AnimatedSprite(this._textures);
      building.gotoAndStop(Math.round(Math.random() * this._textures.length));

      let ratio = building.width / building.height;
      this._wallProperties.width = this._wallProperties.height * ratio;

      building.position.x = this._wallProperties.x - this._wallProperties.padding * i * Math.cos((Math.PI * 30.75) / 180);
      building.position.y = this._wallProperties.y + this._wallProperties.padding * i * Math.sin((Math.PI * 30.75) / 180);

      building.position.x =
        this._wallProperties.x -
        this._wallProperties.padding * i * Math.cos((Math.PI * 30.75) / 180);
      building.position.y =
        this._wallProperties.y +
        this._wallProperties.padding * i * Math.sin((Math.PI * 30.75) / 180);

      this._buildings.push(building);
      this._buildingsContainer.addChild(building);
    }
  }

  updateBackgroundPosition(speed, deltaTime) {
    this.velocity.x = speed * Math.cos((Math.PI * 30.75) / 180);
    this.velocity.y = speed * Math.sin((Math.PI * 30.75) / 180);

    for (let i = 0; i < this._buildingsContainer.children.length; i++) {
      this._buildingsContainer.children[i].transform.position.x += -this.velocity.x * deltaTime;
      this._buildingsContainer.children[i].transform.position.y += this.velocity.y * deltaTime;

      if (this._buildingsContainer.children[i].position.x + this._wallProperties.width < 0) {
        this._buildingsContainer.children[i].gotoAndStop(Math.round(Math.random() * this._textures.length));
        this._buildingsContainer.children[i].position.x = this._wallProperties.x;
        this._buildingsContainer.children[i].position.y = this._wallProperties.y;
      }
    }
  }

  drawBackground() {
    return this._buildingsContainer;
  }
}
export default Background;

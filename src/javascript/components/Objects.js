class Objects {
    constructor(canvas, resources) {
      this._canvas = canvas;
      this._resources = resources;
  
      this._objectsProperties = {
        x: this._canvas.width,
        y: -150,
        scale: 0.6,
        padding: this._canvas.width * 0.5,
        degrees: Math.PI * 30.75 / 180
      };
  
      this.setup();
    }
  
    setup() {
      this._objectsContainer = new PIXI.Container();
      this._objectsContainer.transform.skew.x = - this._objectsProperties.degrees / 1.45;
  
      this._createObjects();
    }
  
    _createObjects() {
      this._textures = [];
      for (let i in this._resources.textures) {
        this._textures.push(this._resources.textures[i]);
      }
  
      this._buildings = [];
  
      let limit = 3;
  
      for (let i = 0; i < limit; i++) {
        let object = new PIXI.extras.AnimatedSprite(this._textures);
  
        object.gotoAndStop(Math.round(Math.random() * this._textures.length));
  
        object.width = object.width * this._objectsProperties.scale;
        object.height = object.height * this._objectsProperties.scale;
  
        object.rotation = this._objectsProperties.degrees;
  
        object.position.x = this._canvas.width + this._objectsProperties.padding * i;
        object.position.y = this._objectsProperties.y;
  
        this._buildings.push(object);
        this._objectsContainer.addChildAt(object, 0);
      }
    }
  
    updateObjectsPosition(speed, deltaTime) {
      for (let i = 0; i < this._objectsContainer.children.length; i++) {
        this._objectsContainer.children[i].transform.position.x += - speed * deltaTime;
        if (this._objectsContainer.children[i].position.x < 0) {
            this._objectsContainer.children[i].gotoAndStop(Math.round(Math.random() * this._textures.length));
            this._objectsContainer.children[i].transform.position.x = this._canvas.width * 2
        }
      }
    }
  
    drawObjects() {
      return this._objectsContainer;
    }
  }
  export default Objects;
  
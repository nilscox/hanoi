function Layer(tower, size) {

  this.tower = tower;
  this.size = size;
  this.selected = false;

}

function Tower(position) {

  this.position = position;
  this.layers = [];

  /**
   * Fills the tower with some layers
   *
   * @param {number} n - the amount of layers to fill
   */
  this.fill = (n) => {
    this.layers.splice(0, this.layers.length);

    for (let i = 0; i < n; ++i)
      this.layers.push(new Layer(this, n - i));
  };

  /**
   * Adds a layer to the tower
   *
   * @param {Layer} layer - the layer to add
   */
  this.addLayer = (layer) => {
    layer.tower = this;
    this.layers.push(layer);
  };

  /**
   * Removes the tower's top layer
   *
   * @returns {Layer} - the top layer
   */
  this.popLayer = () => {
    return this.layers.pop();
  };

  /**
   * Retrieve the tower's top layer
   *
   * @returns {Layer} - the top layer if any, or null otherwise
   */
  this.getTopLayer = () => {
    if (this.layers.length === 0)
      return null;

    return this.layers[this.layers.length - 1];
  }

}

function Game(root) {

  window.game = this;

  /** CONSTRUCTOR */

  this.canvas = createCanvas(root);
  this.canvas.addEventListener('click', (e) => this.onClick(e));
  this.context = this.canvas.getContext('2d');

  this.towers = [];
  this.selectedLayer = null;
  this.animation = null;

  /** INITIALIZATION */

  /**
   * Initializes the game
   */
  this.initialize = () => {
    const { width, height } = this.canvas;

    setDimensions(width, height);

    this.towers.splice(0, 3);

    for (let i = 0; i < 3; ++i)
      this.towers.push(new Tower(i));

    this.towers[parseInt(Math.random() * 3)].fill(TOWER_NB_LAYERS);

    this.redraw();

    console.log('Hanoi is ready to start', this);
  };

  /* RENDERING */

  /**
   * Clears the canvas and draw all game elements
   */
  this.redraw = () => {
    const ctx = this.context;
    const width = this.canvas.width;
    const height = this.canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#00000099';

    for (let i = 0; i < 3; ++i) {
      const tower = this.towers[i];

      drawTower(ctx, tower);

      for (let i = 0; i < tower.layers.length; ++i)
        drawLayer(ctx, tower.layers[i], i);
    }

    if (this.animation)
      drawAnimatedLayer(ctx, this.selectedLayer, this.animation);
  };

  /* ACCESSORS */

  /**
   * Finds the tower at a given coordinate
   *
   * @param {number} x - the x coordinate
   * @param {number} y - the y coordinate
   * @returns {?Tower} - the tower which bounding box contains the point
   *   coordinates, or `null` if no tower matches this point
   */
  this.getTowerAt = (x, y) => {
    for (let i = 0; i < 3; ++i) {
      const tower = this.towers[i];

      const towerRect = compute.towerRect(tower);

      if (compute.inBounds({ x, y }, towerRect)) {
        return tower;
      }
    }

    return null;
  };

  /**
   * Finds the layer at a given coordinate
   *
   * @param {number} x - the x coordinate
   * @param {number} y - the y coordinate
   * @returns {?Tower} - the layer which bounding box contains the point
   *   coordinates, or `null` if no layer matches this point
   */
  this.getLayerAt = (x, y) => {
    for (let i = 0; i < 3; ++i) {
      const tower = this.towers[i];

      for (let j = 0; j < tower.layers.length; ++j) {
        const layer = tower.layers[j];
        const layerRect = compute.layerRect(layer, j);

        if (compute.inBounds({ x, y }, layerRect)) {
          return layer;
        }
      }
    }

    return null;
  };

  /* VALIDATION */

  /**
   * Checks if the user can select a layer
   *
   * @param {Layer} layer - the layer to validate
   * @returns {boolean} - true only if the user can select this layer
   */
  this.canSelectLayer = (layer) => {
    if (this.selectedLayer)
      return layer === this.selectedLayer;

    const tower = layer.tower;

    if (!tower)
      return false;

    const idx = tower.layers.indexOf(layer);

    return idx === tower.layers.length - 1;
  };

  /**
   * Checks if the user can select a tower
   *
   * @param {Tower} tower - the tower to validate
   * @returns {boolean} - true if the user can select this tower
   */
  this.canSelectTower = (tower) => {
    const topLayer = tower.getTopLayer();

    if (!this.selectedLayer || tower === this.selectedLayer.tower)
      return false;

    if (!topLayer)
      return true;

    return topLayer.size > this.selectedLayer.size;
  };

  /* ANIMATION */

  /**
   * Animates a layer from a tower to another
   *
   * @param {Tower} fromTower - the tower for which the layer animates from
   * @param {Tower} toTower - the tower for which the layer animates to
   */
  this.animate = (fromTower, toTower) => {
    const layer = fromTower.popLayer();

    this.animation = {
      step: 0,
      fromTower,
      toTower,
      layer,
    };

    layer.tower = null;

    const frame = () => {
      this.animation.step += 0.01 * ANIMATION_SPEED;
      this.redraw();

      if (this.animation.step < 1) {
        requestAnimationFrame(frame);
      } else {
        this.endAnimate();
      }
    };

    requestAnimationFrame(frame);
  };

  /**
   * Ends the layer animation
   */
  this.endAnimate = () => {
    if (!this.animation)
      return;

    const fromTower = this.animation.fromTower;
    const toTower = this.animation.toTower;
    const layer = this.animation.layer;

    toTower.addLayer(layer);

    this.selectedLayer.selected = false;
    this.selectedLayer = null;
    this.animation = null;

    this.redraw();
  };

  /* EVENTS */

  /**
   * Handles a canvas's onclick event
   *
   * @param {Event} e - the event
   */
  this.onClick = (e) => {
    if (this.animation)
      return;

    const layer = this.getLayerAt(e.offsetX, e.offsetY);
    const tower = this.getTowerAt(e.offsetX, e.offsetY);

    if (layer && this.canSelectLayer(layer)) {
      layer.selected = !layer.selected;

      if (layer.selected) {
        this.selectedLayer = layer;
        console.log('layer selected: ' + layer.size);
      } else {
        this.selectedLayer = null;
        console.log('layer unselected');
      }

    } else if (tower && this.canSelectTower(tower)) {
      this.animate(this.selectedLayer.tower, tower);
      console.log('tower selected: ' + tower.position);
    }

    this.redraw();
  };

}

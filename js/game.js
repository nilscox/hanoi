/**
 * A layer
 */
function Layer(tower, size) {

  this.tower = tower;
  this.size = size;
  this.selected = false;

  this.setTower = (tower) => {
    this.tower = tower;
  };

}

/**
 * Tower data structure.
 */
function Tower(position) {

  this.position = position;
  this.layers = [];

  this.fill = (n) => {
    this.layers.splice(0, this.layers.length);

    for (let i = 0; i < n; ++i)
      this.layers.push(new Layer(this, n - i));
  };

  this.popLayer = () => {
    return this.layers.pop();
  };

  this.addLayer = (layer) => {
    layer.setTower(this, this.layers.length);
    this.layers.push(layer);
  };

  this.getTopLayer = () => {
    if (this.layers.length > 0)
      return this.layers[this.layers.length - 1];
  }

}

/**
 * Game data structure.
 *
 * This is the core data structure. It should be instanciated only once in the
 * app. It will add the <canvas /> tag as a child of the #game element in the
 * DOM. The #game element must initially exist in the document.
 */
function Game(root) {

  window.game = this;

  /* CONSTRUCTOR */

  this.canvas = createCanvas(root);
  this.canvas.addEventListener('click', (e) => this.onClick(e));
  this.context = this.canvas.getContext('2d');

  this.towers = [];
  this.selectedLayer = null;
  this.animation = null;

  /* GAME */

  /**
   * Initialize the game
   */
  this.initialize = () => {
    const { width, height } = this.canvas;

    compute.setDimensions(width, height);

    this.towers.splice(0, 3);

    for (let i = 0; i < 3; ++i)
      this.towers.push(new Tower(i));

    // this.towers[parseInt(Math.random() * 3)].fill(5);
    this.towers[0].fill(5);

    this.redraw();

    console.log('Hanoi is ready to start', this);
  };

  /* RENDERING */

  /**
   * Draw all game elements
   */
  this.redraw = () => {
    const { context: ctx } = this;
    const { width, height } = this.canvas;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 0.5;

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
   * Find the tower at a given coordinate
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

      if (compute.inBounds({ x, y }, towerRect))
        return tower;
    }

    return null;
  };

  /**
   * Find the layer at a given coordinate
   *
   * @param {number} x - the x coordinate
   * @param {number} y - the y coordinate
   * @returns {?Tower} - the layer which bounding box contains the point
   *   coordinates, or `null` if no layer matches this point
   */
  this.getLayerAt = (x, y) => {
    for (let i = 0; i < 3; ++i) {
      const tower = this.towers[i];

      if (tower.layers.length === 0)
        continue;

      for (let j = 0; j < tower.layers.length; ++j) {
        const layer = tower.layers[j];
        const layerRect = compute.layerRect(layer, j);

        if (compute.inBounds({ x, y }, layerRect))
          return layer;
      }
    }

    return null;
  };

  /* VALIDATION */

  /**
   * Check if the user can select a layer
   *
   * @param {Layer} layer - the layer to validate
   * @returns {boolean} - true if the user can select this layer
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
   * Check if the user can select a tower
   *
   * @param {Tower} tower - the tower to validate
   * @returns {boolean} - true if the user can select this tower
   */
  this.canSelectTower = (tower) => {
    const topLayer = tower.getTopLayer();

    if (!this.selectedLayer || tower === this.selectedLayer.tower)
      return false;

    if (topLayer)
      return topLayer.size > this.selectedLayer.size;

    return true;
  };

  /* ANIMATION */

  /**
   * Animate a layer from a tower to another
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
      this.animation.step += 0.05;
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
   * End the layer animation
   */
  this.endAnimate = () => {
    if (!this.animation)
      return;

    const { fromTower, toTower, layer } = this.animation;

    toTower.addLayer(layer);

    this.selectedLayer.selected = false;
    this.selectedLayer = null;
    this.animation = null;

    this.redraw();
  };

  /* EVENTS */

  /**
   * Handle an event when the user clicks on the canvas
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
        console.log('layer selected', layer);
      } else {
        this.selectedLayer = null;
        console.log('layer unselected');
      }

    } else if (tower && this.canSelectTower(tower)) {
      this.animate(this.selectedLayer.tower, tower);
      console.log('tower selected', tower);
    }

    this.redraw();
  };

}

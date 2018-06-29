/** LAYER */

/**
 * Layer constructor
 *
 * @param {Tower} tower - the tower in which this layer is
 * @param {number} size - the layer's size
 */
function Layer(tower, size) {

  this.size = size;
  this.tower = tower;
  this.selected = false;

}

/** TOWER */

/**
 * Tower constructor
 *
 * @param {number} position - the tower's position (0, 1 or 2)
 */
function Tower(position) {

  this.position = position;
  this.layers = [];

}

/**
 * Adds a layer to the tower
 *
 * @param {Layer} layer - the layer to add
 */
Tower.prototype.addLayer = function(layer) {
  layer.tower = this;
  this.layers.push(layer);
}

/**
 * Fills the tower with some layers
 *
 * @param {number} n - the amount of layers to fill
 */
Tower.prototype.fill = function(n) {
  for (var i = 0; i < n; ++i)
    this.addLayer(new Layer(this, n - i));
}

/**
 * Removes the tower's top layer
 *
 * @returns {Layer} - the top layer
 */
Tower.prototype.popLayer = function() {
  var layer = this.layers.pop();

  layer.tower = null;

  return layer;
};

/** GAME */

/**
 * Game constructor
 *
 * @param {HTMLNode} root - the element in which the canvas will be inserted
 */
function Game(root) {

  this.canvas = createCanvas(root);
  this.context = this.canvas.getContext('2d');

  this.towers = [];
  this.selectedLayer = null;

}

/** INITIALIZATION */

/**
 * Initializes the game
 */
Game.prototype.initialize = function() {
  setDimensions(this.canvas.width, this.canvas.height);

  this.context.strokeStyle = '#00000099';
  this.canvas.addEventListener('click', this.onClick.bind(this));

  for (var i = 0; i < 3; ++i)
    this.towers.push(new Tower(i));

  this.towers[parseInt(Math.random() * 3)].fill(TOWER_NB_LAYERS);
  this.redraw();

  console.log('Hanoi is ready to start', this);
}

/* RENDERING */

/**
 * Clears the canvas and draw all game elements
 */
Game.prototype.redraw = function() {
  var ctx = this.context;

  ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  for (var i = 0; i < this.towers.length; ++i) {
    var tower = this.towers[i];

    drawTower(ctx, tower);

    for (var j = 0; j < tower.layers.length; ++j)
      drawLayer(ctx, tower.layers[j], j);
  }

  if (this.animation)
    drawAnimatedLayer(ctx, this.selectedLayer, this.animation);
}

/* ACCESSORS */

/**
 * Finds the layer at a given coordinate
 *
 * @param {number} x - the x coordinate
 * @param {number} y - the y coordinate
 * @returns {?Tower} - the layer which bounding box contains the point
 *   coordinates, or `null` if no layer matches this point
 */
Game.prototype.getLayerAt = function(x, y) {
  for (let i = 0; i < 3; ++i) {
    var tower = this.towers[i];

    for (let j = 0; j < tower.layers.length; ++j) {
      var layer = tower.layers[j];
      var layerRect = compute.layerRect(layer, j);

      if (compute.inBounds({ x, y }, layerRect)) {
        return layer;
      }
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
Game.prototype.getTowerAt = function(x, y) {
  for (let i = 0; i < 3; ++i) {
    var tower = this.towers[i];

    var towerRect = compute.towerRect(tower);

    if (compute.inBounds({ x, y }, towerRect)) {
      return tower;
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
Game.prototype.canSelectLayer = function(layer) {
  if (this.selectedLayer)
    return layer === this.selectedLayer;

  var tower = layer.tower;

  if (!tower)
    return false;

  var idx = tower.layers.indexOf(layer);

  return idx === tower.layers.length - 1;
}

/**
 * Checks if the user can select a tower
 *
 * @param {Tower} tower - the tower to validate
 * @returns {boolean} - true if the user can select this tower
 */
Game.prototype.canSelectTower = function(tower) {
  const topLayer = tower.layers[tower.layers.length - 1];

  if (!this.selectedLayer || tower === this.selectedLayer.tower)
    return false;

  if (!topLayer)
    return true;

  return topLayer.size > this.selectedLayer.size;
};

/* ANIMATION */

Game.prototype.animate = function(fromTower, toTower) {
  var layer = fromTower.popLayer();
  var game = this;

  var anim = this.animation = {
    fromTower: fromTower,
    toTower: toTower,
    step: 0,
  };

  function frame() {
    anim.step += 0.01 * ANIMATION_SPEED;
    game.redraw();

    if (anim.step < 1)
      requestAnimationFrame(frame);
    else
      game.endAnimate();
  }

  requestAnimationFrame(frame);
}

Game.prototype.endAnimate = function() {
  this.animation.toTower.addLayer(this.selectedLayer);
  this.selectedLayer.selected = false;
  this.selectedLayer = null;
  this.animation = null;

  this.redraw();
}

/* EVENTS */

/**
 * Handles a canvas's onclick event
 *
 * @param {Event} e - the event
 */
Game.prototype.onClick = function(e) {
  var layer = this.getLayerAt(e.offsetX, e.offsetY);
  var tower = this.getTowerAt(e.offsetX, e.offsetY);

  if (layer && this.canSelectLayer(layer)) {
    layer.selected = !layer.selected;

    if (layer.selected) {
      this.selectedLayer = layer;
      console.log('Layer selected: size = ' + layer.size);
    } else {
      this.selectedLayer = null;
      console.log('Layer unselected');
    }
  } else if (tower && this.canSelectTower(tower)) {
    this.animate(this.selectedLayer.tower, tower);
    console.log('Tower selected: position = ' + tower.position);
  }

  this.redraw();
};

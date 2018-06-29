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

}

/** INITIALIZATION */

/**
 * Initializes the game
 */
Game.prototype.initialize = function() {
  setDimensions(this.canvas.width, this.canvas.height);
  this.context.strokeStyle = '#00000099';

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
}

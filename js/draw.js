var TOWER_COLOR = new Values('#666');
var LAYERS_COLORS = buildColorPalette(TOWER_NB_LAYERS);
var SELECTED_LAYER_COLOR = getRandomColor().tint(30);

/**
 * Generate a random color, between #000000 and #FFFFFF
 *
 * @returns {Values} - the generated color
 */
function getRandomColor() {
  var r = parseInt(Math.random() * 255);
  var g = parseInt(Math.random() * 255);
  var b = parseInt(Math.random() * 255);

  return new Values(`rgb(${r}, ${g}, ${b})`);
}

/**
 * Creates a beautiful color palette
 *
 * @param {number} n - the palette's size
 * @returns {Array<Values>} - the color palette
 */
function buildColorPalette(n) {
  var colors = [];
  var baseColor = getRandomColor().hexString();

  for (var i = 0; i < n; ++i) {
    colors.push(new Values(baseColor).shade(i * 10));
  }

  return colors;
}

/**
 * Creates a <canvas> element
 *
 * @param {HTMLNode} root - the element in which the canvas will be inserted
 * @param {number} width - the canvas width
 * @param {number} height - the canwas height
 * @returns {HTMLNode} - the created canvas
 */
function createCanvas(root, width, height) {
  var canvas = document.createElement('canvas');

  canvas.width = width;
  canvas.height = height;

  root.appendChild(canvas);

  return canvas;
}

/**
 * Draws a rectangle filled with a given color
 *
 * @param {Context2D} ctx - the drawing context
 * @param {Rect} r - the rectangle definition
 * @param {Values} fill - a Values instance of the fill color
 */
function drawRect(ctx, r, fill) {
  ctx.fillStyle = fill.hexString();
  ctx.fillRect(r.x, r.y, r.width, r.height);

  ctx.beginPath();
  ctx.rect(r.x, r.y, r.width, r.height);
  ctx.stroke();
}

/**
 * Draws a layer attached to a tower
 *
 * @param {Contex2D} ctx - the drawing context
 * @param {Layer} layer - the layer to draw
 * @param {number} i - the layer's position in the tower
 */
function drawLayer(ctx, layer, i) {
  let color = LAYERS_COLORS[layer.size - 1];

  if (layer.selected) {
    color = SELECTED_LAYER_COLOR;
  }

  drawRect(ctx, compute.layerRect(layer, i), color);
}

/**
 * Draws a tower
 *
 * @param {Context2D} ctx - the drawing context
 * @param {Tower} tower - the tower to draw
 */
function drawTower(ctx, tower) {
  drawRect(ctx, compute.poleRect(tower), TOWER_COLOR);
  drawRect(ctx, compute.baseRect(tower), TOWER_COLOR);
}

/**
 * Draws a layer during an animation
 *
 * @param {Context2D} ctx - the drawing context
 * @param {Layer} layer - the layer to draw
 * @param {Animation} animation - the animation object
 */
function drawAnimatedLayer(ctx, layer, animation) {
  drawRect(ctx, compute.animatedLayerRect(layer, animation), SELECTED_LAYER_COLOR);
}

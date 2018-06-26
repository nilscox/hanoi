/**
 * Generate a random color, between #000000 and #FFFFFF
 *
 * @returns {Values} - the generated color
 */
function getRandomColor() {
  const r = parseInt(Math.random() * 255);
  const g = parseInt(Math.random() * 255);
  const b = parseInt(Math.random() * 255);

  return new Values(`rgb(${r}, ${g}, ${b})`);
}

/**
 * Creates a beautiful color palette
 *
 * @returns {Array<Values>} - the color palette
 */
function buildColorPalette() {
  const colors = [];
  const baseColor = getRandomColor().hexString();

  for (let i = 0; i < 5; ++i) {
    colors.push(new Values(baseColor).shade(i * 10));
  }

  return colors;
}

/**
 * Creates a <canvas> element
 *
 * @param {HTMLNode} root - the element in which the canvas will be inserted
 * @returns {HTMLNode} - the created canvas
 */
function createCanvas(root) {
  const canvas = document.createElement('canvas');

  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;

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

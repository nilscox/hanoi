const GAME_SPACING = 10;
const TOP_SPACING = 50;
const TOWER_SPACING = 10;
const POLE_WIDTH = 10;
const BASE_HEIGHT = 5;
const LEVEL_HEIGHT = 25;
const LEVEL_SPACING = 5;
const LEVEL_MIN_WIDTH = 20;
const LEVEL_ANIMATION_SPACING = 20;

const LEVELS_COLORS = buildLevelsColor();
const POLE_COLOR = '#666';

/**
 * Create a color palette.
 *
 * @returns {Array<string>} - the color palette
 */
function buildLevelsColor() {
  const colors = [];

  const r = parseInt(Math.random() * 255);
  const g = parseInt(Math.random() * 255);
  const b = parseInt(Math.random() * 255);

  const baseColor = new Values(`rgb(${r}, ${g}, ${b})`)
    .tint(30).
    hexString();

  for (let i = 0; i < 5; ++i) {
    colors.push(new Values(baseColor).shade(i * 10));
  }

  return colors.map(c => c.hexString());
}

/**
 * Draw a filled rectangle with a given color
 *
 * @param {Context2D} ctx - the drawing context
 * @param {Rect} r - the rectangle definition
 * @param {string} fillStyle - the color in hex format
 */
function drawRect(ctx, r, fillStyle) {
  if (fillStyle)
    ctx.fillStyle = fillStyle;

  ctx.fillRect(r.x, r.y, r.width, r.height);
}

/**
 * Draw a level attached to a tower.
 *
 * @param {Contex2D} ctx - the drawing context
 * @param {Level} level - the level to draw
 * @param {number} i - the level's position in the tower
 */
function drawLevel(ctx, level, i) {
  let color = LEVELS_COLORS[level.size - 1];

  if (level.highlight) {

  } else if (level.selected) {

  }

  drawRect(ctx, compute.levelRect(level, i), color);
}

/**
 * Draw a tower.
 *
 * @param {Context2D} ctx - the drawing context
 * @param {Tower} tower - the tower to draw
 */
function drawTower(ctx, tower) {
  drawRect(ctx, compute.poleRect(tower), POLE_COLOR);
  drawRect(ctx, compute.baseRect(tower), POLE_COLOR);
}

/**
 * Draw an animated level.
 *
 * @param {Context2D} ctx - the drawing context
 * @param {Level} level - the level to draw
 * @param {Animation} animation - the animation object
 */
function drawAnimatedLevel(ctx, level, animation) {
  drawRect(ctx, compute.animatedLevelRect(level, animation), LEVELS_COLORS[level.size - 1]);
}

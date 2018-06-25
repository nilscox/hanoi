const GAME_SPACING = 10;
const TOP_SPACING = 50;
const TOWER_SPACING = 10;
const POLE_WIDTH = 10;
const BASE_HEIGHT = 5;
const LEVEL_HEIGHT = 25;
const LEVEL_SPACING = 5;
const LEVEL_MIN_WIDTH = 20;

const COLORS = [null, '#F9F', '#FF9', '#99F', '#9F9', '#F99']
  .map(c => new Values(c));

function drawRect(ctx, r, fillStyle) {
  if (fillStyle)
    ctx.fillStyle = fillStyle;

  ctx.fillRect(r.x, r.y, r.width, r.height);
}

function drawLevel(ctx, level, i) {
  let color = COLORS[level.size];

  if (level.highlight) {
    color = color.tint(50);
  } else if (level.selected) {
    color = color.tint(50);
  }

  drawRect(ctx, compute.levelRect(level, i), color.hexString());
}

function drawTower(ctx, tower) {
  let color = new Values('#666');

  if (tower.highlight)
    color = color.tint(30);

  drawRect(ctx, compute.poleRect(tower), color.hexString());
  drawRect(ctx, compute.baseRect(tower), color.hexString());
}

function drawAnimatedLevel(ctx, level, animation) {
  drawRect(ctx, compute.animatedLevelRect(level, animation), COLORS[level.size].hexString());
}

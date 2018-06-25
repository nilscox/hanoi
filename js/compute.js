const compute = {

  towerWidth: function towerWidth(dimensions) {
    return dimensions.width / 3 - 2 * TOWER_SPACING;
  },

  levelWidth: function levelWidth(dimensions, level) {
    const ratio = level.size / 5;
    const towerWidth = compute.towerWidth(dimensions);

    return (towerWidth - LEVEL_MIN_WIDTH) * ratio + LEVEL_MIN_WIDTH;
  },

  poleRect: function poleRect(dimensions, tower) {
    const towerWidth = compute.towerWidth(dimensions);
    const pos = tower.position;

    return {
      x: GAME_SPACING + towerWidth / 2 - POLE_WIDTH / 2 + pos * (towerWidth + 2 * TOWER_SPACING),
      y: GAME_SPACING + TOP_SPACING,
      width: POLE_WIDTH,
      height: dimensions.height - TOP_SPACING - 2 * GAME_SPACING,
    };
  },

  baseRect: function baseRect(dimensions, tower) {
    const towerWidth = compute.towerWidth(dimensions);
    const pos = tower.position;

    return {
      x: GAME_SPACING + pos * (towerWidth + 2 * TOWER_SPACING),
      y: dimensions.height - GAME_SPACING - BASE_HEIGHT,
      width: towerWidth,
      height: BASE_HEIGHT,
    };
  },

 towerRect: function towerRect(dimensions, tower) {
    const poleRect = compute.poleRect(dimensions, tower);
    const baseRect = compute.baseRect(dimensions, tower);

    return {
      x: baseRect.x,
      y: poleRect.y,
      width: baseRect.width,
      height: poleRect.height,
    };
  },

  levelRect: function levelRect(dimensions, level, i) {
    const towerWidth = compute.towerWidth(dimensions);
    const levelWidth = compute.levelWidth(dimensions, level);

    return {
      x: GAME_SPACING + (towerWidth - levelWidth) / 2 + level.tower.position * (towerWidth + 2 * TOWER_SPACING),
      y: dimensions.height - GAME_SPACING - BASE_HEIGHT - (i + 1) * (LEVEL_HEIGHT + LEVEL_SPACING),
      width: levelWidth,
      height: LEVEL_HEIGHT,
    };
  },

  inBounds: function inBounds(p, bounds) {
    return [
      p.x >= bounds.x,
      p.x <= bounds.x + bounds.width,
      p.y >= bounds.y,
      p.y <= bounds.y + bounds.height,
    ].indexOf(false) < 0;
  }

};
const dimensions = {
  width: 0,
  height: 0,
};

/**
 * Object of functions to abstract game objects positions and dimensions
 * computation
 *
 * A "pole" represents the vertical bar of a tower.
 * A "base" represents the horizontal bar of a tower.
 * A "Rect" is the smallest bounding box in which an object can fit.
 *
 * Point = {
 *   x: number,
 *   y: number,
 * }
 *
 * Rect = {
 *   x: number,
 *   y: number,
 *   width: number,
 *   height: number,
 * }
 */
const compute = {

  /**
   * Compute the with of a tower.
   *
   * @param {width} number - the canvas width
   * @param {height} number - the canvas height
   */
  setDimensions: function setDimensions(width, height) {
    dimensions.width = width;
    dimensions.height = height;
  },

  /**
   * Compute the with of a tower.
   *
   * @returns {number} - a tower's width, in px
   */
  towerWidth: function towerWidth() {
    return dimensions.width / 3 - 2 * TOWER_SPACING;
  },

  /**
   * Compute the with of a level.
   *
   * @param {Level} level - the level
   * @returns {number} - the level's width, in px
   */
  levelWidth: function levelWidth(level) {
    const ratio = level.size / 5;
    const towerWidth = compute.towerWidth();

    return (towerWidth - LEVEL_MIN_WIDTH) * ratio + LEVEL_MIN_WIDTH;
  },

  /**
   * Compute a pole's rect.
   *
   * @param {Tower} tower - the tower
   * @returns {Rect} - the tower's pole rect
   */
  poleRect: function poleRect(tower) {
    const towerWidth = compute.towerWidth();
    const pos = tower.position;

    return {
      x: GAME_SPACING + towerWidth / 2 - POLE_WIDTH / 2 + pos * (towerWidth + 2 * TOWER_SPACING),
      y: GAME_SPACING + TOP_SPACING,
      width: POLE_WIDTH,
      height: dimensions.height - TOP_SPACING - 2 * GAME_SPACING,
    };
  },

  /**
   * Compute a base's rect.
   *
   * @param {Tower} tower - the tower
   * @returns {Rect} - the tower's base rect
   */
  baseRect: function baseRect(tower) {
    const towerWidth = compute.towerWidth();
    const pos = tower.position;

    return {
      x: GAME_SPACING + pos * (towerWidth + 2 * TOWER_SPACING),
      y: dimensions.height - GAME_SPACING - BASE_HEIGHT,
      width: towerWidth,
      height: BASE_HEIGHT,
    };
  },

  /**
   * Compute a tower's rect.
   *
   * @param {Tower} tower - the tower
   * @returns {Rect} - the tower's rect
   */
  towerRect: function towerRect(tower) {
    const poleRect = compute.poleRect(tower);
    const baseRect = compute.baseRect(tower);

    return {
      x: baseRect.x,
      y: poleRect.y,
      width: baseRect.width,
      height: poleRect.height,
    };
  },

  /**
   * Compute a level's rect.
   *
   * @param {Level} level - the level
   * @param {number} i - the position of the level in the tower
   * @returns {Rect} - the level's rect
   */
  levelRect: function levelRect(level, i) {
    const towerWidth = compute.towerWidth();
    const levelWidth = compute.levelWidth(level);

    return {
      x: GAME_SPACING + (towerWidth - levelWidth) / 2 + level.tower.position * (towerWidth + 2 * TOWER_SPACING),
      y: dimensions.height - GAME_SPACING - BASE_HEIGHT - (i + 1) * (LEVEL_HEIGHT + LEVEL_SPACING),
      width: levelWidth,
      height: LEVEL_HEIGHT,
    };
  },

  /**
   * Check if a bonding box contains a point
   *
   * @param {Point} p - the point to check
   * @param {bounds} React - the bounding box
   * @returns {boolean} - true if the point is inside the bounding box
   */
  inBounds: function inBounds(p, bounds) {
    return [
      p.x >= bounds.x,
      p.x <= bounds.x + bounds.width,
      p.y >= bounds.y,
      p.y <= bounds.y + bounds.height,
    ].indexOf(false) < 0;
  }

};
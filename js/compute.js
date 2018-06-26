/**
  * Global dimensions definition.
  *
  * This global declaration allows to set the dimensions once when the game
  * starts, and every time the canvas gets resized.
  */
const g_dimensions = {
  width: 0,
  height: 0,
};

/**
 * Object of functions to abstract all game computations
 *
 * A "Rect" is the smallest bounding box in which an object can fit.
 * A "pole" represents the vertical bar of a tower.
 * A "base" represents the horizontal bar of a tower.
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
 *
 * Animation = {
 *   fromTower: Tower,
 *   toTower: Tower,
 *   step: number,
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
    g_dimensions.width = width;
    g_dimensions.height = height;
  },

  /**
   * Compute the with of a tower.
   *
   * @returns {number} - a tower's width, in px
   */
  towerWidth: function towerWidth() {
    return g_dimensions.width / 3 - 2 * TOWER_SPACING;
  },

  /**
   * Compute the with of a layer.
   *
   * @param {Layer} layer - the layer
   * @returns {number} - the layer's width, in px
   */
  layerWidth: function layerWidth(layer) {
    const ratio = layer.size / 5;
    const towerWidth = compute.towerWidth();

    return (towerWidth - LAYER_MIN_WIDTH) * ratio + LAYER_MIN_WIDTH;
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
      height: g_dimensions.height - TOP_SPACING - 2 * GAME_SPACING,
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
      y: g_dimensions.height - GAME_SPACING - BASE_HEIGHT,
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
   * Compute a layer's rect.
   *
   * @param {Layer} layer - the layer
   * @param {number} i - the position of the layer in the tower
   * @returns {Rect} - the layer's rect
   */
  layerRect: function layerRect(layer, i) {
    const towerWidth = compute.towerWidth();
    const layerWidth = compute.layerWidth(layer);

    return {
      x: GAME_SPACING + (towerWidth - layerWidth) / 2 + layer.tower.position * (towerWidth + 2 * TOWER_SPACING),
      y: g_dimensions.height - GAME_SPACING - BASE_HEIGHT - (i + 1) * (LAYER_HEIGHT + LAYER_SPACING),
      width: layerWidth,
      height: LAYER_HEIGHT,
    };
  },

  /**
   * Compute an animated layer's rect. This function is aweful.
   *
   * @param {Layer} layer - the animated layer
   * @param {Animation} animation - the animation object
   */
  animatedLayerRect: function animatedLayerRect(layer, animation) {
    const { fromTower, toTower, step } = animation;

    const towerWidth = compute.towerWidth();
    const layerWidth = compute.layerWidth(layer);
    const fromTowerRect = compute.towerRect(fromTower);
    const toTowerRect = compute.towerRect(toTower);

    const result = {
      width: layerWidth,
      height: LAYER_HEIGHT,
    }

    if (step < 1/3 || step > 2/3) {
      const tower = step < 1/3 ? fromTower : toTower;
      let a = g_dimensions.height - GAME_SPACING - BASE_HEIGHT - (tower.layers.length + 1) * (LAYER_HEIGHT + LAYER_SPACING);
      let b = LAYER_ANIMATION_SPACING;
      let f = step * 3;

      if (tower === toTower) {
        b = [a, a = b][0];
        f -= 2;
      }

      result.x = GAME_SPACING + (towerWidth - layerWidth) / 2 + tower.position * (towerWidth + 2 * TOWER_SPACING);
      result.y = (b - a) * f + a;
    } else {
      let a = fromTowerRect.x + towerWidth / 2 - layerWidth / 2;
      let b = toTowerRect.x + towerWidth / 2 - layerWidth / 2;
      let f = step * 3 - 1;

      if (a > b) {
        b = [a, a = b][0];
        f = -f + 1;
      }

      result.x = (b - a) * f + a;
      result.y = LAYER_ANIMATION_SPACING;
    }

    return result;
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
  },

};

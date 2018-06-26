/**
 * A level
 */
function Level(tower, size) {

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
  this.levels = [];

  this.fill = (n) => {
    this.levels.splice(0, this.levels.length);

    for (let i = 0; i < n; ++i)
      this.levels.push(new Level(this, n - i));
  };

  this.popLevel = () => {
    return this.levels.pop();
  };

  this.addLevel = (level) => {
    level.setTower(this, this.levels.length);
    this.levels.push(level);
  };

  this.getTopLevel = () => {
    if (this.levels.length > 0)
      return this.levels[this.levels.length - 1];
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
  this.selectedLevel = null;
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

    console.log(width, height);
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 0.5;

    for (let i = 0; i < 3; ++i) {
      const tower = this.towers[i];

      drawTower(ctx, tower);

      for (let i = 0; i < tower.levels.length; ++i)
        drawLevel(ctx, tower.levels[i], i);
    }

    if (this.animation)
      drawAnimatedLevel(ctx, this.selectedLevel, this.animation);
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
   * Find the level at a given coordinate
   *
   * @param {number} x - the x coordinate
   * @param {number} y - the y coordinate
   * @returns {?Tower} - the level which bounding box contains the point
   *   coordinates, or `null` if no level matches this point
   */
  this.getLevelAt = (x, y) => {
    for (let i = 0; i < 3; ++i) {
      const tower = this.towers[i];

      if (tower.levels.length === 0)
        continue;

      for (let j = 0; j < tower.levels.length; ++j) {
        const level = tower.levels[j];
        const levelRect = compute.levelRect(level, j);

        if (compute.inBounds({ x, y }, levelRect))
          return level;
      }
    }

    return null;
  };

  /* VALIDATION */

  /**
   * Check if the user can select a level
   *
   * @param {Level} level - the level to validate
   * @returns {boolean} - true if the user can select this level
   */
  this.canSelectLevel = (level) => {
    if (this.selectedLevel)
      return level === this.selectedLevel;

    const tower = level.tower;

    if (!tower)
      return false;

    const idx = tower.levels.indexOf(level);

    return idx === tower.levels.length - 1;
  };

  /**
   * Check if the user can select a tower
   *
   * @param {Tower} tower - the tower to validate
   * @returns {boolean} - true if the user can select this tower
   */
  this.canSelectTower = (tower) => {
    const topLevel = tower.getTopLevel();

    if (!this.selectedLevel || tower === this.selectedLevel.tower)
      return false;

    if (topLevel)
      return topLevel.size > this.selectedLevel.size;

    return true;
  };

  /* ANIMATION */

  /**
   * Animate a level from a tower to another
   *
   * @param {Tower} fromTower - the tower for which the level animates from
   * @param {Tower} toTower - the tower for which the level animates to
   */
  this.animate = (fromTower, toTower) => {
    const level = fromTower.popLevel();

    this.animation = {
      step: 0,
      fromTower,
      toTower,
      level,
    };

    level.tower = null;

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
   * End the level animation
   */
  this.endAnimate = () => {
    if (!this.animation)
      return;

    this.redraw();

    const { fromTower, toTower, level } = this.animation;

    toTower.addLevel(level);

    this.selectedLevel.selected = false;
    this.selectedLevel = null;
    this.animation = null;
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

    const level = this.getLevelAt(e.offsetX, e.offsetY);
    const tower = this.getTowerAt(e.offsetX, e.offsetY);

    if (level && this.canSelectLevel(level)) {
      level.selected = !level.selected;

      if (level.selected) {
        this.selectedLevel = level;
        console.log('level selected', level);
      } else {
        this.selectedLevel = null;
        console.log('level unselected');
      }

    } else if (tower && this.canSelectTower(tower)) {
      this.animate(this.selectedLevel.tower, tower);
      console.log('tower selected', tower);
    }

    this.redraw();
  };

}

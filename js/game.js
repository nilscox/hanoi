function Level(tower, size) {

  this.tower = tower;
  this.size = size;
  this.highlight = false;
  this.selected = false;

  this.setTower = (tower) => {
    this.tower = tower;
  };

}

function Tower(position) {

  this.position = position;
  this.levels = [];
  this.highlight = false;

  this.fill = (n) => {
    this.levels.splice(0, this.levels.length);

    for (let i = 0; i < n; ++i)
      this.levels.push(new Level(this, n - i));
  };

  this.draw = (ctx) => {
    drawTower(ctx, this);
  };

  this.popLevel = () => {
    return this.levels.pop();
  };

  this.addLevel = (level) => {
    level.setTower(this, this.levels.length);
    this.levels.push(level);
  };

}

function Game() {

  window.game = this;

  /* CONSTRUCTOR */

  this.root = document.getElementById('game');
  this.canvas = document.createElement('canvas');
  this.context = this.canvas.getContext('2d');
  this.canvas.width = this.root.clientWidth;
  this.canvas.height = this.root.clientHeight;

  this.canvas.addEventListener('click', (e) => this.onClick(e));
  this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
  this.canvas.addEventListener('mouseout', (e) => this.onMouseOut(e));

  this.root.appendChild(this.canvas);

  this.towers = [];
  this.selectedLevel = null;
  this.animation = null;

  /* GAME */

  this.initialize = () => {
    const { width, height } = this.canvas;

    compute.setDimensions(width, height);

    this.towers.splice(0, 3);

    for (let i = 0; i < 3; ++i)
      this.towers.push(new Tower(i));

    // this.towers[parseInt(Math.random() * 3)].fill(5);
    this.towers[0].fill(5);

    console.log('Hanoi is ready to start', this);
  };

  this.start = () => {
    const ctx = this.context;

    const loop = () => {
      this.frame();
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  };

  this.frame = () => {
    this.clear();
    this.draw();
  };

  /* RENDERING */

  this.clear = () => {
    const { width, height } = this.canvas;

    this.context.clearRect(0, 0, width, height);
  };

  this.resetHighlight = () => {
    for (let i = 0; i < 3; ++i) {
      const tower = this.towers[i];

      tower.highlight = false;

      for (let j = 0; j < tower.levels.length; ++j)
        tower.levels[j].highlight = false;
    }
  };

  this.draw = () => {
    this.context.strokeStyle = '#000000';
    this.context.lineWidth = 0.5;

    for (let i = 0; i < 3; ++i)
      this.towers[i].draw(this.context);
  };

  /* ACCESSORS */

  this.getTowerAt = (x, y) => {
    for (let i = 0; i < 3; ++i) {
      const tower = this.towers[i];

      const towerRect = compute.towerRect(tower);

      if (compute.inBounds({ x, y }, towerRect))
        return tower;
    }

    return null;
  };

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

  this.canSelectLevel = (level) => {
    if (this.selectedLevel)
      return level === this.selectedLevel;

    const tower = level.tower;

    if (!tower)
      return false;

    const idx = tower.levels.indexOf(level);

    return idx === tower.levels.length - 1;
  };

  this.canSelectTower = (tower) => {
    if (!this.selectedLevel)
      return false;

    if (tower === this.selectedLevel.tower)
      return false;

    return true;
  };

  /* ANIMATION */

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

      if (this.animation.step < 1) {
        requestAnimationFrame(frame);
      } else {
        this.endAnimate();
      }
    };

    requestAnimationFrame(frame);
  };

  this.endAnimate = () => {
    if (!this.animation)
      return;

    const { fromTower, toTower, level } = this.animation;

    toTower.addLevel(level);

    this.selectedLevel.selected = false;
    this.selectedLevel = null;
    this.animation = null;
  };

  /* EVENTS */

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
  };

  this.onMouseMove = (e) => {
    if (this.animation)
      return;

    const tower = this.getTowerAt(e.offsetX, e.offsetY);
    const level = this.getLevelAt(e.offsetX, e.offsetY);

    this.resetHighlight();

    if (level && this.canSelectLevel(level)) {
      level.highlight = true;
    } else if (tower && this.canSelectTower(tower)) {
      tower.highlight = true;
    }
  };

  this.onMouseOut = () => {
    this.resetHighlight();
  };

}

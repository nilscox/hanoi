function Level(tower, size) {

  this.tower = tower;
  this.size = size;
  this.highlight = false;
  this.selected = false;

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

}

function Game() {

  window.game = this;

  this.root = document.getElementById('game');
  this.canvas = document.createElement('canvas');
  this.context = this.canvas.getContext('2d');
  this.canvas.width = this.root.clientWidth;
  this.canvas.height = this.root.clientHeight;

  this.canvas.addEventListener('click', (e) => this.onClick(e));
  this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
  this.canvas.addEventListener('mouseout', (e) => this.onMouseOut(e));

  this.root.appendChild(this.canvas);

  this.dimensions = {
    width: this.canvas.width,
    height: this.canvas.height,
  };

  this.towers = [];
  this.selectedLevel = null;

  this.initialize = () => {
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
    this.update();
    this.clear();
    this.draw();
  };

  this.clear = () => {
    this.context.clearRect(0, 0, this.width, this.height);
  };

  this.draw = () => {
    this.context.strokeStyle = '#000000';
    this.context.lineWidth = 0.5;

    for (let i = 0; i < 3; ++i)
      this.towers[i].draw(this.context);
  };

  this.update = () => {

  };

  this.getTowerAt = (x, y) => {
    for (let i = 0; i < 3; ++i) {
      const tower = this.towers[i];

      const towerRect = compute.towerRect(this.dimensions, tower);

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
        const levelRect = compute.levelRect(this.dimensions, level, j);

        if (compute.inBounds({ x, y }, levelRect))
          return level;
      }
    }

    return null;
  };

  this.resetHighlight = () => {
    for (let i = 0; i < 3; ++i) {
      const tower = this.towers[i];

      tower.highlight = false;

      for (let j = 0; j < tower.levels.length; ++j)
        tower.levels[j].highlight = false;
    }
  };

  this.onClick = (e) => {
    const level = this.getLevelAt(e.offsetX, e.offsetY);

    if (level) {
      if (level.selected) {
        level.selected = false;
        this.selectedLevel = null;
      } else {
        level.selected = true;
        this.selectedLevel = level;
      }
    }
  };

  this.onMouseMove = (e) => {
    const tower = this.getTowerAt(e.offsetX, e.offsetY);
    const level = this.getLevelAt(e.offsetX, e.offsetY);

    this.resetHighlight();

    if (!this.selectedLevel && level) {
      level.highlight = true;
    } else if (this.selectedLevel && tower && this.selectedLevel.tower !== tower) {
      tower.highlight = true;
    }
  };

  this.onMouseOut = () => {
    this.resetHighlight();
  };

}

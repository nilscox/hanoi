const canvas = createCanvas(document.getElementById('game'));
const ctx = canvas.getContext('2d');

setDimensions(canvas.width, canvas.height);

const tower1 = {
  position: 1,
  layers: [],
};

const tower2 = {
  position: 0,
  layers: [],
};

for (let i = 0; i < TOWER_NB_LAYERS; ++i)
  tower1.layers.push({ size: i + 1, selected: false, tower: tower1 });

var animation = {
  fromTower: tower1,
  toTower: tower2,
  step: 0,
};

function frame() {
  animation.step += 0.01;

  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  drawAnimatedLayer(ctx, tower1.layers[0], animation);

  if (animation.step < 1)
    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

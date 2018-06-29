var root = document.getElementById('game');

document.body.onload = () => {
  var game = new Game(root);

  window.game = game;
  game.initialize();
};

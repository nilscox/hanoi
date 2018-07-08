var root = document.getElementById('game');

document.body.onload = function() {
  var game = new Game(root);

  window.game = game;
  game.initialize();
};

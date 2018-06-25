const body = document.getElementsByTagName('body')[0];

body.onload = () => {
  const game = new Game();

  game.initialize();
  game.start();
};

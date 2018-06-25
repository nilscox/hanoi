const body = document.getElementsByTagName('body')[0];
const root = document.getElementById('game');

body.onload = () => new Game(root).initialize();

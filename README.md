# Hanoï

Le but de ce projet est de réaliser un petit jeu en JavaScript : [les tours de
Hanoï](https://fr.wikipedia.org/wiki/Tours_de_Hano%C3%AF).

## Introduction

Cet exercice s'adresse à toute personne ayant déjà quelques notions en
programmation (et plus particulièrement en JavaScript), et propose un cas
pratique de conception d'un jeu *from scratch*. Il est préférable d'avoir au
moins les notions de conditions, de boucles, de fonctions... mais ce n'est pas
nécéssaire de très bien maîtriser toutes les notions du JS pour bien comprendre
et réussir ce sujet.

Lorsque j'ai commencé la programmation (en C à l'époque), j'avais souvent besoin
de cas pratiques pour mettre en application les notion que j'avais appris. Il me
manquait souvent un "petit projet", me permettant de revoir les choses
élémentaires et de comprendre comment le code peut être conçu, designé,
architecturé dans le développement d'un projet à plus grande échelle.

L'objectif de cet exercice est d'une part de manipuler les fonctionnalités de
base disponibles en JS, mais aussi de comprendre la mise en place du code,
comment les éléments vont être amenés à intéragir les uns avec les autres, et
même plus généralement comment architecturer un projet, même assez simple comme
les tours de Hanoï.

Le sujet va tenter de donner les lignes directrices pour savoir comment avancer,
tout en ayant au maximum la possibilité de tester les fonctions écrites.
L'architecture est donc presque entièrement donnée. Pour donner un ordre d'idée,
la réf fait un peu moins de 400 lignes, réparties dans un peu plus de 20
fonctions. Les fonctions à réaliser ne sont jamais très longues, quelques lignes
en moyenne (la plus longue en a 13, sans compter les lignes vides).

Trois grandes parties composent ce sujet. En plus de cette introduction, qui
donnera déjà quelques éléments important pour bien appréhender la suite, nous
verrons le "module de calculs" du jeu (fourni), puis nous allons commencer à
coder les fonctions de dessin, pour terminer par le code du jeu lui-même. Une
4ème partie, optionnelle et non corrigée, proposera l'implémentation d'un
algorithme de résolution du problème des tours de Hanoï.

### Code style

Le JavaScript est et a été depuis quelques années en constante évolution.
Initialement conçu par Brendan Eich en 1995 pour le navigateur Netscape, le JS
était beaucoup utilisé pour ajouter une partie dynamique aux pages web, souvent
plus pour le côté "déco" (petites animations, validation des formulaires, ...).

Depuis, les choses ont bien changé car on retrouve du code JavaScript pour, par
exemple, des analytics, du tracking, des interfaces web complexes, et même côté
serveur. Depuis sa première version, la syntaxe du langage et les performances
des interprêteurs ont bien changés, donnant des raccourcis très pratiques pour
les développeurs (arrow functions, le mot-clé `class`, async / await, ...).

Le but de cet exercice n'est pas de découvrir ces fonctionalités nouvelles et
formidables, mais plutôt de mieux appréhender et être à l'aise avec une
codebase un peu ancienne, parce que bah.. à la base, le JS c'est ça quoi. Et
c'est bien de pouvoir le lire et le comprendre ! Pour ça, rien de mieux que la
pratique.

La correction est faite pour fonctionner en ES5. Plus de détails seront donnés
lors du développement du jeu sur certains points de syntaxe. Bien sur, tout ce
qui est expliqué dans ce sujet est réalisable dans n'importe quel version de
JavaScript, et même dans n'importe quel langage de programmation. Le choix reste
donc libre, bien qu'il soit plus intéressant, à mon sens, de le faire en ES5.

### Mise en place

Quelques fichiers sont déjà donnés, nous allons voir rapidement comment
s'insérer dans cette codebase. Tout ce qui est indiqué dans ce sujet n'est donné
qu'à titre indicatif. N'importe quel fichier peut être modifié, déplacé, rennomé
comme l'on veut, l'important est de terminer avec quelque chose qui marche.

Premièrement, le fichier `index.html` est le point d'entrée du programme. C'est
ce fichier auquel on pourra accéder statiquement pour tester le jeu (sur le
navigateur, via `file:///home/you/some/path/hanoi/index.html`). Il inclue déjà
quelques styles CSS pour un affichage minimal, et link les quelques scripts
fourni. De plus, il définit une `div` avec l'id `game`, qui est l'élément dans
lequel nous afficherons le jeu (à garder).

Ensuite, nous avons deux fichiers de styles : `css/reset.css` et
`css/styles.css`. Ce second fichier est très peu fourni, et met en place une
interface très simple, mais juste assez pour afficher le jeu dans une page web.

Enfin, deux fichiers JS sont déjà présents : `js/compute.js` et
`js/constants.js`. Nous reviendrons très vite sur leur utilité.

Tous les chemins de fichier sont référencés relativement au dossier `hanoi`,
racine du projet.

### Constants

Certaines valeurs du jeu sont choisi arbitrairement. Par exemple, l'espacement
entre les tours, le nombre d'étages, la vitesse d'animation... Ces valeurs sont
définies dans le fichier `js/constants.js`. Des valeurs par défaut sont déjà
données à titre d'exemple, mais il est tout à fait possible, et même encouragé
de changer ces valeurs, et voir ce que ça donne.

Le but d'extraire ces constantes dans un fichier unique est d'une part pour être
capable de partager ces valeurs dans les différents fichiers, mais aussi
d'éviter les "magic values", les valeurs en dur dans le code. De plus, s'il est
nécéssaire de changer l'une de ces valeurs, cela peut être fait en ne touchant
qu'au fichier de déclaration de constantes. Voici une définition générale de
toutes les constantes utilisées.

```
TOWER_NB_LAYERS : le nombre total d'étages
GAME_SPACING : l'espacement entre les bords du canvas et les éléments du jeu
TOP_SPACING : l'espacement entre le bord haut du canvas et le haut des tours
TOWER_SPACING : l'espacement entre les tours
POLE_WIDTH : la largeur de la barre centrale d'une tour
BASE_HEIGHT : la hauteur du la base d'une tour
LAYER_HEIGHT : la hauteur d'un étage
LAYER_SPACING : l'espacement entre deux étages
LAYER_MIN_WIDTH : la largeur du plus petit étage
LAYER_ANIMATION_SPACING : l'espacement entre un layer en transition et le bord haut du canvas
ANIMATION_SPEED : la vitesse d'animation d'un étage entre deux tours
```

Ces définitions de valeurs devront être utilisées lors de l'implémentation des
fonctions du jeu. Je ne rapellerai pas les constantes à utiliser pour chaque
fonction, il faut donc garder ça en tête et utiliser les bonnes constantes au
bon moment.

Certaines définition ne seront utilisées que dans le fichier de calculs, déjà
fourni. Toutes ne vont donc pas apparaître dans le code à écrire...

> Note : Le nombre de tours ne peux pas dépasser un certain nombre, sinon la
> création de la palette de couleurs ne pourra plus fonctionner, et le jeu va
> crasher. Il vaut mieux le garder inférieur à 10.

### Sructures de données

Le jeu fait évoluer des étages sur des tours, dessine des rectangles et des
animations... Il nous faut un moyen de représenter tout ça, pour pouvoir les
manipuler dans notre code. Le but est donc de structurer nos données.

Premièrement, il existe le point. Le point sera représenté par un objet
contenant deux propriétés : `x` et `y`. Difficile de faire plus simple...

Ensuite, nous manipulerons surtout des rectangles. Et comme `Rectangle` c'est
long à écrire, nous allons le réduire à `Rect`. Ce sera un objet contenant
deux propriétés informant sur la position du coin suppérieur gauche du
rectangle (la encore, `x` et `y`), ainsi que deux autres propriétés donnant
les dimensions du rectangle (`width` et `height`).

Enfin, mais c'est pas pour tout de suite, certains objets seront animés. Pour
représenter une animation, nous utiliserons une fois de plus un objet, avec
cette fois trois propriétés : la tour de départ de l'étage en transition, la
tour d'arrivée, et le pourcentage d'avancement de la transition (un nombre
entre `0` et `1`).

Si on récapépèt, on a :

```js
Point = {
  x: number,
  y: number,
}

Rect = {
  x: number,
  y: number,
  width: number,
  height: number,
}

Animation = {
  fromTower: Tower,
  toTower: Tower,
  step: number,
}
```

Oh wait... on a pas encore définit les `Tower` et `Layer` ! En effet, ces
structures de données (des classes), seront à faire plus tard. No spoil.

### Library

La seule et unique bibliothèque utilisée dans le projet est
[values.js](https://github.com/noeldelgado/values.js). Elle permet de manipuler
simplement des couleurs, et de les décliner en y ajoutant du blanc et du noir,
ce qui nous permettra de créer facilement des dégradés. Toutes les couleurs
utilisées dans le jeu seront donc des objet de type `Values`.

Voici un petit exemple d'utilisation de cette bibliothèque.

```
const color = new Values('#CC3399');
const divStyle = 'width: 180px; height: 35px;';

for (let i = 0; i < 10; ++i) {
  const elem = document.createElement('div');
  const elemColor = color.shade(8 * i);

  elem.style = `${divStyle} background-color: ${elemColor.hexString()}`;
  document.body.appendChild(elem);
}
```

Nous pouvons voir qu'il est possible de créer une instance de Values en passant
une couleur sous forme de string hexadécimale à son constructeur. Il est aussi
possible de lui donner une couleur sous forme de string rgb ( par exemple,
`rgb(200, 80, 130)`).

Pour convertir l'instance de `Values` en couleur sous forme de string, il est
possible d'appeler sa méthode `hexString()`. Par contre, si la valeur donnée au
constructeur de `Values` est invalide, la valeur renvoyée par le contructeur ne
sera pas une instance de `Values`, mais une instance d'`Error` (bon à savoir
pour le débug).

Enfin, la dernière méthode de `Values` dont nous aurons besoin permet
d'assombrir une couleur. Cette méthode est `shade(number)`. La valeur passée en
paramètre est le pourcentage d'assombrissement entre `0` et `100`.

## Partie 0 : Calculer

Cette première partie sera certainement la plus simple, car elle n'est pas à
faire. Du moins, il n'y a pas de code à délivrer car tout est donné. Pour
éviter de se prendre la tête sur les calculs de positions et les interpolations
de mouvements, tout a été abstrait dans des fonctions de calculs.

Pour réussir l'exercise, il n'est pas nécéssaire de comprendre ces fonctions,
ni même d'aller regarder l'implémentation. Mais bon, ça fait pas de mal d'y
jeter un oeil quand même, au moins pour se faire une idée. Alors oui, je sais,
c'est fait comme un cochon, j'avais pas trop le temps de réfléchir plus que ça
ce jour la. Mais bon, ça marche (je crois). C'est l'essentiel.

Ces fonctions vont servir au développement du jeu, alors il vadrait mieux
savoir ce à quoi elles correspondent, et comment les utiliser. C'est justement
le but de cette partie.

Toutes les fonctions sont regroupées au seins d'un même objet : `compute`. Pour
utiliser les fonctions décrites ici, il faudra alors passer par cet objet.
Toutes ? Non... Une fonction est accessible dans le scope globale, la fonction
`setDimensions`.

### Watsize

Justement nous en parlions, la fonction `setDimension` permet d'enregistrer la
largeur et la hauteur du jeu, ce qui permettera aux fonctions de calcul de
déduire certaines valeurs.

```
prototype : setDimensions(width: number, height: number) -> void
width     : la largeur du canvas
height    : la hauteur du canvas
```

Un appel à cette fonction va enregistrer les dimensions du canvas dans une
variable globale.

De manière générale, l'utilisation de variables globales est peu recommandée,
car elle laisse la possibilité à n'importe quelle fonction de modifier sa
valeur. Plus les fonctions touchent à cette variable comme elles veulent, et
plus le programme risque de se retrouver dans un état qui n'était pas prévu à
la base.

Mais bon... c'est quand même vachement cool d'éviter de se trimbaler les
dimensions du canvas à chaque fois que l'on veut dessiner. Dans le cadre de
l'exercice, on ne va pas se priver car cela nous simplifie bien le travail.

### AABB

Nous l'avons vu, pour représenter un rectangle, nous le utilisons un objet de
type `Rect`. Les fonctions suivantes permettent de calculer les positions et
dimensions d'un objet du jeu, de manière à l'afficher au bon endroit, ou bien
de calculer les éléments séléctionnés par la souris.

- `poleRect(tower: Tower) -> Rect` : calcul le rect de la barre centrale d'une tour
- `baseRect(tower: Tower) -> Rect` : calcul le rect de la base d'une tour
- `towerRect(tower: Tower) -> Rect` : calcul le rect d'une tour
- `layerRect(layer: Layer, pos: number) -> Rect` : calcul le rect du layer d'une tour
- `animatiedLayerRect(layer: Layer, animation: Animation) -> Rect` : calcul le rect d'un layer en transition entre deux tours

L'argument `pos` de la fonction `layerRect` correspond à la position de l'étage
dans la tour à laquelle elle est attachée.

L'argument `animation` de la fonction `animatedLayerRect` correspond à un objet
représentant une transition d'un étage d'une tour à une autre. Nous aurons
l'occasion d'en reparler bien vite.

### Just checkin'

Voici une dernière fonction nous sera bien utile. Elle permet de vérifier si un
point est à l'intérieur d'un `Rect`.

```
prototype : inBounds(point: Point, bounds: Rect) -> boolean
point     : le point
bounds    : le rect
retour    : true seulement si le point est à l'intérieur du rect
```

## Partie 1 : Dessiner

Dans cette première partie, nous allons concoqueter les briques de bases du
jeu : des fonctions de dessin. Nous pourons ensuite les utiliser dans
l'implémentation du jeu lui même, sans avoir à réfléchir à l'affichage. Ces
fonctions concernent toutes l'affchage, nous allons ainsi les regrouper dans
un fichier `js/draw.js`, qu'il ne faudra pas oublier de linker dans le
`index.html`.

Pour dessiner, nous allons utiliser
[l'API du canvas](https://www.w3schools.com/tags/ref_canvas.asp), qui permet de
tracer des formes géométriques, traits, textes, images... Tout cela via le code
JS. Les fonctions et propriétés dont nous aurons besoin sont :

- lineWidth
- fillStyle
- beginPath
- stroke
- fillRect
- rect

Il n'est pas nécéssaire de bien connaître l'utilisation du canvas pour cet
execrice, bien qu'une compréhension globale soit conseillée (au moins des
fonctions utilisées).

Voyons maintenant les fonctions elles même. Pour tester ces fonctions, il est
possible de créer (et de linker) un fichier de test.

### &lt;canvas /&gt;

Tout d'abord, il nous sera bien utile de pouvoir dessiner quelque part dans la
page. Le but de cette première fonction est donc de créer un élément
[HTML canvas](https://www.w3schools.com/tags/tag_canvas.asp), dans lequel nous
pourrons voir notre jeu évoluer.

Après avoir créer le canvas, il faut affecter les bonnes valeurs dans les
propriétés `width` et `height` de l'élément, et finalement insérer le
canvas dans le dom.

```
prototype : createCanvas(root: HTMLNode, width: number, height: number) -> HTMLNode
root      : l'élément HTML dans lequel le canvas doit être inséré
width     : la largeur du canvas (en px)
height    : la hauteur du canvas (en px)
retour    : l'élément HTML canvas
```

### Du vert ! Du bleu !

Allez, c'est enfin parti ? On peut coder ?

Le but de cette fonction est de générer une couleur aléatoire. Elle sera bien
entendu utilisé dans le reste du code pour créer une palette de couleurs pour
les paliers des tours.

```
prototype : getRandomColor() -> Values
retour    : la couleur générée
```

### Shades of the rainbow

Cette fonction va permettre de créer la palette de couleurs. Elle va commencer
par choisir une couleur de base aléatoirement, puis elle va la décliner autant
de fois que nécéssaire en couleurs plus sombres.

```
prototype : buildColorPalette(n) -> Array<Values>
n         : nombre de couleurs de la palette
retour    : la palette de couleurs générées
```

### Les premières briques

Fini les petites fonctions de génération de couleurs, on entre dans le vif du
sujet. Tous les éléments du jeu sont représentés par des rectangles, nous
allons donc créer une fonction qui va dessiner un rectangle à un endroit
donné, et d'une certaine couleur.

Pour donner un effet un peu moins "flat" à notre jeu, nous allons aussi
dessiner les contours de chaque rectangle.

```
prototype : drawRect(rect: Rect, fill: Values) -> void
rect      : les coordonnées et dimensions du rectangle à dessiner
fill      : la couleur du rectangle
```

Plus tard dans le code, nous allons changer la couleur de la stroke pour les
dessins dans le canvas (la propriété stokeStyle). Elle sera de `#00000099` (à
ajouter dans le fichier de test).

> Note : il va être nécéssaire d'informer les fonctions de calcul de la taille
> du canvas (`canvas.width` et `canvas.height`) pour y voir quelque chose.

### Etage par étage

En dehors de toute fonction (préférablement en haut du fichier), nous allons
définir trois constantes : `TOWER_COLOR`, `LAYERS_COLORS` et
`SELECTED_LAYER_COLOR`, respectivement la couleur d'une tour, une palette de
couleurs, anisi qu'une couleur random.

La couleur d'une tour sera une `new Values('#666')`.

Premier vrai élément du jeu à afficher : un étage de la tour. C'est simplement
un rectangle, dont les couleurs viennent des constantes préalablement définies.

```
prototype : drawLayer(layer: Layer, i: number) -> void
layer     : l'étage à dessiner
i         : la position de l'étage dans la tour
```

Arf. Pour tester cette fonction, nous avons besoin d'un étage. Fort
heureusement, il est possible d'en représenter une avec un simple objet. Ce
n'est pas le vrai type de `Layer` que nous enverrons à `drawLayer` plus tard
lors du dessin du jeu, mais ça fait l'affaire pour tester la fonction.

Tant que j'y suis, voilà une tour remplie d'étages. Elle sera utile pour la
fonction suivante.

```
const tower = {
  position: 1,
  layers: [],
};

for (let i = 0; i < TOWER_NB_LAYERS; ++i) {
  tower.layers.push({
    size: i + 1,
    selected: false,
    tower: tower,
  });
}
```

### C'est comme un "T" à l'envers

Maintenant que nous pouvons afficher un étage, c'est au tour de la tour (haha).

```
prototype : drawTower(tower: Tower)
tower     : devine ?
```

### Ça bouge !

Le moment est venu pour commencer à parler d'animation... Nous reviendrons sur
cette partie lors de l'implem du jeu lui-même, mais pour l'instant nous allons
nous concentrer sur la fonction de dessin d'un étage de la tour à un certain
moment d'une animation.

```
prototype : drawAnimatedLayer(layer: Layer, animation: Animation)
layer     : l'étage en transition
animation : l'animation
```

Pour nous, une animaiton sera représentée sous la forme d'un objet, contenant
les propriétés :

- `fromTower` : la tour de départ de l'étage
- `toTower`   : la tour d'arrivée de l'étage
- `step`      : un entier entre 0 et 1

Les propriétés d'un objet d'animaiton sont relativement simples. La seule
propriété peut-être un peu obscure serait le *step*. Il s'agit simplement du
pourcentage d'avancement de la transition. Pour tester cette fonction, et voir
l'animation, voici un petit bout de code...

```js
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

  // draw the animation here...

  if (animation.step < 1)
    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
```

Ce snippet sera approfondi d'ici quelques lignes (de code). Ce n'est pas trop
la peine de chercher à comprendre dès maintenant.

Ca y est ! On en a fini avec les fonctions de dessin. Oui oui, c'est tout ce
dont nous aurons besoin par la suite. Fastoch' non ?

## Partie 2 : Coder

Enfin, nous y voilà... Nous n'avons plus besoin de notre fichier de test, et
pouvons créer le dernier fichier nécéssaire au jeu (ou presque) : `js/game.js`.
Ce fichier contiendra bien sur toute la logique du jeu lui-même, et utilisera
les fonctions de calcul et de dessin.

Dans ce fichier, nous allons déclarer trois classes (hop, hop, hop... pas tout
de suite, oh !), qui représenteront un étage, une tour et le jeu. Ces classes
doivent être déclarées en mode "old school", avec des fonctions (et non pas
avec le mot clé `class` des versions récentes de JavaScript).

Une fonction se comporte comme le constructeur d'une classe en
[POO](https://fr.wikipedia.org/wiki/Programmation_orient%C3%A9e_objet), et il
est possible de lui ajouter des attributs et des méthodes via le mot clé
`this`. La définition de méthodes s'effectue via le
[`prototype`](https://www.w3schools.com/js/js_object_prototypes.asp)).
Un bref exemple permettera de mieux comprendre :

```js
/* Beer class definition */

function Beer(name, degree) {

  /* attributes */

  this.name = name;
  this.degree = degree;

}

/* methods */

Beer.prototype.serve = function(glass) {
  glass.wash();
  glass.fill(this);
}

Beer.prototype.willIGetDrunk = function(nbBeers) {
  console.log(this.degree);
  return nbBeers * this.degree > 20;
}
```

> Attention ! si nous décidons de déclarer une fonction à l'intérieur de la
> définition de la classe, alors le mot clé `this` fera référence à l'inner
> fonction. `var that = this`, toussa...

Let's go?

### Définition du Game

Et ouais, on commence par le gros morceau. la classe `Game` aura besoin d'un
constructeur, qui se chargera d'initialiser les éléments dont l'instance du jeu
aura besoin. On lui fournira en argument l'élément du DOM dans lequel déssiner
le jeu.

```
prototype : Game(root: HTMLNode)
root      : L'élément dans lequel dessiner le jeu
```

Le constructeur ne retourne pas de valeur. Il sera appelé avec le mot clé
`new`, ce qui permettera de récupérer l'instance de l'objet pour appeler
ses méthodes.

Le jeu va devoir afficher des dessins sur la page. Il aura donc besoin d'un
canvas, qu'il pourra stocker dans ses attributs. Comme nous l'avons vu, les
fonctions de dessin attendent, non pas un canvas, mais un context pour
dessiner. Il serait ainsi plus sympa de stocker ce context directement dans
les attributs, plutôt que d'aller le chercher dans le canvas.

De plus, le jeu va avoir besoin d'un ensemble de tours. Le constructeur a
simplement besoin d'enregistrer un tableau vide.

> Note : les dimensions du canvas dans réf sont 620x280.

### int main(void);

Bon, il est temps d'ajouter le tout dernier ficher de la codebase :
`js/main.js`. Ce sera le point d'entrée du jeu.

```js
var body = document.getElementsByTagName('body')[0];
var root = document.getElementById('game');

body.onload = () => {
  var game = new Game(root);

  window.game = game;
};
```

Ce code va simplement instancier un nouveau jeu, lorsque la page est prête.

Enfin, pour faciliter le débug, voici un petit hack intéressant... La console
de chrome peut accéder directement à tous les objets stockés dans
[`window`](https://developer.mozilla.org/en-US/docs/Web/API/Window). Avec un
simple `window.game = game`, il est possible d'accéder à l'instance du jeu à
tout moment, d'appeler ses méthodes.... Bon débug !

### Let's start

Notre game est bien instancié, mais il est tout vide... La première méthode du
jeu que nous allons implémenter est l'initialisaiton.

```
prototype : initialize() -> void
```

Malgré son prototype relativement simple, cette fonction a pas mal de choses
à faire.

Premièrement, elle va devoir appeler la fonction `setDimensions`, dans le but
d'informer le module de calcul de la taille du canvas (les informations de
largeur et de hauteur sont disponibles dans le canvas lui-même).

C'est pas tout... il y aura d'autres choses à faire, mais plus tard. Nous
pouvons laisser un petit console.log à la fin de l'initialisation, nous
informant que le jeu est prêt.

### Les étages et la tour

Comme promis, nous avons, en plus de la class `Game`, les classes `Tower` et
`Layer`. Allez, on fait les deux à la fois ?

Bon, pour l'instant on ne va faire que les constructeurs hein. Et puis
d'ailleurs il n'y aura aucune méthode dans la class `Layer`, donc bon...
La class `Layer` va stocker trois informations : la tour à laquelle elle est
raattachée, sa taille et si elle est sélectionnée (par défaut, non ofc).

```
prototype : Layer(tower: Tower, size: number)
tower     : la tour à laquelle l'étage est rattaché
size      : la taille du layer, à partir de 1
```

La `Tower`, quant à elle, sera définie par une position ainsi qu'un ensemble de
`Layer` (vide par défaut).

```
prototype : Tower(position: number)
position  : la position de la tour (1, 2 ou 3)
```

### Initialization, part II

Pour initialiser le jeu, il nous faudra bien ajouter des étages dans la tour.
Peut-être qu'une méthode de la classe `Tower` serait la bienvenue ? Elle se
chargerait de changer l'attribut `tower` de l'étage, et de l'ajouter dans son
tableau.

```
prototype : addLayer(layer: Layer) -> void
layer     : le layer à ajouter dans la tour
```

Tant qu'à faire, pourquoi pas ajouter une méthode qui remplit un certain nombre
d'étages ?

```
prototype : fill(n: number) -> void
n         : le nombre de layers à ajouter dans la tour
```

Maintenant qu'il est possible de créer des tours et de les remplir d'étages,
nous pouvons compléter l'intialisation du jeu. Nous n'avons qu'à créer 3 tours,
et à en remplir une au hasard.

> Note : comme annoncé dans la partie concernant les fonctions de dessin, nous
> allons set la couleur de trait à #00000099. Cela peut être fait pendant
> l'initialisation.

### Des seins

Pour l'instant, sauf dans la console, nous ne pouvons pas tester les fonction du
jeu déjà codées.

Une des fonction coeur du système est celle de dessin du jeu. Elle va tout
d'abord effacer tout le canvas, pour dessiner une nouvelle *frame*, c'est à dire
dessiner tous les éléments du jeu (les tours et les étages).

```
prototype : redraw() -> void
```

Ah et au fait, il faudrait certainement l'appeler à la fin de
l'initialisation !

### Intéractions

Pour jouer, l'utilisateur va devoir cliquer sur des parties du canvas, c'est
donc à nous d'écouter l'event `onclick`, pour faire évoluer le jeu en
conséquence. Pour ce faire, let's add a `onClick` method, sans oublier de la
binder correctement au listener du canvas (dans l'initialisation).

```
prototype : onClick(e: Event) -> void
e         : le click event
```

Pour l'instant, notre but sera de changer l'attribut `selected` du layer
lorsque l'on clic dessus, et de voir sa couleur changer. Cela implique que nous
devons être capable de savoir sur quel étage est le pointeur au moment du clic.
Il semblerait que cela nous donne l'occasion d'implémenter une nouvelle
méthode :

```
prototype : getLayerAt(x: number, y: number) -> ?Layer
x         : la coordonnée x du point
y         : la coordonnée y du point
retour    : l'étage au point (x, y), ou null si aucun n'est trouvé
```

> Hint : les fonctions de calcul peuvent être bien pratiques...

Bien, si le nom de la variable event s'apelle `e`, nous pouvons maintenant
récupérer le layer cliqué via :

```js
this.getLayerAt(e.offsetX, e.offsetY)
```

Après avoir sélectionné ou désélectionné un étage, il peut être pertinent de
logger un message dans la console. Cela permettera de garder une trace des
opérations effectuées.

Aussi, nous aurons besoin de garder une référence vers le layer sélectionné au
cours du jeu. Ajoutons-le dans les attributs de la class `Game`.

Grosse partie, n'est-ce pas ? Et c'est pas fini !

### You shall not select this level

Obviously, something's wrong here. Nous ne sommes pas sensé sélectionner un
étage en plein milieu d'une tour. J'ai l'impression que l'on va avoir besoin
d'un peu de validation... Nous allons donc ajouter une méthode du `Game`, pour
vérifier si l'utilisateur peut sélectionner un étage.

```
prototype : canSelectLayer(layer: Layer) -> boolean
layer     : l'étage à valider
```

Tiens et tant qu'on y est, il est fort probable que l'on ait besoin d'une
fonction qui valide que l'utilisateur à le droit de sélectionner une tour.

```
prototype : canSelectTower(tower: Tower) -> boolean
tower     : la tour à valider
```

### PLAY!

Ca avance ! Mais ne nous arrêtons pas en si bon chemin. Comme nous avons fait
pour récupérer l'étage à un point donné, nous allons faire de même pour une
tour.

```
prototype : getTowerAt(x: number, y: number) -> ?Tower
x         : la coordonnée x du point
y         : la coordonnée y du point
retour    : la tour au point (x, y), ou null si aucune n'est trouvée
```

Et pour pouvoir jouer une partie entière, il ne nous reste plus qu'à déplacer
un étage d'une tour à l'autre. Dans le `onClick`, nous pouvons maintenant
récupérer la tour au coordonées de la souris (en plus de l'étage), et vérifier
si elle peut être sélectionnée. Si c'est le cas, alors on peut passer l'étage
sélectionné d'une tour à l'autre, et de réinitialiser la sélection.

La encore, un petit message de log serait le bienvenu.

Pour alléger le code de cette fonction, il nous faudrait une méthode qui nous
permette de retirer le dernier étage d'une tour (à placer dans la classe
`Tower`).

```
prototype : popLayer() -> ?Layer
retour    : le dernier étage, ou null si la tour n'a pas d'étages
```

Plus que les animations, et notre jeu sera déjà pas trop mal.

### Animations - Les outils

Ahh... les animations en HTML. En fait, c'est super simple. L'environnement du
navigateur nous offre une API pour les animations composée d'une seule fonction:
[`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame).

requestAF (pour les intimes), nous permet de demander au navigateur de nous
avertir lorsqu'une nouvelle frame est disponible. Son prototype est ainsi :

```js
requestAnimationFrame(callback: Function) -> number
```

La fonction `callback` passée en paramètre (que nous devons écrire), va donc
être appelée par le navigateur lorsque la prochaine frame est disponible, nous
donnant la possibilité de mettre à jour l'affichage du jeu (un appel à
`redraw`, en somme). Si nous appelons requestAF depuis la fonction `callback`,
en redonnant cette même fonction `callback` en paramètre, alors elle sera
appelée ~60 fois par seconde, ce qui garantie une animation fluide.

Un petit exemple pour faire passer tout ça ? Go
[codepen](https://codepen.io/pen/) !

On déclare un `<canvas>` dans le HTML :

```html
<canvas width="50" height="30" />
```

et dans le JS, on va commencer par récupérer ce `<canavs>`, son context, et
définir la couleur de remplissage à rouge :

```js
var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d');

ctx.fillStyle = '#F00';
```

Nous aurons aussi besoin de d'une variable qui va évoluer au fil du temps.

```js
var t = 0;
```

Voyons maintenant la fameuse fonction `callback`, que nous allons plutôt
appeler `frame` :

```js
function frame() {
  t += 0.1;

  ctx.clearRect(0, 0, 300, 200);
  ctx.fillRect(Math.sin(t) * 10 + 10, 0, 30, 30);

  requestAnimationFrame(frame);
};
```

Cette fonction fait évoluer la variable `t`, efface le canvas, et dessine un
carré dont la position varie selon un calcul dépendant de `t`. L'utilisation
d'un sinus permet simplement d'avoir une animation sympa qui se répète.

Enfin, frame appelle requestAF, et l'animation est la. Enfin presque. Il ne
manque plus qu'à initier le premier appel à `frame` :

```js
requestAnimationFrame(frame);
```

### Animations - Suite et fin

Nous avons maintenant toutes les clés en main pour implémenter l'animation
d'un étage d'une tour à l'autre. C'est la méthode `animate` du game qui va
gérer tout ça. Voici à quoi elle doit ressembler :

```
prototype : animate(fromTower: Tower, toTower: Tower) -> void
fromTower : la tour de départ
toTower   : la tour d'arrivée
```

Il n'est pas nécéssaire de donner en paramètre l'étage à déplacer, car il
s'agit forcément de l'étage en haut de la tour de départ, auquel nous avons
accès. En revanche, il nous faut garder en mémoire l'animation, dans les
attributs de la classe `Game` par exemple.

La fonction `frame` va être une inner fonction de la méthode `animate`. Elle va
faire évoluer la propriété `step` de l'anmiation à chaque appel, en lui
ajoutant la valeur de la constante `ANIMATION_SPEED`, divisée par 100 (le but
de ce facteur 100 est de garder une valeur "raisonnable" dans les constantes,
car sinon, il aurait fallu définir `ANIMATION_SPEED = 0.06`).

Tant que la propriété `step` est inférieur à `1`, `frame` va appeler
`requestAF` avec elle-même en paramètre, comme vu dans l'exemple. Sinon, elle
devra appeler une nouvelle méthode de la class `Game` : `endAnimate`.

```
prototype : endAnimate() -> void
```

Le but de cette ultime fonction de la classe `Game` sera de rétablir toutes les
valeurs du jeu dans un état cohérent (désélection de l'étage, remise à `null` de
l'animation, ...). Une fois que tout est bon, elle pourra appeler `redraw`.

Par contre, l'étage animé n'est pas dessiné (pour l'instant). Ajoutons l'appel à
la fonction de dessin d'un layer animé dans redraw, si une animation est en
cours.

Nous n'avons plus qu'à appeler la fonction d'animation dans la fonction qui
gère le clic de la souris, et... bah j'crois bien qu'on a fini.

## Partie 3 : Résoudre

Pour aller plus loin, je propose cette troisième partie, dont le but sera de
proposer une implémentation de la résolution du jeu. L'objectif est de voir le
jeu avancer tout seul, via un algorithme qui décide comment déplacer les étages
d'une tour à une autre en respectant les règles de base.

L'algo de résolution existe déjà et est présent et trouvable très rapidement sur
le net (sur la page wiki des tours de Hanoï il me semble), mais le but de cette
partie est de le trouver sans regarder la solution.

La résolution n'est pas présente dans la réf, l'implémentation est totallement
libre. Bonne chance :).

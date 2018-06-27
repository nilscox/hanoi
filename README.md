# Hanoï

Le but de ce projet est de réaliser un petit jeu en JavaScript : [les tours de
Hanoï](https://fr.wikipedia.org/wiki/Tours_de_Hano%C3%AF).

## Introduction

### Code style

### Constants

### Sructures de données

### Library

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
Prototype : setDimensions(width: number, height: number) -> void
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

- `poleRect(tower) -> Rect`: calcul le rect de la barre centrale d'une tour
- `baseRect(tower) -> Rect`: calcul le rect de la base d'une tour
- `towerRect(tower) -> Rect`: calcul le rect d'une tour
- `layerRect(layer, pos) -> Rect`: calcul le rect du layer d'une tour
- `animatiedLayerRect(layer, animation) -> Rect`: calcul le rect d'un layer en
  transition entre deux tours

L'argument `pos` de la fonction `layerRect` correspond à la position de l'étage
dans la tour à laquelle elle est attachée.

L'argument `animation` de la fonction `animatedLayerRect` correspond à un objet
représentant une transition d'un étage d'une tour à une autre. Nous aurons
l'occasion d'en reparler bien vite.

### Just checkin'

Voici une dernière fonction nous sera bien utile. Elle permet de vérifier si un
point est à l'intérieur d'un `Rect`.

```
Prototype : inBounds(point: Point, bounds: Rect) -> boolean
point     : le point
bounds    : le rect
Retour    : true seulement si le point est à l'intérieur du rect
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

### <canvas />

Tout d'abord, il nous sera bien utile de pouvoir dessiner quelque part dans la
page. Le but de cette première fonction est donc de créer un élément
[HTML canvas](https://www.w3schools.com/tags/tag_canvas.asp), dans lequel nous
pourrons voir notre jeu évoluer.

Après avoir créer le canvas, il faut affecter les bonnes valeurs dans les
propriétés `width` et `height` de l'élément. Nous pouvons maintenant insérer le
canvas dans le dom.

```
Prototype : createCanvas(HTMLNode) -> HTMLNode
HTMLNode  : l'élément HTML dans lequel le canvas doit être inséré
Retour    : l'élément HTML canvas
```

### Du vert ! Du bleu !

Allez, c'est enfin parti ? On peut coder ?

Le but de cette fonction est de générer une couleur aléatoire. Elle sera bien
entendu utilisé dans le reste du code pour créer une palette de couleurs pour
les paliers des tours.

```
Prototype : getRandomColor() -> Values
Retour    : la couleur générée
```

### Shades of the rainbow

Cette fonction va permettre de créer la palette de couleurs. Elle va commencer
par choisir une couleur de base, puis elle va la décliner autant de fois que
nécéssaire en couleurs plus sombres.

```
Prototype : `buildColorPalette(n) -> Array<Values>`
n         : nombre de couleurs de la palette
Retour    : la palette de couleurs générées
```

### Les premières briques

Fini les petites fonctions de génération de couleurs, on entre dans le vif du
sujet. Tous les éléments du jeu sont représentés par des rectangles, nous
allons donc créer une fonction qui va dessiner un rectangle à un endroit
donné, et d'une certaine couleur.

Pour donner un effet un peu moins "flat" à notre jeu, nous allons aussi
dessiner les contours de chaque rectangle. Plus tard dans le code, nous allons
changer la taille du trait pour les dessins dans le canvas (la propriété
lineWidth). Elle sera de 0.5.

```
Prototype : drawRect(rect: Rect, fill: Values) -> void
rect      : les coordonnées et dimensions du rectangle à dessiner
fill      : la couleur du rectangle
```

### Etage par étage

Premier vrai élément du jeu à afficher : un étage de la tour. La couleur dans
laquelle affcher la tour doit venir de la palette de couleurs. La constante
`LAYERS_COLORS` est un tableau contenant les valeurs de chaque étage, rangé par
niveau (du plus petit au plus large).

Si l'étage est séléctionné, alors il faudra qu'il soit affiché dans une couleur
différente de celle venant de la palette.

```
Prototype : drawLayer(layer: Layer, i: number) -> void
layer     : l'étage à dessiner
i         : la position de l'étage dans la tour
```

### C'est comme un "T" à l'envers

Maintenant que nous pouvons afficher un niveau, c'est au tour de la tour
(haha).

```
Prototype : drawTower(tower: Tower)
tower     : devine ?
```

### Ca bouge !

Le moment est venu pour commencer à parler d'annimation... Nous reviendrons sur
cette partie lors de l'implem du jeu lui-même, mais pour l'instant nous allons
nous concentrer sur la fonction de dessin d'un étage de la tour à un certain
point d'une animation.

```
Prototype : drawAnimatedLayer(layer: Layer, animation: Animation)
layer     : l'étage en transition
animation : l'animation
```

Pour nous, une animaiton sera représentée sous la forme d'un objet, contenant
les propriétés :

- `fromTower` : la tour de départ de l'étage
- `toTower`   : la tour d'arrivée de l'étage
- `layer`     : l'étage actuellement en transition d'une tour à l'autre
- `step`      : un entier entre 0 et 1

Les propriétés d'un objet d'animaiton sont relativement simples. La seule
propriété peut-être un peu obscure serait le *step*. Il s'agit simplement du
pourcentage d'avancement de la transition. Pour tester cette fonction, et voir
l'animation, voici un petit bout de code...

```
const animation = {
  // ...
  step: 0,
};

function frame() {
  step += 0.01;

  // draw the animation here

  if (step < 1)
    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
```

Ce snippet sera approfondi d'ici quelques lignes (de code).

Ca y est ! On en a fini avec les fonctions de dessin. Oui oui, c'est tout ce
dont nous aurons besoin par la suite. Fastoch' non ?

## Partie 2 : Coder

Enfin, nous y voilà... Nous n'avons plus besoin de notre fichier de test, et
pouvons créer le dernier fichier nécéssaire au jeu (ou presque) : `js/game.js`.
Ce fichier contiendra bien sur toute la logique du jeu lui-même, et utilisera
les fonctions de calcul et de dessin.

Dans ce fichier, nous allons déclarer trois classes (hop, hop, hop... pas tout
de suite, oh !), qui représenteront les étages, les tours et le jeu. Ces
classes doivent être déclarées en mode "old school", avec des fonctions (et non
pas avec le mot clé `class` des versions récentes de JavaScript).

Une fonction se comporte comme le constructeur d'une classe en
[POO](https://fr.wikipedia.org/wiki/Programmation_orient%C3%A9e_objet), et il
est possible de lui ajouter des attributs et des méthodes via le mot clé
`this`. Un bref exemple permettera de mieux comprendre :

```
/* Beer class definition */
function Beer(name, degree) {

  /* attributes */

  this.name = name;
  this.degree = degree;

  /* methods */

  this.serve = (glass) => {
    // ...
  };

  this.drink = (someone) => {
    // ...
  };

}
```

Il existe une notation un peu différente pour ajouter des méthodes à une classe
(via le [`prototype`](https://www.w3schools.com/js/js_object_prototypes.asp)),
mais autant garder la sytaxe lisible en passant par des arrow functions.

> Attention ! si nous décidons de déclarer une fonction avec le mot clé
> function à l'intérieur de la définition de la classe, alors le mot clé `this`
> fera référence à l'inner fonction. `const that = this`, toussa...

Let's go?

### Définition du Game

Et ouais, on commence par le gros morceau. la classe `Game` aura besoin d'un
constructeur, qui se chargera d'initialiser les éléments dont l'instance du jeu
aura besoin. On lui fournira en paramêtre l'élément du DOM dans lequel déssiner
le jeu.

```
Prototype : Game(root: HTMLNode)
root      : L'élément dans lequel dessiner le jeu
```

Le constructeur ne retourne pas de valeur. Il sera appelé avec le mot clé
`new`, ce qui permettera de récupérer l'instance de l'objet pour appeler
ses méthodes.

Le jeu va devoir afficher des dessins sur la page. Il aura donc besoin d'un
canvas, qu'il pourra stocker dans ses attributs. Comme nous l'avons vu, les
fonctions de dessin attendent, non pas un canvas, mais un context pour
dessiner. Il serait ainsi plus sympa de stocker ce context directement dans
les attributs, plutôt que d'aller le chercher dans le canvas. Ces deux
attributs peuvent rester à null (pour le moment).

De plus, le jeu va avoir besoin d'un ensemble de tours. Le constructeur a
simplement besoin d'enregistrer un tableau vide.

### int main(void);

Bon, il est temps d'ajouter le tout dernier ficher de la codebase :
`js/main.js`. Ce sera le point d'entrée du jeu.

```
const body = document.getElementsByTagName('body')[0];
const root = document.getElementById('game');

body.onload = () => {
  const game = new Game(root);

  window.game = game;
};
```

Ce code va simplement instancier un nouveau jeu, lorsque la page est prête.

Enfin, pour faciliter le débug, voici un petit hack intéressant... La console
de chrome peut accéder directement à tous les objets stockés dans
[`window`](https://developer.mozilla.org/en-US/docs/Web/API/Window). Avec un
simple `window.game = game`, il est possible d'accéder à l'instance à tout
moment, d'appeler ses méthodes.... Bon débug !

### Let's start

Notre game est bien instancié, mais il est tout vide... La première méthode du
jeu que nous allons implémenter est l'initialisaiton.

```
Prototype : initialize() -> void
```

Malgré son prototype relativement simple, cette fonction a pas mal de choses
à faire.

Premièrement, elle va devoir créer le canvas, et récupérer son context.

Ensuite, elle va devoir appeler la fonction `setDimensions`, dans le but
d'informer le module de calcul de la taille du canvas (les informations de
largeur et de hauteur sont disponibles dans le canvas lui-même).

C'est pas tout... il y aura d'autres choses à faire, mais plus tard. Nous
pouvons laisser un petit console.log à la fin de l'initialisation, nous
informant que le jeu est prêt.

### Les étages et la tour

Comme promis, nous avons, en plus de la class `Game`, les class `Tower` et
`Layer`. Allez, on fait les deux à la fois ?

Bon, pour l'instant on ne va faire que les constructeurs hein. Et puis
d'ailleurs il n'y aura aucune méthode dans la class `Layer`, donc bon...
La class `Layer` va stocker trois informations : la tour à laquelle elle est
raattachée, sa taille et si elle est sélectionnée (par défaut, non ofc).

```
Prototype : Layer(tower: Tower, size: number)
tower     : la tour à laquelle l'étage est rattaché
size      : la taille du layer, à partir de 1
```

La `Tower`, quant à elle, sera définie par une position ainsi qu'un ensemble de
`Layer`.

```
Prototype : Tower(position: number)
position  : la position de la tour (1, 2 ou 3)
```

### Initialization, part II

Pour initialiser le jeu, il nous faudra bien ajouter des étages dans la tour.
Peut-être qu'une méthode de la classe `Tower` serait la bienvenue ? Elle se
chargerait de changer l'attribut `tower` de l'étage, et de l'ajouter dans son
tableau.

```
Prototype : addLayer(layer: Layer) -> void
layer     : le layer à ajouter dans la tour
```

Tant qu'à faire, pourquoi pas ajouter une méthode qui remplit un certain nombre
d'étages ?

```
Prototype : fill(n: number) -> void
n         : le nombre de layers à ajouter dans la tour
```

Maintenant qu'il est possible de créer des tours et de les remplir d'étages,
nous pouvons compléter l'intialisation du jeu. Nous n'avons qu'à créer 3 tours,
et à en remplir une au hasard.

### Des seins

Une des fonction coeur du système est la fonction de dessin du jeu. Elle va
tout d'abord effacer tout le canvas, pour dessiner une nouvelle *frame*.
Ensuite, elle pourra dessiner tous les éléments du jeu.

```
Prototype : redraw() -> void
```

Ah et au fait, il faudrait certainement l'appeler à la fin de
l'initialisation !

### Intéractions

Pour jouer, l'utilisateur va devoir cliquer sur des parties du canvas, c'est
donc à nous d'écouter l'event `onclick`, pour faire évoluer le jeu en
conséquences. Pour ce faire, let's add a `onClick` method, sans oublier de la
binder correctement au listener du canvas (dans l'initialisation).

Pour l'instant, notre but sera de changer l'attribut `selected` du layer
lorsque l'on clic dessus, et de voir sa couleur changer. Cela implique que nous
devons être capable de savoir sur quel étage est le pointeur au moment du clic.
Il semblerait que cela nous donne l'occasion d'implémenter une nouvelle
méthode :

```
Prototype : getLayerAt(x: number, y: number) -> ?Layer
x         : la coordonnée x du point
y         : la coordonnée y du point
Retour    : l'étage au point (x, y), ou null si aucun n'est trouvé
```

> Hint : les fonctions de calcul peuvent être bien pratiques...

Bien, si le nom de la variable event s'apelle `e`, nous pouvons maintenant
récupérer le layer cliqué via :

```
this.getLayerAt(e.offsetX, e.offsetY)
```

Après avoir sélectionné ou désélectionné un étage, il peut être pertinent de
logger un message dans la console. Cela permettera de garder une trace des
opérations effectuées.

Pour voir le changement de couleur, il ne faudra pas oublier d'appeler
`redraw`.

Aussi, nous aurons besoin de garder une référence vers le layer sélectionné au
cours du jeu. Ajoutons-le dans les attributs de la class `Game`.

Grosse partie, n'est-ce pas ? Et c'est pas fini !

### You shall not select this level

Obviously, something's wrong here. Nous ne sommes pas sensé sélectionner un
étage en plein milieu d'une tour. J'ai l'impression que l'on va avoir besoin
d'un peu de validation... Nous allons donc ajouter une méthode du `Game`, pour
vérifier si l'utilisateur peut sélectionner un étage.

```
Prototype : canSelectLayer(layer: Layer) -> boolean
layer     : l'étage à valider
```

Tiens et tant qu'on y est, il est fort probable que l'on ait besoin d'une
fonction qui valide que l'utilisateur à le droit de sélectionner une tour.

```
Prototype : canSelectTower(tower: Tower) -> boolean
tower     : la tour à valider
```

### PLAY!

Ca avance ! Mais ne nous arrêtons pas en si bon chemin. Comme nous avons fait
pour récupérer l'étage à un point donné, nous allons faire de même pour une
tour.

```
Prototype : getTowerAt(x: number, y: number) -> ?Tower
x         : la coordonnée x du point
y         : la coordonnée y du point
Retour    : la tour au point (x, y), ou null si aucune n'est trouvée
```

Et pour pouvoir jouer une partie entière, il ne nous reste plus qu'à déplacer
un étage d'une tour à l'autre. Dans le `onClick`, nous pouvons maintenant
récupérer la tour au coordonées de la souris, et vérifier si elle peut être
sélectionnée. Si c'est le cas, alors on peut passer l'étage sélectionné d'une
tour à l'autre, et de réinitialiser la sélection.

La encore, un petit message de log serait le bienvenu.

Pour alléger le code de cette fonction, il nous faudrait une méthode qui nous
permette de retirer le dernier étage d'une tour (à placer dans la class
`Tower`).

```
Prototype : popLayer() -> ?Layer
Retour    : Le dernier étage, ou null si la tour n'a pas d'étages
```

Plus que les animations, et notre jeu sera déjà pas trop mal.

## Partie 3 : Résoudre

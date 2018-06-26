# Hanoï

Le but de ce projet est de réaliser un petit jeu en JavaScript : [les tours de
Hanoï](https://fr.wikipedia.org/wiki/Tours_de_Hano%C3%AF).

## Introduction

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

## Partie 3 : Résoudre

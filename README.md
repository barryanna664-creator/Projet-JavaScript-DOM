# AnBy Boutique

Mini-projet JavaScript & DOM — Licence 1 Informatique

## Présentation

AnBy Boutique est une application web interactive simulant une boutique en ligne de vêtements et accessoires (hijabs, abayas, accessoires). Elle permet à l'utilisateur de parcourir un catalogue de produits, de les filtrer, de les rechercher, de les trier par prix et de gérer un panier d'achat dynamique, le tout sans rechargement de page.

## Fonctionnalités

- **Catalogue de produits** : affichage dynamique des articles à partir d'un jeu de données statiques (tableau d'objets JavaScript).
- **Recherche** : barre de recherche permettant de filtrer les produits par nom.
- **Filtres par catégorie** : Tous, Hijabs, Abayas, Accessoires.
- **Tri des prix** : croissant ou décroissant.
- **Panier interactif** :
  - Ajout d'un article au panier
  - Modification de la quantité (+ / -)
  - Suppression d'un article ("Retirer")
  - Calcul automatique du total en FCFA
  - Sauvegarde du panier dans le navigateur (localStorage)

## Utilisation

1. Ouvrir le fichier `index.html` dans un navigateur.
2. Parcourir les produits, utiliser la barre de recherche, les boutons de catégorie ou de tri pour affiner l'affichage.
3. Ajouter un produit au panier ; ajuster la quantité avec les boutons **+** et **-**, ou le retirer avec le bouton **Retirer**.
4. Le total du panier se met à jour automatiquement en fonction des articles et des quantités sélectionnés.

## Structure du projet

- `index.html` — structure de la page
- `style.css` — mise en forme
- `script.js` — logique de l'application (gestion des événements, du panier, des filtres, du tri et du DOM)
- `images/` — visuels des produits

# Environnement d’animation

## Page active et transformation éditoriale

### Défilé vertical automatique

`vertical-gallery.js` et `vertical-gallery.css` ajoutent `#defile` juste après l’accueil. Deux colonnes reprennent six inspirations existantes et défilent en sens opposés (48 et 56 secondes par boucle). Chaque piste duplique son groupe à hauteur identique pour supprimer la rupture de boucle ; les copies sont masquées aux lecteurs d’écran et inertes.

Le bouton pause/reprise reste visible. Le survol à la souris et le maintien du doigt suspendent le défilement. L’animation s’arrête hors écran et lorsque l’onglet est masqué ; la préférence de réduction des animations affiche une galerie statique. Aucun nouveau produit ni nouveau visuel n’est inventé. Vérifications Chrome : sens opposés, hauteur des groupes, pause/reprise, toucher, largeur mobile, réduction des animations et absence d’exceptions JavaScript. Compilation réussie ; captures `vertical-desktop.png` et `vertical-mobile.png` dans `exports/luxury-review`.

La route `/` sert le document `app/original/maison-sillage.html` par le loader `app/routes/canva-original.ts`. Le fournisseur React décrit plus bas appartient à la page React conservée dans le dépôt ; il ne pilote pas le document HTML actuellement affiché.

Le document actif charge des ressources locales, dans cet ordre : `storefront.js` (catalogue et favoris), Lenis, `experience.js` (chargement et suivi des images), `editorial-motion.js` (parallaxe, révélations, curseur, carrousel), `lookbook.js` (regards et vue agrandie), puis `luxury.js` (entrée du hero, navigation éditoriale, aperçu et tiroir). Les styles suivent le même principe : base préservée et enrichissements séparés. Aucune nouvelle dépendance npm n’est nécessaire.

`storefront:cards`, `storefront:selection`, `storefront:dialog` et `storefront:ready` relient les enrichissements au catalogue existant. Le tiroir et les aperçus utilisent le même état de favoris et la même fonction de mise à jour. La sélection est conservée en local, avec un repli en mémoire lorsque le stockage est indisponible. Aucun panier, stock, prix, choix de taille ou paiement n’est simulé.

Le système visuel de la page active est documenté dans `apps/web/DESIGN.md` (relativement à la racine du dépôt). Les anciennes pages React et leurs documents restent conservés.

Les onze photographies réutilisées possèdent trois résolutions locales et des attributs `srcset`/`sizes`. Les originaux sont conservés, mais ne sont plus demandés par la page active. Les versions 1280 px représentent environ 91 % d’octets en moins au total. Cormorant est réutilisé, Inter est auto-hébergé avec sa licence.

### Vérification reproductible

Sur un Chrome isolé lancé avec le port de débogage 9334 et le serveur Vite sur 5173 :

```sh
node apps/web/scripts/verify-storefront.mjs
```

Variables facultatives : `CDP_URL`, `SITE_URL`, `SCREENSHOT_DIR`. Ce contrôle manipule la sélection du profil Chrome de test ; ne pas le lancer contre un profil personnel. Il vérifie la navigation, les filtres, l’aperçu, le zoom, les favoris persistants, les suppressions et le retour du focus, le tiroir, le carnet imprimable, le lookbook, le clavier et la navigation mobile. Les largeurs 320, 390, 768, 1034 et 1440 px sont contrôlées, ainsi que la réduction des animations et les exceptions JavaScript. Les captures de cette livraison sont dans `exports/luxury-review` à la racine du dépôt.

Compilation et contrôle TypeScript réussis. La revue indépendante a demandé trois corrections (focus lors de la suppression sur la page, contraste de la mention du hero, suppression du surtitre du carnet) puis les a toutes jugées résolues. Cette revue ne constitue pas une mesure de performances sur des appareils réels.

Le projet ouvert utilise React Router 8 + Vite et React 19, et non Next.js.
La configuration a été adaptée à ce framework après confirmation. Elle ne crée
aucune animation de titre, image, carte ou bouton et ne modifie pas leur design.

## Dépendances installées avec npm

| Dépendance | Version | Rôle |
| --- | --- | --- |
| `motion` | `14.14.0` | Futures apparitions, transitions et interactions React |
| `gsap` | `3.15.1` | Futures séquences de défilement avec ScrollTrigger |
| `@gsap/react` | `2.1.2` | Hook officiel avec nettoyage des animations React |
| `lenis` | `1.3.27` | Défilement fluide à la molette |

React Bits est distribué sous forme de composants source à sélectionner selon le
besoin. Le paquet npm `react-bits` est un autre projet : il n’est pas installé.

## Intégration

- `app/components/animation-provider.tsx` : fournisseur unique dans `root.tsx`.
- `app/lib/animations/gsap.ts` : chargement navigateur différé de GSAP,
  ScrollTrigger et du hook officiel. Aucun accès au DOM pendant le rendu serveur.
- `app/lib/animations/motion-features.ts` : fonctionnalités Motion différées via
  `LazyMotion`. Utiliser `m` pour les futurs composants sous ce fournisseur.
- `app/styles/animations.css` : neutralise le défilement CSS uniquement lorsque
  Lenis est actif. Le style de repli existant reste disponible autrement.

Lenis utilise le ticker GSAP, sans seconde boucle `requestAnimationFrame`.
Ses événements de défilement actualisent ScrollTrigger. Le réglage partagé
`gsap.ticker.lagSmoothing(0)` suit l’intégration officielle Lenis/GSAP ; ne pas le
redéfinir dans chaque composant. Les ancres sont activées, les marges et le
padding de défilement existants sont conservés. `syncTouch: false` garde le
défilement tactile natif. React Router conserve `ScrollRestoration` : le
fournisseur n’ajoute pas de remise à zéro concurrente lors des changements de route.

Les écouteurs, l’instance Lenis et sa fonction de ticker sont retirés à la
désactivation ou au démontage. Une génération invalidée ignore les imports
asynchrones qui se terminent trop tard, notamment sous React StrictMode.

## Mouvement réduit

`MotionConfig reducedMotion="user"` respecte la préférence système pour les
transformations et les animations de disposition. Les futures animations
d’opacité ou de couleur devront aussi adapter explicitement leur durée via
`useReducedMotion` si elles doivent disparaître entièrement.

Si `prefers-reduced-motion: reduce` est actif, le fournisseur ne démarre pas
Lenis. Un changement de préférence en cours de session détruit immédiatement
l’instance et rétablit le défilement natif. Les futurs effets GSAP doivent
dépendre de `runtime` et de `reducedMotion` pour être annulés au même moment.

## Règles pour les futurs effets

1. Motion anime les interactions React ; GSAP gère les séquences de défilement.
2. Ne pas animer la même propriété du même élément avec les deux bibliothèques.
   Utiliser des éléments imbriqués si les deux rôles doivent coexister.
3. Ne pas créer une seconde instance Lenis, une seconde boucle RAF ou un autre
   gestionnaire global de défilement. Éviter `ScrollSmoother` en parallèle.
4. Utiliser `useGSAP`, une portée `ref`, `revertOnUpdate: true` et des dépendances
   pour les effets GSAP. Ne pas utiliser `ScrollTrigger.killAll()` au démontage
   d’un composant : chaque composant nettoie seulement ses propres effets.
5. Attendre le runtime fourni par `useAnimationRuntime()` avant de créer un
   ScrollTrigger. Le runtime reste `null` sur le serveur, pendant le chargement,
   en mouvement réduit et en cas d’échec réseau. Le contenu doit rester visible.
6. Après une modification de mise en page pertinente, appeler
   `runtime.ScrollTrigger.refresh()`. Ne pas le faire à chaque rendu ou frame.
7. Réserver les effets de survol aux appareils compatibles et garder les actions
   utilisables au clavier et au toucher.

Exemple de structure, sans effet préconfiguré :

```tsx
import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { useAnimationRuntime } from "./components/animation-provider"

function FutureSection() {
  const scope = useRef<HTMLDivElement>(null)
  const { runtime, reducedMotion } = useAnimationRuntime()

  useGSAP(() => {
    if (!runtime || reducedMotion) return
    // Ajouter ici uniquement les effets validés pour cette section.
  }, { scope, dependencies: [runtime, reducedMotion], revertOnUpdate: true })

  return <div ref={scope}>Contenu visible par défaut</div>
}
```

## Vérification

Depuis la racine du monorepo :

```powershell
npm.cmd run typecheck --workspace web
npm.cmd run build --workspace web
npm.cmd run dev --workspace web
```

Sous Windows, `npm.cmd` évite le blocage éventuel de `npm.ps1` par la politique
d’exécution PowerShell, sans changer cette politique.

## Documentation officielle

- [Motion : installation](https://motion.dev/docs/react-installation)
- [MotionConfig et mouvement réduit](https://motion.dev/docs/react-motion-config)
- [GSAP avec React](https://gsap.com/resources/React/)
- [Lenis : intégration GSAP](https://github.com/darkroomengineering/lenis#gsap-scrolltrigger)
- [React Bits : installation par composant](https://reactbits.dev/get-started/installation)
# Page Canva actuellement servie

## Lookbook interactif

`lookbook.js` et `lookbook.css` enrichissent les trois regards existants sans dupliquer leurs données : miniatures avec état sélectionné, changement synchronisé avec les flèches existantes, transition de recadrage de 380 ms, navigation clavier et balayage horizontal tactile. Le bouton Agrandir ouvre un dialogue natif avec le regard courant et des commandes précédent/suivant. Échap ferme la vue et restitue le focus ; Lenis est suspendu pendant la consultation. Aucun autoplay. Les transitions sont évitées en réduction des animations.

Chrome : sélection directe, synchronisation, bouclage des regards, ouverture/fermeture avec retour du focus, flèches clavier, geste tactile simulé, absence de débordement à 390 px, rendu à 1440 px et absence d’exceptions vérifiés. Build réussi. Le détecteur signale uniquement des tailles et couleurs éditoriales intentionnelles issues de la page Canva.

## Effets éditoriaux

`public/canva-original/editorial-motion.js` et `editorial-motion.css` ajoutent :

- Parallaxe du hero : image agrandie de 16 %, déplacement borné à 7 % de la hauteur, une mise à jour par frame déclenchée au scroll.
- Survol : zoom léger des visuels de collection, contraste et titre coloré ; disponible également via le focus clavier.
- Révélation : recadrage progressif avec IntersectionObserver et Web Animations API, une seule fois par élément, y compris après filtrage. Le contenu reste visible sans JavaScript.
- Curseur : cercle accompagnant le curseur natif, réservé à une souris précise, masqué au clavier et dans les champs.
- Carrousel : trois cartes sur grand écran, deux sur tablette, une carte et un aperçu de la suivante sur mobile. Défilement natif avec scroll-snap, flèches, état des limites, compteur, touches fléchées/Home/End et glissement tactile. Aucun autoplay.

La réduction des animations annule les révélations en cours, retire le parallaxe et le curseur, et rend les déplacements du carrousel immédiats. Vérifications Chrome : mouvement du hero, flèche suivante, retour Home, mise à jour après filtres, curseur, navigation mobile, absence de débordement et d’exceptions JavaScript. Build réussi ; détecteur sans résultat sur la nouvelle feuille de style.

La route index sert `app/original/maison-sillage.html` via `routes/canva-original.ts` : le provider React ne pilote donc pas cette page. Les améliorations actives sont dans `public/canva-original/experience.js` et `experience.css`, avec une copie locale de Lenis 1.3.27 (issue de la dépendance du projet).

Le chargement attend le décodage du visuel principal et les polices, avec une limite de 3,5 secondes et sans délai artificiel minimum. Les images ajoutées par les filtres et le carnet sont surveillées : apparition au chargement et message en cas de fichier indisponible. Lenis anime la molette et les liens de section ; le tactile reste natif. Le défilement est suspendu pendant le carnet et redevient natif lorsque la réduction des animations est activée.

Vérification Chrome : ordinateur 1440 px et mobile 390 px, nouvelles sources Homme présentes, aucun visuel cassé, filtres Homme fonctionnels, chargement retiré, défilement Lenis actif, réduction des animations respectée, aucun débordement horizontal mobile et aucune exception JavaScript. Compilation de production réussie.


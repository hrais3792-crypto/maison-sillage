import { useEffect, useState } from "react"
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Heart,
  Menu,
  Search,
  X,
} from "lucide-react"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { useAnimationRuntime } from "../components/animation-provider"
import "./home.css"
import "./canva-design.css"
import "./ambiences.css"

const ambiences = [
  { id: "pierre", name: "Pierre", description: "Des tons chauds, une douceur naturelle." },
  { id: "galerie", name: "Galerie", description: "Un blanc lumineux, des contrastes graphiques." },
  { id: "nuit", name: "Nuit", description: "Des tons profonds, des accents de cuivre." },
] as const
type Ambience = (typeof ambiences)[number]["id"]

const categories = ["Tout", "Robes", "Vestes", "Hauts", "Pantalons"] as const
type Category = (typeof categories)[number]
const looks = [
  {
    id: "robe",
    universe: "Femme",
    category: "Robes",
    title: "La légèreté d’une silhouette",
    detail: "Une robe claire, un mouvement libre, une allure à imaginer.",
    image: "/images/inspiration-robes.jpg",
    alt: "Silhouette en robe claire dans un paysage fleuri — inspiration",
  },
  {
    id: "veste",
    universe: "Femme",
    category: "Vestes",
    title: "Le volume en mouvement",
    detail:
      "Un manteau bleu et des lignes affirmées pour explorer les superpositions.",
    image: "/images/inspiration-vestes.jpg",
    alt: "Silhouette en manteau bleu devant une cathédrale — inspiration",
  },
  {
    id: "haut",
    universe: "Homme",
    category: "Hauts",
    title: "Un essentiel, autrement",
    detail:
      "Un t-shirt blanc uni, une coupe simple et une allure décontractée.",
    image: "/images/homme-classique-haut.jpg",
    alt: "T-shirt blanc uni porté avec un pantalon sombre — inspiration homme",
  },
  {
    id: "pantalon",
    universe: "Femme",
    category: "Pantalons",
    title: "Le denim comme point de départ",
    detail: "Explorer les lignes du denim et les associations du quotidien.",
    image: "/images/inspiration-pantalons.jpg",
    alt: "Détail d’un jean bleu — inspiration pour la catégorie pantalons",
  },
  {
    id: "costume-bleu", universe: "Homme", category: "Vestes",
    title: "Le costume, une ligne affirmée",
    detail: "Un ensemble bleu à carreaux pour explorer une allure habillée.",
    image: "/images/homme-classique-costume.jpg",
    alt: "Costume bleu à carreaux avec gilet et cravate — inspiration homme",
  },
  {
    id: "robe-azur", universe: "Femme", category: "Robes",
    title: "L’azur au fil du mouvement",
    detail: "Une robe longue bleue, une ligne légère et un horizon ouvert.",
    image: "/images/femme-robe-noire.jpg",
    alt: "Silhouette en robe longue bleu clair au bord de l’eau — inspiration femme",
  },
  {
    id: "chemise-bleue", universe: "Homme", category: "Hauts",
    title: "La chemise en toute simplicité",
    detail: "Une chemise blanche et une cravate sombre pour une allure classique.",
    image: "/images/homme-classique-chemise.jpg",
    alt: "Chemise blanche et cravate sombre à pois — inspiration homme",
  },
  {
    id: "manteau-bordeaux", universe: "Femme", category: "Vestes",
    title: "Une touche de bordeaux",
    detail: "Un manteau sombre et un col relevé pour jouer avec les superpositions.",
    image: "/images/femme-tailleur.jpg",
    alt: "Silhouette en manteau bordeaux avec un haut clair — inspiration femme",
  },
  {
    id: "veste-urbaine", universe: "Homme", category: "Vestes",
    title: "Le caractère d’une veste",
    detail: "Une veste noire zippée : une ligne sobre et un esprit décontracté.",
    image: "/images/homme-classique-veste.jpg",
    alt: "Veste noire zippée présentée sur un cintre — inspiration homme",
  },
  {
    id: "denim-homme", universe: "Homme", category: "Pantalons",
    title: "Les nuances du denim",
    detail: "Du bleu au noir, des références pour imaginer ses associations.",
    image: "/images/homme-classique-denim.jpg",
    alt: "Jeans pliés dans différentes nuances de bleu et de noir — inspiration homme",
  },
] satisfies {
  id: string
  universe: "Femme" | "Homme"
  category: Category
  title: string
  detail: string
  image: string
  alt: string
}[]
const questions = [
  [
    "Puis-je acheter une pièce sur ce site ?",
    "Le site est actuellement une vitrine d’inspiration. La commande et le paiement ne sont pas encore proposés. Les pièces, leurs prix et leurs disponibilités seront présentés lorsque le catalogue réel sera fourni.",
  ],
  [
    "Les photographies représentent-elles la collection ?",
    "Les photographies sont des références éditoriales issues d’Unsplash. Elles illustrent les catégories et les idées de silhouettes ; elles ne représentent pas des produits Maison Sillage disponibles à la vente.",
  ],
  [
    "Comment conserver mes inspirations préférées ?",
    "Utilisez le cœur présent sur chaque silhouette. Retrouvez ensuite vos favoris dans « Ma sélection » et téléchargez votre carnet. Vos favoris sont enregistrés uniquement dans ce navigateur, lorsque son stockage est disponible.",
  ],
  [
    "Où trouver les tailles, les matières et les conseils d’entretien ?",
    "Ces informations dépendent de chaque pièce. Elles seront renseignées à partir des fiches du catalogue réel. Aucun guide de tailles ni conseil d’entretien propre à une pièce n’est disponible pour le moment.",
  ],
  [
    "Quelles sont les conditions de livraison et de retour ?",
    "Les conditions de livraison et de retour ne sont pas encore définies. Elles devront être précisées avant l’ouverture des commandes.",
  ],
]
function InspirationImage({
  src,
  alt,
  eager = false,
}: {
  src: string
  alt: string
  eager?: boolean
}) {
  const [failed, setFailed] = useState(false)
  return failed ? (
    <div className="image-unavailable" role="img" aria-label={alt}>
      Visuel indisponible
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      onError={() => setFailed(true)}
    />
  )
}
export function meta() {
  return [
    { title: "Maison Sillage — Vêtements de créateur & inspirations" },
    {
      name: "description",
      content:
        "Explorez l’univers Maison Sillage : robes, vestes, hauts et pantalons. Découvrez le lookbook et composez votre carnet d’inspirations.",
    },
  ]
}
export default function Home() {
  const [ambience, setAmbience] = useState<Ambience>("pierre")
  const [ambienceReady, setAmbienceReady] = useState(false)
  const [ambienceError, setAmbienceError] = useState(false)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("maison-sillage-ambience")
      if (ambiences.some((item) => item.id === stored)) setAmbience(stored as Ambience)
    } catch { setAmbienceError(true) }
    setAmbienceReady(true)
    return () => { delete document.documentElement.dataset.ambience }
  }, [])
  useEffect(() => {
    if (!ambienceReady) return
    document.documentElement.dataset.ambience = ambience
    try { localStorage.setItem("maison-sillage-ambience", ambience) }
    catch { setAmbienceError(true) }
  }, [ambience, ambienceReady])
  const scope = useRef<HTMLElement>(null)
  const { runtime, reducedMotion } = useAnimationRuntime()
  useGSAP(() => {
    if (!runtime || reducedMotion) return
    const { gsap, ScrollTrigger } = runtime
    if (window.scrollY < 80) {
      gsap.timeline()
        .fromTo(".entry-image", { clipPath: "inset(0 12% 0 0)" }, {
          clipPath: "inset(0 0% 0 0)", duration: 0.8, ease: "expo.out",
        })
        .from(".entry-plaque > *", {
          y: 18, opacity: 0, stagger: 0.09, duration: 0.65, ease: "expo.out",
        }, 0.15)
    }
    scope.current?.querySelectorAll<HTMLElement>(".collection-image").forEach((image) => {
      gsap.fromTo(image, { clipPath: "inset(0 0 14% 0)" }, {
        clipPath: "inset(0 0 0% 0)", duration: 0.75, ease: "expo.out",
        scrollTrigger: { trigger: image, start: "top 88%", once: true },
      })
    })
    ScrollTrigger.refresh()
  }, { scope, dependencies: [runtime, reducedMotion], revertOnUpdate: true })
  const [menuOpen, setMenuOpen] = useState(false)
  const [category, setCategory] = useState<Category>("Tout")
  const [universe, setUniverse] = useState<"Tout" | "Femme" | "Homme">("Tout")
  const [query, setQuery] = useState("")
  const [savedOnly, setSavedOnly] = useState(false)
  const [saved, setSaved] = useState<string[]>([])
  const [storageReady, setStorageReady] = useState(false)
  const [storageError, setStorageError] = useState(false)
  const [announcement, setAnnouncement] = useState("")
  useEffect(() => {
    try {
      const value: unknown = JSON.parse(
        localStorage.getItem("maison-sillage-favorites") || "[]"
      )
      if (Array.isArray(value))
        setSaved(
          value.filter(
            (id): id is string =>
              typeof id === "string" && looks.some((look) => look.id === id)
          )
        )
    } catch {
      setStorageError(true)
    }
    setStorageReady(true)
  }, [])
  useEffect(() => {
    if (!storageReady) return
    try {
      localStorage.setItem("maison-sillage-favorites", JSON.stringify(saved))
    } catch {
      setStorageError(true)
    }
  }, [saved, storageReady])
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
        if (document.activeElement?.closest(".site-nav"))
          document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus()
      }
    }
    document.addEventListener("keydown", close)
    return () => document.removeEventListener("keydown", close)
  }, [])
  const normalize = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
  const visibleLooks = looks.filter(
    (look) =>
      (category === "Tout" || look.category === category) &&
      (universe === "Tout" || look.universe === universe) &&
      (!savedOnly || saved.includes(look.id)) &&
      normalize(`${look.title} ${look.universe} ${look.category} ${look.detail}`).includes(
        normalize(query)
      )
  )
  const favoriteLooks = looks.filter((look) => saved.includes(look.id))
  function chooseCategory(value: Category) {
    setCategory(value)
    setUniverse("Tout")
    setSavedOnly(false)
    setQuery("")
  }
  function toggleSaved(id: string) {
    const exists = saved.includes(id)
    setSaved((current) =>
      exists ? current.filter((item) => item !== id) : [...current, id]
    )
    setAnnouncement(
      exists
        ? "Inspiration retirée de votre sélection."
        : "Inspiration ajoutée à votre sélection."
    )
  }
  function downloadNotebook() {
    const text = [
      "MAISON SILLAGE — MON CARNET D’INSPIRATIONS",
      "Références éditoriales Unsplash, pas un catalogue de produits en vente.",
      ...favoriteLooks.map(
        (look) => `${look.category} — ${look.title}\n${look.detail}`
      ),
    ].join("\n\n")
    const url = URL.createObjectURL(
      new Blob(["\uFEFF", text], { type: "text/plain;charset=utf-8" })
    )
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = "maison-sillage-mon-carnet.txt"
    anchor.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setAnnouncement("Votre carnet a été préparé pour le téléchargement.")
  }
  return (
    <>
      <a className="skip-link" href="#main">
        Aller au contenu
      </a>
      <header className="site-header canva-header">
        <a
          aria-label="Maison Sillage — accueil"
          className="brand-lockup"
          href="#accueil"
          onClick={() => setMenuOpen(false)}
        >
          <span className="brand-name">Maison Sillage</span>
        </a>
        <nav
          aria-label="Navigation principale"
          className={menuOpen ? "site-nav is-open" : "site-nav"}
          id="primary-navigation"
        >
          {[
            ["vestiaire", "Collection"],
            ["lookbook", "Lookbook"],
            ["maison", "La maison"],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
        <a
          className="header-selection"
          href="#carnet"
          aria-label={`Mon carnet, ${saved.length} inspiration${saved.length > 1 ? "s" : ""}`}
        >
          <Heart size={17} strokeWidth={1.5} aria-hidden="true" />
          <span>Ma sélection</span>
          <span className="selection-count">{saved.length}</span>
        </a>
        <button
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          {menuOpen ? (
            <X aria-hidden="true" size={21} />
          ) : (
            <Menu aria-hidden="true" size={21} />
          )}
        </button>
      </header>
      <aside className="ambience-bar" aria-label="Personnaliser l’apparence du site">
        <div className="ambience-intro">
          <span>À chacun son atmosphère.</span>
          <p aria-live="polite">{ambiences.find((item) => item.id === ambience)?.description}</p>
        </div>
        <div className="ambience-options" role="group" aria-label="Choisir une ambiance visuelle">
          {ambiences.map((item) => (
            <button type="button" key={item.id} aria-pressed={ambience === item.id}
              onClick={() => setAmbience(item.id)}>
              <span className={`ambience-swatch swatch-${item.id}`} aria-hidden="true" />
              {item.name}
            </button>
          ))}
        </div>
        {ambienceError && <p className="ambience-storage" role="status">Votre ambiance reste active pour cette visite ; elle ne peut pas être mémorisée dans ce navigateur.</p>}
      </aside>
      <main id="main" ref={scope}>
        <section
          aria-labelledby="entry-title"
          className="entry-passage canva-entry"
          id="accueil"
        >
          <figure className="entry-image">
            <InspirationImage
              eager
              src="/images/canva-editorial-hero.jpg"
              alt="Portrait de femme sur fond gris — photographie d’inspiration"
            />
            <figcaption className="image-caption">
              <span>Photographie d’inspiration · Unsplash</span>
              <span>Maison Sillage</span>
            </figcaption>
          </figure>
          <div className="entry-copy">
            <div className="entry-plaque">
              <h1 id="entry-title">Une allure qui laisse<br className="hero-line-break" /> une empreinte</h1>
              <p>
                Des silhouettes, des matières, des façons de voir. Une invitation à
                explorer la mode comme un langage visuel.
              </p>
              <a className="primary-link" href="#vestiaire">
                <span>Explorer les inspirations</span>
                <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.5} />
              </a>
            </div>
            <a className="scroll-cue" href="#vestiaire">
              <span>À chaque silhouette, son passage</span>
              <ArrowDownRight aria-hidden="true" size={17} strokeWidth={1.5} />
            </a>
          </div>
        </section>
        <section
          className="wardrobe-passage"
          id="vestiaire"
          aria-labelledby="wardrobe-title"
        >
          <div className="section-heading">
            <h2 id="wardrobe-title">Les inspirations</h2>
            <p>
              Quatre façons d’explorer.
              <br />
              Une allure à composer.
            </p>
          </div>
          <div
            className="category-directory"
            aria-label="Explorer par catégorie"
          >
            {categories
              .filter((item) => item !== "Tout")
              .map((item) => (
                <a
                  key={item}
                  href="#collection"
                  onClick={() => chooseCategory(item)}
                >
                  <span>{item}</span>
                  <ArrowUpRight
                    size={23}
                    strokeWidth={1.2}
                    aria-hidden="true"
                  />
                </a>
              ))}
          </div>
          <div className="collection-browser" id="collection">
            <div className="universe-filters category-filters" role="group" aria-label="Choisir un vestiaire">
              {(["Tout", "Femme", "Homme"] as const).map((item) => (
                <button key={item} type="button" aria-pressed={universe === item}
                  onClick={() => { setUniverse(item); setCategory("Tout"); setSavedOnly(false); setQuery("") }}>
                  {item === "Tout" ? "Tous les vestiaires" : item}
                </button>
              ))}
            </div>
            <div className="collection-toolbar">
              <div
                className="category-filters"
                role="group"
                aria-label="Filtrer les inspirations"
              >
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    data-category={item}
                    aria-pressed={category === item && !savedOnly}
                    onClick={() => chooseCategory(item)}
                  >
                    {item}
                  </button>
                ))}
                <button
                  type="button"
                  data-filter="saved"
                  aria-pressed={savedOnly}
                  onClick={() => {
                    setSavedOnly((value) => !value)
                    setUniverse("Tout")
                    setCategory("Tout")
                    setQuery("")
                  }}
                >
                  <Heart size={14} aria-hidden="true" />
                  Ma sélection ({saved.length})
                </button>
              </div>
              <div className="look-search">
                <Search size={17} aria-hidden="true" />
                <label className="visually-hidden" htmlFor="look-search">
                  Rechercher une inspiration
                </label>
                <input
                  id="look-search"
                  type="search"
                  placeholder="Rechercher une inspiration"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </div>
            <div className="collection-caption">
              <p>
                Références éditoriales d’inspiration · Ce ne sont pas des
                produits en vente.
              </p>
              <span role="status">
                {visibleLooks.length} inspiration
                {visibleLooks.length > 1 ? "s" : ""}
              </span>
            </div>
            {visibleLooks.length ? (
              <div className="inspiration-grid">
                {visibleLooks.map((look) => (
                  <article
                    className="look"
                    key={look.id}
                    data-look={look.id}
                    data-category={look.category}
                  >
                    <div className="look-image">
                      <InspirationImage src={look.image} alt={look.alt} />
                      <button
                        data-save={look.id}
                        type="button"
                        className="save-look"
                        aria-pressed={saved.includes(look.id)}
                        aria-label={`${saved.includes(look.id) ? "Retirer" : "Ajouter"} « ${look.title} » ${saved.includes(look.id) ? "de" : "à"} ma sélection`}
                        onClick={() => toggleSaved(look.id)}
                      >
                        <Heart
                          size={19}
                          strokeWidth={1.5}
                          fill={
                            saved.includes(look.id) ? "currentColor" : "none"
                          }
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                    <div className="look-heading">
                      <h3>{look.title}</h3>
                      <span>{look.universe} · {look.category}</span>
                    </div>
                    <p>{look.detail}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="collection-empty">
                <h3>
                  {savedOnly
                    ? "Votre sélection prend forme ici."
                    : "Aucune inspiration trouvée."}
                </h3>
                <p>
                  {savedOnly
                    ? "Ajoutez vos silhouettes préférées avec le cœur pour les retrouver ensemble."
                    : "Essayez un autre mot ou explorez toutes les catégories."}
                </p>
                <button
                  className="text-link"
                  type="button"
                  onClick={() => chooseCategory("Tout")}
                >
                  Voir toutes les inspirations
                  <ArrowUpRight size={17} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </section>
        <section
          className="collection-passage"
          id="lookbook"
          aria-labelledby="lookbook-title"
        >
          <div className="section-heading">
            <h2 id="lookbook-title">L’allure en mouvement.</h2>
            <p>Un carnet visuel pour regarder les vêtements autrement.</p>
          </div>
          <div className="collection-layout editorial-layout">
            <figure className="collection-image collection-image-primary">
              <InspirationImage
                src="/images/inspiration-silhouettes.jpg"
                alt="Portrait de mode en t-shirt rouge sur fond bleu — photographie d’inspiration"
              />
              <figcaption>
                Jeux de lignes et de contrastes · Inspiration Unsplash
              </figcaption>
            </figure>
            <div className="collection-aside">
              <div className="collection-note">
                <h3>
                  Une silhouette.
                  <br />
                  Votre interprétation.
                </h3>
                <p>
                  Une couleur qui attire le regard. Un volume qui change une
                  posture. Explorez ces références, rapprochez vos envies et
                  composez votre propre lecture du vestiaire.
                </p>
                <a className="text-link" href="#carnet">
                  Composer mon carnet
                  <ArrowUpRight
                    aria-hidden="true"
                    size={16}
                    strokeWidth={1.5}
                  />
                </a>
              </div>
              <figure className="collection-image collection-image-secondary">
                <InspirationImage
                  src="/images/inspiration-robes.jpg"
                  alt="Robe légère dans la nature — photographie d’inspiration"
                />
                <figcaption>
                  La douceur d’un mouvement · Inspiration Unsplash
                </figcaption>
              </figure>
            </div>
          </div>
        </section>
        <section
          aria-labelledby="maison-title"
          className="maison-passage"
          id="maison"
        >
          <div className="maison-frame">
            <h2 id="maison-title">
              L’univers
              <br />
              Maison Sillage.
            </h2>
            <div>
              <p>
                Une vitrine consacrée aux vêtements de créateur et aux idées de
                silhouettes. Le regard se pose sur une ligne, s’arrête sur un
                volume, puis poursuit son chemin.
              </p>
              <p>
                Ce premier chapitre rassemble des inspirations. La collection
                réelle viendra lui donner ses pièces, ses matières et ses
                détails.
              </p>
              <a className="light-link" href="#vestiaire">
                Continuer l’exploration
                <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </section>
        <section
          className="notebook-passage"
          id="carnet"
          aria-labelledby="notebook-title"
        >
          <div className="notebook-intro">
            <h2 id="notebook-title">
              Vos envies,
              <br />
              au même endroit.
            </h2>
            <p>
              Gardez les silhouettes qui vous parlent. Retrouvez-les ici et
              emportez votre carnet d’inspirations.
            </p>
            <a
              className="text-link"
              href="#collection"
              onClick={() => {
                setCategory("Tout")
                setUniverse("Tout")
                setSavedOnly(true)
                setQuery("")
              }}
            >
              Voir ma sélection ({saved.length})
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
          <div className="notebook-content">
            {favoriteLooks.length ? (
              <ul className="notebook-list">
                {favoriteLooks.map((look) => (
                  <li key={look.id}>
                    <img src={look.image} alt="" loading="lazy" />
                    <div>
                      <span>{look.category}</span>
                      <p>{look.title}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSaved(look.id)}
                      aria-label={`Retirer « ${look.title} » du carnet`}
                    >
                      <X size={18} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="notebook-empty">
                <Heart size={27} strokeWidth={1} aria-hidden="true" />
                <p>Votre carnet attend ses premières inspirations.</p>
                <a href="#collection" onClick={() => chooseCategory("Tout")}>
                  Explorer les silhouettes
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            )}
            <button
              className="primary-link download-notebook"
              type="button"
              disabled={!favoriteLooks.length}
              onClick={downloadNotebook}
            >
              <span>Télécharger mon carnet</span>
              <Download size={17} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <p className="notebook-privacy">
              {storageError
                ? "Le stockage de ce navigateur est indisponible. Téléchargez votre carnet avant de quitter cette page."
                : "Votre sélection reste dans ce navigateur. Aucun compte nécessaire."}
            </p>
          </div>
        </section>
        <section
          className="faq-passage"
          id="questions"
          aria-labelledby="faq-title"
        >
          <div className="faq-intro">
            <h2 id="faq-title">
              Avant de
              <br />
              poursuivre.
            </h2>
            <p>
              Quelques repères pour découvrir la vitrine et utiliser votre
              carnet.
            </p>
          </div>
          <div className="faq-list">
            {questions.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <span className="faq-sign" aria-hidden="true" />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <footer className="site-footer expanded-footer">
        <div className="footer-main">
          <div>
            <a className="footer-brand" href="#accueil">
              Maison Sillage
            </a>
            <p>
              Des silhouettes à découvrir.
              <br />
              Une allure à imaginer.
            </p>
          </div>
          <nav aria-label="Le vestiaire">
            {categories
              .filter((item) => item !== "Tout")
              .map((item) => (
                <a
                  key={item}
                  href="#collection"
                  onClick={() => chooseCategory(item)}
                >
                  {item}
                </a>
              ))}
          </nav>
          <nav aria-label="Découvrir Maison Sillage">
            <a href="#lookbook">Le lookbook</a>
            <a href="#maison">La maison</a>
            <a href="#carnet">Mon carnet</a>
            <a href="#questions">Questions fréquentes</a>
          </nav>
          <a className="footer-top" href="#accueil">
            Retour en haut
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
        <div className="footer-bottom">
          <span>Maison Sillage · Vêtements de créateur</span>
          <span>Photographies d’inspiration : Unsplash</span>
          <span>Vitrine éditoriale · Commandes non ouvertes</span>
        </div>
      </footer>
      <p className="visually-hidden" role="status">
        {announcement}
      </p>
    </>
  )
}

import type { Theme } from "./types";

/**
 * Master list of candidate themes the fetch pipeline draws from. The pipeline
 * always fills the least-covered themes first (see theme-coverage.json), so
 * pool growth is breadth-first across this list rather than piling up on
 * whichever theme is easiest to query.
 *
 * Add to this list freely. Don't remove entries that already have collections
 * built from them without migrating/deleting those collections too.
 *
 * searchQuery  — richer keyword string sent to museum APIs (artists, related
 *               terms, cultural context). Defaults to the theme title if omitted.
 * wikidataMovementQid — Wikidata QID for the art movement (P135). When set,
 *               the wikimedia adapter uses a precise SPARQL query instead of
 *               filename keyword search.
 */
export const THEME_TAXONOMY: Theme[] = [
  {
    id: "dutch-golden-age", title: "Dutch Golden Age", era: "1600 — 1700",
    blurb: "Light, stillness, and the quiet drama of everyday life in the Low Countries.",
    accent: "#6b4f2a", accent2: "#241a0f",
    searchQuery: "Rembrandt Vermeer Hals Frans Steen Jan Steen Dutch Golden Age 17th century genre portrait still life",
    wikidataMovementQid: "Q213292",
  },
  {
    id: "ukiyo-e", title: "Japanese Ukiyo-e", era: "Edo Period · 1603 — 1868",
    blurb: "Woodblock prints of the floating world — waves, weather, and fleeting beauty.",
    accent: "#2b4a63", accent2: "#0f1c28",
    searchQuery: "ukiyo-e woodblock print Hokusai Hiroshige Utamaro Kuniyoshi Harunobu Japanese Edo floating world",
    wikidataMovementQid: "Q170053",
  },
  {
    id: "post-impressionism", title: "Post-Impressionism", era: "1880 — 1905",
    blurb: "Colour set free — the night sky, the lamplit café, paint laid on like emotion.",
    accent: "#243a64", accent2: "#0e1730",
    searchQuery: "Van Gogh Cézanne Seurat Gauguin Toulouse-Lautrec Signac post-impressionism pointillism",
    wikidataMovementQid: "Q207691",
  },
  {
    id: "ancient-egypt", title: "Ancient Egypt", era: "New Kingdom · c. 1550 — 1070 BC",
    blurb: "Stone and gold made to outlast empires — the sculptured faces of the divine.",
    accent: "#7a5a22", accent2: "#2a1e0c",
    searchQuery: "ancient Egyptian pharaoh hieroglyphs mummy tomb Nile New Kingdom sculpture relief painting",
  },
  {
    id: "turn-of-century", title: "Turn of the Century", era: "1890 — 1930",
    blurb: "Symbolism, gold leaf, and pure geometry — modern art finding its first voices.",
    accent: "#6a2a3a", accent2: "#251017",
    searchQuery: "Klimt Schiele Munch Symbolism Vienna Secession Expressionism Jugendstil gold leaf 1900 1910",
  },
  {
    id: "italian-renaissance", title: "Italian Renaissance", era: "1400 — 1600",
    blurb: "Perspective, anatomy, and divine proportion — the rebirth of classical form.",
    accent: "#5a3a1e", accent2: "#1f140b",
    searchQuery: "Leonardo Michelangelo Raphael Botticelli Titian Venetian Florentine Renaissance fresco altarpiece",
    wikidataMovementQid: "Q4692",
  },
  {
    id: "northern-renaissance", title: "Northern Renaissance", era: "1430 — 1580",
    blurb: "Oil glazed thin as glass — obsessive detail from Flanders to the Rhine.",
    accent: "#3a4a3a", accent2: "#141a14",
    searchQuery: "Van Eyck Dürer Holbein Bruegel Flemish Netherlandish panel painting oil 15th 16th century portrait",
    wikidataMovementQid: "Q658390",
  },
  {
    id: "baroque", title: "Baroque", era: "1600 — 1750",
    blurb: "Drama, shadow, and movement — paint and stone learning to perform.",
    accent: "#4a2218", accent2: "#1a0c08",
    searchQuery: "Caravaggio Rubens Velázquez Bernini Rembrandt Van Dyck chiaroscuro dramatic baroque painting 17th century",
    wikidataMovementQid: "Q846991",
  },
  {
    id: "romanticism", title: "Romanticism", era: "1780 — 1850",
    blurb: "The sublime and the storm — feeling over reason, nature over order.",
    accent: "#2a3a4a", accent2: "#0d141a",
    searchQuery: "Turner Delacroix Caspar David Friedrich Géricault Constable Fuseli sublime landscape romantic 19th century",
    wikidataMovementQid: "Q37068",
  },
  {
    id: "neoclassicism", title: "Neoclassicism", era: "1750 — 1850",
    blurb: "Cool marble and straight lines — antiquity revived for a new age of reason.",
    accent: "#4a4a3a", accent2: "#18180f",
    searchQuery: "Jacques-Louis David Ingres Canova Thorvaldsen antiquity neoclassical painting sculpture 18th century",
    wikidataMovementQid: "Q53232",
  },
  {
    id: "american-modernism", title: "American Modernism", era: "1900 — 1950",
    blurb: "Skylines, steel, and a new vocabulary for a fast-changing country.",
    accent: "#3a3a4a", accent2: "#14141f",
    searchQuery: "Edward Hopper Georgia O'Keeffe Charles Sheeler Stuart Davis precisionism American scene regionalism 1920s 1930s",
  },
  {
    id: "ashcan-school", title: "Ashcan School", era: "1890 — 1920",
    blurb: "Tenements, prizefights, and city streets — American realism unvarnished.",
    accent: "#3a2a22", accent2: "#150f0a",
    searchQuery: "John Sloan Robert Henri George Bellows Everett Shinn William Glackens urban tenement New York realism Ashcan",
    wikidataMovementQid: "Q161240",
  },
  {
    id: "abstract-expressionism", title: "Abstract Expressionism", era: "1940s — 1960s",
    blurb: "Gesture as subject — paint thrown, dripped, and scraped into feeling.",
    accent: "#2a2a2a", accent2: "#0d0d0d",
    searchQuery: "Jackson Pollock de Kooning Rothko Franz Kline Motherwell Gottlieb Lee Krasner abstract expressionism action painting New York School",
    wikidataMovementQid: "Q208189",
  },
  {
    id: "cubism", title: "Cubism", era: "1907 — 1920",
    blurb: "A single object, seen from everywhere at once — form broken into facets.",
    accent: "#4a3a2a", accent2: "#1a140d",
    searchQuery: "Picasso Braque Léger Juan Gris cubism faceted geometric analytic synthetic 1910s",
    wikidataMovementQid: "Q38010",
  },
  {
    id: "surrealism", title: "Surrealism", era: "1920s — 1940s",
    blurb: "Dream logic in oil paint — the unconscious mind given a brush.",
    accent: "#2a1a3a", accent2: "#0e0815",
    searchQuery: "Dalí Magritte Max Ernst de Chirico Miró Frida Kahlo Tanguy dreamlike unconscious surrealism 1920s",
    wikidataMovementQid: "Q39481",
  },
  {
    id: "art-deco", title: "Art Deco", era: "1910s — 1930s",
    blurb: "Chrome, sunbursts, and speed — design for the machine age.",
    accent: "#3a3022", accent2: "#15110b",
    searchQuery: "Art Deco streamline moderne geometric decorative 1920s 1930s poster Tamara de Lempicka Cassandre Chrysler",
    wikidataMovementQid: "Q44014",
  },
  {
    id: "art-nouveau", title: "Art Nouveau", era: "1890 — 1910",
    blurb: "Vines, curves, and women with impossible hair — nature reimagined as ornament.",
    accent: "#2a3a2a", accent2: "#0d150d",
    searchQuery: "Alphonse Mucha Horta Tiffany organic floral curvilinear Jugendstil Secession art nouveau 1890 1910",
    wikidataMovementQid: "Q34636",
  },
  {
    id: "byzantine-icons", title: "Byzantine Icons", era: "5th — 15th century",
    blurb: "Gold ground and flattened space — images made for devotion, not illusion.",
    accent: "#5a4a1e", accent2: "#1f190a",
    searchQuery: "Byzantine icon mosaic gold ground Madonna Christ Constantinople medieval religious devotional panel",
  },
  {
    id: "medieval-illuminated", title: "Medieval Illuminated Manuscripts", era: "500 — 1500",
    blurb: "Pages worth more than gold — scripture and story bordered in gilt and vine.",
    accent: "#3a2a3a", accent2: "#150e15",
    searchQuery: "illuminated manuscript Book of Hours psalter Bible medieval scriptorium gold leaf miniature vellum",
  },
  {
    id: "gothic-architecture", title: "Gothic Architecture & Sculpture", era: "1140 — 1500",
    blurb: "Stone reaching upward — ribbed vaults, light through glass, saints in relief.",
    accent: "#2a2a3a", accent2: "#0e0e16",
    searchQuery: "Gothic cathedral gargoyle flying buttress stained glass lancet arch Notre Dame Chartres medieval stone sculpture portal",
  },
  {
    id: "ancient-greek", title: "Ancient Greek Art", era: "800 — 31 BC",
    blurb: "The human body as ideal form — painted pottery and the birth of sculpture.",
    accent: "#5a5a4a", accent2: "#1e1e18",
    searchQuery: "ancient Greek vase amphora red-figure black-figure Parthenon marble Hellenistic sculpture Attic pottery",
  },
  {
    id: "roman-antiquity", title: "Roman Antiquity", era: "753 BC — 476 AD",
    blurb: "Portrait busts, mosaics, and empire rendered in marble and stone.",
    accent: "#4a4438", accent2: "#181612",
    searchQuery: "Roman mosaic fresco marble bust portrait sculpture forum imperial ancient Rome Pompeii Caesar Augustus",
  },
  {
    id: "islamic-art", title: "Islamic Art & Calligraphy", era: "7th century — present",
    blurb: "Geometry and script as devotion — pattern that never quite repeats.",
    accent: "#1e3a3a", accent2: "#0a1515",
    searchQuery: "Islamic calligraphy arabesque Quran geometric tiles Ottoman Safavid Mughal mosque manuscript Persian miniature",
  },
  {
    id: "chinese-landscape", title: "Chinese Landscape Painting", era: "Song — Qing Dynasties",
    blurb: "Mountains in mist, painted with a single breath of ink.",
    accent: "#2a3a32", accent2: "#0e150f",
    searchQuery: "Chinese ink wash landscape mountain scholar literati Song Yuan Ming Qing dynasty shan shui brush silk",
  },
  {
    id: "japanese-zen-ink", title: "Japanese Zen Ink Painting", era: "Muromachi Period · 1336 — 1573",
    blurb: "A few strokes, a lot of empty space — painting as meditation.",
    accent: "#3a3a3a", accent2: "#141414",
    searchQuery: "Japanese ink brush zen Muromachi Sesshu Toyo sumi-e brushstroke monastery Zen Buddhism calligraphy",
  },
  {
    id: "indian-miniature", title: "Indian Miniature Painting", era: "Mughal & Rajput Courts",
    blurb: "Jewel-bright courts and gardens, painted small enough to hold in one hand.",
    accent: "#5a2a3a", accent2: "#1f0e15",
    searchQuery: "Indian miniature Mughal Rajput Pahari court painting lotus elephant Sanskrit manuscript Akbar Shah Jahan",
  },
  {
    id: "pre-columbian", title: "Pre-Columbian Art", era: "Maya, Aztec & Inca",
    blurb: "Jade, gold, and stone carved for gods that predate the conquest.",
    accent: "#3a2a1a", accent2: "#150f08",
    searchQuery: "Maya Aztec Inca Olmec ceramic jade gold Pre-Columbian Mesoamerican Andean ritual sculpture codex",
  },
  {
    id: "african-sculpture", title: "African Sculpture & Masks", era: "Various, pre-colonial — 20th c.",
    blurb: "Carved wood and bronze that reshaped what 20th-century art could be.",
    accent: "#3a2418", accent2: "#150d08",
    searchQuery: "African mask Yoruba Benin bronze Kongo Fang Baule wooden sculpture ritual ceremonial ancestor figure",
  },
  {
    id: "oceanic-art", title: "Oceanic Art", era: "Pacific Islands, various",
    blurb: "Carving and barkcloth from the world's most widely scattered cultures.",
    accent: "#1e3a32", accent2: "#0a1512",
    searchQuery: "Maori Papua New Guinea Pacific Melanesia Micronesia Polynesia tapa bark cloth idol ancestor figure Torres Strait",
  },
  {
    id: "early-photography", title: "Early Photography", era: "1840 — 1920",
    blurb: "The first machines for capturing light — portraits, streets, and silver.",
    accent: "#3a3a32", accent2: "#15150f",
    searchQuery: "daguerreotype calotype albumen silver print photograph 19th century portrait Fox Talbot Hill Adamson wet plate",
  },
  {
    id: "depression-era-photography", title: "Depression-Era American Photography", era: "1930s",
    blurb: "Dust, migration, and dignity — photography as social witness.",
    accent: "#3a3228", accent2: "#15120d",
    searchQuery: "Great Depression Farm Security Administration FSA Dorothea Lange Walker Evans Arthur Rothstein documentary 1930s migrant dust bowl",
  },
  {
    id: "bauhaus", title: "Bauhaus & Modernist Design", era: "1919 — 1933",
    blurb: "Form follows function — primary colour and geometry remaking everyday objects.",
    accent: "#3a2222", accent2: "#150c0c",
    searchQuery: "Bauhaus Klee Kandinsky Moholy-Nagy Albers Breuer Itten typography workshop Dessau Weimar modernist design",
    wikidataMovementQid: "Q170022",
  },
  {
    id: "pop-art", title: "Pop Art", era: "1950s — 1960s",
    blurb: "Soup cans and comic strips — consumer culture turned into fine art.",
    accent: "#4a2a3a", accent2: "#1a0e15",
    searchQuery: "Warhol Lichtenstein Jasper Johns Oldenburg Hockney Hamilton British American pop art consumer Campbell soup Marilyn",
    wikidataMovementQid: "Q605825",
  },
  {
    id: "minimalism", title: "Minimalism", era: "1960s — 1970s",
    blurb: "Reduced to essentials — colour, repetition, and industrial material.",
    accent: "#2a2a2a", accent2: "#101010",
    searchQuery: "Donald Judd Frank Stella Sol LeWitt Dan Flavin Carl Andre minimalism geometric sculpture 1960s industrial",
    wikidataMovementQid: "Q80113",
  },
  {
    id: "contemporary-photography", title: "Contemporary Photography", era: "1990 — present",
    blurb: "The camera now — staged, documentary, and everything between.",
    accent: "#22323a", accent2: "#0c1318",
    searchQuery: "contemporary photography Cindy Sherman Andreas Gursky Wolfgang Tillmans Thomas Struth staged documentary conceptual",
  },
  {
    id: "digital-computer-art", title: "Computer & Digital Art", era: "1960s — present",
    blurb: "Code, pixels, and plotters — art made with and about the machine.",
    accent: "#1a2a3a", accent2: "#080f15",
    searchQuery: "computer art digital algorithmic generative net art pixel glitch plotter code Harold Cohen Vera Molnár",
  },
  {
    id: "folk-art-americana", title: "American Folk Art", era: "18th — 19th century",
    blurb: "Self-taught hands, painted signs, and portraits made without formal training.",
    accent: "#3a3022", accent2: "#15110b",
    searchQuery: "American folk art quilt weathervane trade sign portrait naive primitive self-taught outsider 18th 19th century",
  },
  {
    id: "arts-and-crafts", title: "Arts & Crafts Movement", era: "1880 — 1920",
    blurb: "A reaction to the factory — handmade texture and honest material.",
    accent: "#2a3a28", accent2: "#0e150d",
    searchQuery: "Arts Crafts movement William Morris Ruskin Stickley pottery textiles handmade decorative wallpaper tile",
    wikidataMovementQid: "Q337671",
  },
  {
    id: "historic-fashion-textiles", title: "Historic Fashion & Textiles", era: "Various",
    blurb: "Garments and weave as design history, stitched rather than painted.",
    accent: "#3a2230", accent2: "#150c12",
    searchQuery: "historic costume textile silk embroidery court dress fashion 18th 19th century brocade lace mantua gown",
  },
  {
    id: "vintage-posters", title: "Vintage Posters & Graphic Design", era: "1880 — 1950",
    blurb: "Advertising as art — bold type and flat colour built to be seen from a moving street.",
    accent: "#3a1e1e", accent2: "#150a0a",
    searchQuery: "vintage poster lithograph art nouveau art deco travel tourism railway Mucha Cassandre Cappiello advertisement",
  },
];

import type { Theme } from "./types";

/**
 * Master list of candidate themes the fetch pipeline draws from. The pipeline
 * always fills the least-covered themes first (see theme-coverage.json), so
 * pool growth is breadth-first across this list rather than piling up on
 * whichever theme is easiest to query.
 *
 * Add to this list freely. Don't remove entries that already have collections
 * built from them without migrating/deleting those collections too.
 */
export const THEME_TAXONOMY: Theme[] = [
  { id: "dutch-golden-age", title: "Dutch Golden Age", era: "1600 — 1700", blurb: "Light, stillness, and the quiet drama of everyday life in the Low Countries.", accent: "#6b4f2a", accent2: "#241a0f" },
  { id: "ukiyo-e", title: "Japanese Ukiyo-e", era: "Edo Period · 1603 — 1868", blurb: "Woodblock prints of the floating world — waves, weather, and fleeting beauty.", accent: "#2b4a63", accent2: "#0f1c28" },
  { id: "post-impressionism", title: "Post-Impressionism", era: "1880 — 1905", blurb: "Colour set free — the night sky, the lamplit café, paint laid on like emotion.", accent: "#243a64", accent2: "#0e1730" },
  { id: "ancient-egypt", title: "Ancient Egypt", era: "New Kingdom · c. 1550 — 1070 BC", blurb: "Stone and gold made to outlast empires — the sculptured faces of the divine.", accent: "#7a5a22", accent2: "#2a1e0c" },
  { id: "turn-of-century", title: "Turn of the Century", era: "1890 — 1930", blurb: "Symbolism, gold leaf, and pure geometry — modern art finding its first voices.", accent: "#6a2a3a", accent2: "#251017" },
  { id: "italian-renaissance", title: "Italian Renaissance", era: "1400 — 1600", blurb: "Perspective, anatomy, and divine proportion — the rebirth of classical form.", accent: "#5a3a1e", accent2: "#1f140b" },
  { id: "northern-renaissance", title: "Northern Renaissance", era: "1430 — 1580", blurb: "Oil glazed thin as glass — obsessive detail from Flanders to the Rhine.", accent: "#3a4a3a", accent2: "#141a14" },
  { id: "baroque", title: "Baroque", era: "1600 — 1750", blurb: "Drama, shadow, and movement — paint and stone learning to perform.", accent: "#4a2218", accent2: "#1a0c08" },
  { id: "romanticism", title: "Romanticism", era: "1780 — 1850", blurb: "The sublime and the storm — feeling over reason, nature over order.", accent: "#2a3a4a", accent2: "#0d141a" },
  { id: "neoclassicism", title: "Neoclassicism", era: "1750 — 1850", blurb: "Cool marble and straight lines — antiquity revived for a new age of reason.", accent: "#4a4a3a", accent2: "#18180f" },
  { id: "american-modernism", title: "American Modernism", era: "1900 — 1950", blurb: "Skylines, steel, and a new vocabulary for a fast-changing country.", accent: "#3a3a4a", accent2: "#14141f" },
  { id: "ashcan-school", title: "Ashcan School", era: "1890 — 1920", blurb: "Tenements, prizefights, and city streets — American realism unvarnished.", accent: "#3a2a22", accent2: "#150f0a" },
  { id: "abstract-expressionism", title: "Abstract Expressionism", era: "1940s — 1960s", blurb: "Gesture as subject — paint thrown, dripped, and scraped into feeling.", accent: "#2a2a2a", accent2: "#0d0d0d" },
  { id: "cubism", title: "Cubism", era: "1907 — 1920", blurb: "A single object, seen from everywhere at once — form broken into facets.", accent: "#4a3a2a", accent2: "#1a140d" },
  { id: "surrealism", title: "Surrealism", era: "1920s — 1940s", blurb: "Dream logic in oil paint — the unconscious mind given a brush.", accent: "#2a1a3a", accent2: "#0e0815" },
  { id: "art-deco", title: "Art Deco", era: "1910s — 1930s", blurb: "Chrome, sunbursts, and speed — design for the machine age.", accent: "#3a3022", accent2: "#15110b" },
  { id: "art-nouveau", title: "Art Nouveau", era: "1890 — 1910", blurb: "Vines, curves, and women with impossible hair — nature reimagined as ornament.", accent: "#2a3a2a", accent2: "#0d150d" },
  { id: "byzantine-icons", title: "Byzantine Icons", era: "5th — 15th century", blurb: "Gold ground and flattened space — images made for devotion, not illusion.", accent: "#5a4a1e", accent2: "#1f190a" },
  { id: "medieval-illuminated", title: "Medieval Illuminated Manuscripts", era: "500 — 1500", blurb: "Pages worth more than gold — scripture and story bordered in gilt and vine.", accent: "#3a2a3a", accent2: "#150e15" },
  { id: "gothic-architecture", title: "Gothic Architecture & Sculpture", era: "1140 — 1500", blurb: "Stone reaching upward — ribbed vaults, light through glass, saints in relief.", accent: "#2a2a3a", accent2: "#0e0e16" },
  { id: "ancient-greek", title: "Ancient Greek Art", era: "800 — 31 BC", blurb: "The human body as ideal form — painted pottery and the birth of sculpture.", accent: "#5a5a4a", accent2: "#1e1e18" },
  { id: "roman-antiquity", title: "Roman Antiquity", era: "753 BC — 476 AD", blurb: "Portrait busts, mosaics, and empire rendered in marble and stone.", accent: "#4a4438", accent2: "#181612" },
  { id: "islamic-art", title: "Islamic Art & Calligraphy", era: "7th century — present", blurb: "Geometry and script as devotion — pattern that never quite repeats.", accent: "#1e3a3a", accent2: "#0a1515" },
  { id: "chinese-landscape", title: "Chinese Landscape Painting", era: "Song — Qing Dynasties", blurb: "Mountains in mist, painted with a single breath of ink.", accent: "#2a3a32", accent2: "#0e150f" },
  { id: "japanese-zen-ink", title: "Japanese Zen Ink Painting", era: "Muromachi Period · 1336 — 1573", blurb: "A few strokes, a lot of empty space — painting as meditation.", accent: "#3a3a3a", accent2: "#141414" },
  { id: "indian-miniature", title: "Indian Miniature Painting", era: "Mughal & Rajput Courts", blurb: "Jewel-bright courts and gardens, painted small enough to hold in one hand.", accent: "#5a2a3a", accent2: "#1f0e15" },
  { id: "pre-columbian", title: "Pre-Columbian Art", era: "Maya, Aztec & Inca", blurb: "Jade, gold, and stone carved for gods that predate the conquest.", accent: "#3a2a1a", accent2: "#150f08" },
  { id: "african-sculpture", title: "African Sculpture & Masks", era: "Various, pre-colonial — 20th c.", blurb: "Carved wood and bronze that reshaped what 20th-century art could be.", accent: "#3a2418", accent2: "#150d08" },
  { id: "oceanic-art", title: "Oceanic Art", era: "Pacific Islands, various", blurb: "Carving and barkcloth from the world's most widely scattered cultures.", accent: "#1e3a32", accent2: "#0a1512" },
  { id: "early-photography", title: "Early Photography", era: "1840 — 1920", blurb: "The first machines for capturing light — portraits, streets, and silver.", accent: "#3a3a32", accent2: "#15150f" },
  { id: "depression-era-photography", title: "Depression-Era American Photography", era: "1930s", blurb: "Dust, migration, and dignity — photography as social witness.", accent: "#3a3228", accent2: "#15120d" },
  { id: "bauhaus", title: "Bauhaus & Modernist Design", era: "1919 — 1933", blurb: "Form follows function — primary colour and geometry remaking everyday objects.", accent: "#3a2222", accent2: "#150c0c" },
  { id: "pop-art", title: "Pop Art", era: "1950s — 1960s", blurb: "Soup cans and comic strips — consumer culture turned into fine art.", accent: "#4a2a3a", accent2: "#1a0e15" },
  { id: "minimalism", title: "Minimalism", era: "1960s — 1970s", blurb: "Reduced to essentials — colour, repetition, and industrial material.", accent: "#2a2a2a", accent2: "#101010" },
  { id: "contemporary-photography", title: "Contemporary Photography", era: "1990 — present", blurb: "The camera now — staged, documentary, and everything between.", accent: "#22323a", accent2: "#0c1318" },
  { id: "digital-computer-art", title: "Computer & Digital Art", era: "1960s — present", blurb: "Code, pixels, and plotters — art made with and about the machine.", accent: "#1a2a3a", accent2: "#080f15" },
  { id: "folk-art-americana", title: "American Folk Art", era: "18th — 19th century", blurb: "Self-taught hands, painted signs, and portraits made without formal training.", accent: "#3a3022", accent2: "#15110b" },
  { id: "arts-and-crafts", title: "Arts & Crafts Movement", era: "1880 — 1920", blurb: "A reaction to the factory — handmade texture and honest material.", accent: "#2a3a28", accent2: "#0e150d" },
  { id: "historic-fashion-textiles", title: "Historic Fashion & Textiles", era: "Various", blurb: "Garments and weave as design history, stitched rather than painted.", accent: "#3a2230", accent2: "#150c12" },
  { id: "vintage-posters", title: "Vintage Posters & Graphic Design", era: "1880 — 1950", blurb: "Advertising as art — bold type and flat colour built to be seen from a moving street.", accent: "#3a1e1e", accent2: "#150a0a" },
];

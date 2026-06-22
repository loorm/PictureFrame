export interface ArtPiece {
  title: string;
  artist: string;
  date: string;
  medium: string;
  source: string;
  /** Direct image URL, ideally a Wikimedia Commons Special:FilePath link. */
  image: string;
  /** Where the QR code should point — a museum collection page or Wikipedia article. */
  link: string;
}

export interface Collection {
  id: string;
  title: string;
  era: string;
  blurb: string;
  /** Accent colours used for the image-load placeholder while a piece's image is unavailable. */
  accent: string;
  accent2: string;
  pieces: ArtPiece[];
}

/**
 * Starter set, ported from the original design prototype. Intended to grow over
 * time — see /scripts (future) for API-assisted collection discovery.
 */
export const COLLECTIONS: Collection[] = [
  {
    id: "dutch",
    title: "Dutch Golden Age",
    era: "1600 — 1700",
    blurb:
      "Light, stillness, and the quiet drama of everyday life in the Low Countries.",
    accent: "#6b4f2a",
    accent2: "#241a0f",
    pieces: [
      {
        title: "Girl with a Pearl Earring",
        artist: "Johannes Vermeer",
        date: "c. 1665",
        medium: "Oil on canvas",
        source: "Mauritshuis",
        image:
          "https://commons.wikimedia.org/wiki/Special:FilePath/1665_Girl_with_a_Pearl_Earring.jpg",
        link: "https://www.mauritshuis.nl/en/our-collection/artworks/670-girl-with-a-pearl-earring/",
      },
      {
        title: "The Milkmaid",
        artist: "Johannes Vermeer",
        date: "c. 1658",
        medium: "Oil on canvas",
        source: "Rijksmuseum",
        image:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Johannes_Vermeer_-_Het_melkmeisje_-_Google_Art_Project.jpg",
        link: "https://www.rijksmuseum.nl/en/collection/SK-A-2344",
      },
      {
        title: "The Night Watch",
        artist: "Rembrandt van Rijn",
        date: "1642",
        medium: "Oil on canvas",
        source: "Rijksmuseum",
        image:
          "https://commons.wikimedia.org/wiki/Special:FilePath/The_Night_Watch_-_HD.jpg",
        link: "https://www.rijksmuseum.nl/en/collection/SK-C-5",
      },
    ],
  },
  {
    id: "ukiyoe",
    title: "Japanese Ukiyo-e",
    era: "Edo Period · 1603 — 1868",
    blurb:
      "Woodblock prints of the floating world — waves, weather, and fleeting beauty.",
    accent: "#2b4a63",
    accent2: "#0f1c28",
    pieces: [
      {
        title: "The Great Wave off Kanagawa",
        artist: "Katsushika Hokusai",
        date: "c. 1831",
        medium: "Woodblock print",
        source: "The Met",
        image:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Tsunami_by_hokusai_19th_century.jpg",
        link: "https://www.metmuseum.org/art/collection/search/45434",
      },
      {
        title: "Fine Wind, Clear Morning",
        artist: "Katsushika Hokusai",
        date: "c. 1830",
        medium: "Woodblock print",
        source: "The Met",
        image:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Red_Fuji_southern_wind_clear_morning.jpg",
        link: "https://www.metmuseum.org/art/collection/search/56074",
      },
      {
        title: "Sudden Shower over Shin-Ōhashi Bridge",
        artist: "Utagawa Hiroshige",
        date: "1857",
        medium: "Woodblock print",
        source: "The Met",
        image:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Hiroshige_Atake_sudden_shower.jpg",
        link: "https://www.metmuseum.org/art/collection/search/37362",
      },
    ],
  },
  {
    id: "postimp",
    title: "Post-Impressionism",
    era: "1880 — 1905",
    blurb:
      "Colour set free — the night sky, the lamplit café, paint laid on like emotion.",
    accent: "#243a64",
    accent2: "#0e1730",
    pieces: [
      {
        title: "The Starry Night",
        artist: "Vincent van Gogh",
        date: "1889",
        medium: "Oil on canvas",
        source: "MoMA",
        image:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
        link: "https://www.moma.org/collection/works/79802",
      },
      {
        title: "Café Terrace at Night",
        artist: "Vincent van Gogh",
        date: "1888",
        medium: "Oil on canvas",
        source: "Kröller-Müller",
        image:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Vincent_Willem_van_Gogh_-_Cafe_Terrace_at_Night_(Yorck).jpg",
        link: "https://krollermuller.nl/en/vincent-van-gogh-terrace-of-a-cafe-at-night-place-du-forum",
      },
      {
        title: "Impression, Sunrise",
        artist: "Claude Monet",
        date: "1872",
        medium: "Oil on canvas",
        source: "Musée Marmottan",
        image:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Monet_-_Impression,_Sunrise.jpg",
        link: "https://www.marmottan.fr/en/collections/impression-sunrise/",
      },
    ],
  },
  {
    id: "egypt",
    title: "Ancient Egypt",
    era: "New Kingdom · c. 1550 — 1070 BC",
    blurb:
      "Stone and gold made to outlast empires — the sculptured faces of the divine.",
    accent: "#7a5a22",
    accent2: "#2a1e0c",
    pieces: [
      {
        title: "Bust of Nefertiti",
        artist: "Attributed to Thutmose",
        date: "c. 1345 BC",
        medium: "Painted limestone",
        source: "Neues Museum",
        image:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Nofretete_Neues_Museum.jpg",
        link: "https://www.smb.museum/en/museums-institutions/neues-museum/collection-research/",
      },
      {
        title: "Mask of Tutankhamun",
        artist: "Unknown",
        date: "c. 1323 BC",
        medium: "Gold and inlay",
        source: "Egyptian Museum, Cairo",
        image:
          "https://commons.wikimedia.org/wiki/Special:FilePath/CairoEgMuseumTaaMaskMostlyPhotographed.jpg",
        link: "https://en.wikipedia.org/wiki/Mask_of_Tutankhamun",
      },
      {
        title: "The Seated Scribe",
        artist: "Unknown",
        date: "c. 2600 — 2350 BC",
        medium: "Painted limestone",
        source: "Louvre",
        image:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Egyptian_-_Seated_Scribe_-_Walters_22231.jpg",
        link: "https://collections.louvre.fr/en/ark:/53355/cl010005973",
      },
    ],
  },
  {
    id: "modern",
    title: "Turn of the Century",
    era: "1890 — 1930",
    blurb:
      "Symbolism, gold leaf, and pure geometry — modern art finding its first voices.",
    accent: "#6a2a3a",
    accent2: "#251017",
    pieces: [
      {
        title: "The Kiss",
        artist: "Gustav Klimt",
        date: "1908",
        medium: "Oil and gold leaf",
        source: "Belvedere",
        image:
          "https://commons.wikimedia.org/wiki/Special:FilePath/The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg",
        link: "https://www.belvedere.at/en/kiss",
      },
      {
        title: "Composition II in Red, Blue, and Yellow",
        artist: "Piet Mondrian",
        date: "1930",
        medium: "Oil on canvas",
        source: "Kunsthaus Zürich",
        image:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Piet_Mondriaan,_1930_-_Mondrian_Composition_II_in_Red,_Blue,_and_Yellow.jpg",
        link: "https://en.wikipedia.org/wiki/Composition_II_in_Red,_Blue,_and_Yellow",
      },
      {
        title: "The Scream",
        artist: "Edvard Munch",
        date: "1893",
        medium: "Oil, tempera and pastel",
        source: "National Museum, Norway",
        image:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Edvard_Munch,_1893,_The_Scream,_oil,_tempera_and_pastel_on_cardboard,_91_x_73_cm,_National_Gallery_of_Norway.jpg",
        link: "https://www.nasjonalmuseet.no/en/collection/object/NG.M.00939",
      },
    ],
  },
];

export interface FlatPiece extends ArtPiece {
  collIndex: number;
  pieceIndex: number;
  isCollectionStart: boolean;
  collTitle: string;
  era: string;
  blurb: string;
  accent: string;
  accent2: string;
  pieceCount: number;
}

export function flattenCollections(collections: Collection[]): FlatPiece[] {
  const flat: FlatPiece[] = [];
  collections.forEach((c, ci) => {
    c.pieces.forEach((p, pi) => {
      flat.push({
        ...p,
        collIndex: ci,
        pieceIndex: pi,
        isCollectionStart: pi === 0,
        collTitle: c.title,
        era: c.era,
        blurb: c.blurb,
        accent: c.accent,
        accent2: c.accent2,
        pieceCount: c.pieces.length,
      });
    });
  });
  return flat;
}

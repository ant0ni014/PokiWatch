export interface SeasonMetadata {
  id: number;
  name: string;
  shortName: string;
  startEpisode: number;
  endEpisode: number;
  totalEpisodes: number;
  region: string;
  badgeType: string;
  color: string;
}

export const POKEMON_SEASONS: SeasonMetadata[] = [
  {
    id: 1,
    name: "Staffel 1: Indigo-Liga (Kanto)",
    shortName: "Staffel 1: Kanto",
    startEpisode: 1,
    endEpisode: 82,
    totalEpisodes: 82,
    region: "Kanto",
    badgeType: "Kanto-Orden (8)",
    color: "#ef4444"
  },
  {
    id: 2,
    name: "Staffel 2: Abenteuer auf den Orange-Inseln",
    shortName: "Staffel 2: Orange-Inseln",
    startEpisode: 83,
    endEpisode: 118,
    totalEpisodes: 36,
    region: "Orange-Archipel",
    badgeType: "Korallen-Orden (4)",
    color: "#f97316"
  },
  {
    id: 3,
    name: "Staffel 3: Die Johto-Reisen",
    shortName: "Staffel 3: Johto 1",
    startEpisode: 119,
    endEpisode: 159,
    totalEpisodes: 41,
    region: "Johto",
    badgeType: "Johto-Orden (Flügel, Zephir)",
    color: "#eab308"
  },
  {
    id: 4,
    name: "Staffel 4: Die Johto-Liga Champions",
    shortName: "Staffel 4: Johto Champions",
    startEpisode: 160,
    endEpisode: 211,
    totalEpisodes: 52,
    region: "Johto",
    badgeType: "Johto-Orden (Stahl, Faust)",
    color: "#10b981"
  },
  {
    id: 5,
    name: "Staffel 5: Master Quest (Johto)",
    shortName: "Staffel 5: Master Quest",
    startEpisode: 212,
    endEpisode: 276,
    totalEpisodes: 65,
    region: "Johto / Silberkonferenz",
    badgeType: "Silberkonferenz",
    color: "#3b82f6"
  },
  {
    id: 6,
    name: "Staffel 6: Pokémon Advanced (Hoenn)",
    shortName: "Staffel 6: Advanced",
    startEpisode: 277,
    endEpisode: 316,
    totalEpisodes: 40,
    region: "Hoenn",
    badgeType: "Hoenn-Orden",
    color: "#8b5cf6"
  },
  {
    id: 7,
    name: "Staffel 7: Advanced Challenge",
    shortName: "Staffel 7: Challenge",
    startEpisode: 317,
    endEpisode: 348,
    totalEpisodes: 32,
    region: "Hoenn",
    badgeType: "Hoenn-Orden",
    color: "#ec4899"
  },
  {
    id: 8,
    name: "Staffel 8: Advanced Battle",
    shortName: "Staffel 8: Advanced Battle",
    startEpisode: 349,
    endEpisode: 370,
    totalEpisodes: 22,
    region: "Hoenn",
    badgeType: "Hoenn-Liga",
    color: "#06b6d4"
  },
  {
    id: 9,
    name: "Staffel 9: Battle Frontier (Kampfzone)",
    shortName: "Staffel 9: Battle Frontier",
    startEpisode: 371,
    endEpisode: 391,
    totalEpisodes: 21,
    region: "Kanto Kampfzone",
    badgeType: "Kampfsymbole (7)",
    color: "#f43f5e"
  },
  {
    id: 10,
    name: "Staffel 10: Diamond & Pearl (Sinnoh)",
    shortName: "Staffel 10: Sinnoh",
    startEpisode: 392,
    endEpisode: 423,
    totalEpisodes: 32,
    region: "Sinnoh",
    badgeType: "Sinnoh-Orden",
    color: "#6366f1"
  }
];

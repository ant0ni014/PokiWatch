export type TrainerId = 'trainer_1' | 'trainer_2';

export interface TrainerProfile {
  id: TrainerId;
  name: string;
  avatar: string; // Avatar identifier or emoji
  image?: string; // Path or URL to trainer picture
  accentColor: string; // e.g. '#ef4444', '#3b82f6'
  customPin?: string;
}

export interface Episode {
  id: number;
  season: number;
  seasonName: string;
  episodeInSeason: number;
  titleDe: string;
  titleEn: string;
  youtubeId?: string;
  youtubeUrl?: string;
  summary: string;
  keyEvents: string[];
  pokemonFeatured: string[];
  badgeEarned?: string;
  durationMinutes?: number;
}

export interface EpisodeWatchRecord {
  trainer_1: boolean;
  trainer_2: boolean;
  watchedAt_1?: string;
  watchedAt_2?: string;
}

export type WatchStateMap = Record<number, EpisodeWatchRecord>;

export interface PokiWatchData {
  profiles: {
    trainer_1: TrainerProfile;
    trainer_2: TrainerProfile;
  };
  activeTrainerId: TrainerId;
  watchState: WatchStateMap;
  lastUpdated: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  enabled: boolean;
}

export interface DiscoveredPokemon {
  name: string;
  dexId: number;
  artworkUrl: string;
  isUnlocked: boolean;
  firstAppearanceEpisodeId: number;
  firstAppearanceEpisodeTitle: string;
  allAppearanceEpisodeIds: number[];
}

export type CardRarity = 'common' | 'rare' | 'holo' | 'crown';

export interface TrainerCard {
  id: string; // unique card instance uuid
  pokemonName: string;
  dexId: number;
  rarity: CardRarity;
  hp: number;
  type: string; // e.g. 'Elektro', 'Feuer', 'Wasser', 'Pflanze', 'Normal', etc.
  attackName: string;
  attackDmg: number;
  obtainedAt: string;
  obtainedFromEpisodeId?: number;
}

export interface TradeOffer {
  id: string;
  fromTrainerId: TrainerId;
  toTrainerId: TrainerId;
  offeredCardId: string;
  requestedCardId: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  createdAt: string;
}

export interface CardsState {
  openedPacksCount: {
    trainer_1: number;
    trainer_2: number;
  };
  cards: {
    trainer_1: TrainerCard[];
    trainer_2: TrainerCard[];
  };
  tradeOffers: TradeOffer[];
}


"use client";

import React, { useState, useMemo } from "react";
import {
  CardsState,
  TrainerCard,
  TrainerProfile,
  TrainerId,
  DiscoveredPokemon,
  WatchStateMap,
  Episode
} from "@/types";
import { pullBoosterCards, getTypeStyle } from "@/lib/data/tcgData";
import { getPokemonArtworkUrl } from "@/lib/data/pokemonMap";
import { BoosterOpenModal } from "./BoosterOpenModal";
import { CardDetailModal } from "./CardDetailModal";
import { PokeballLogo } from "./PokeballLogo";
import {
  Sparkles,
  Package,
  BookOpen,
  ArrowLeftRight,
  Search,
  Filter,
  CheckCircle,
  HelpCircle,
  Award,
  Layers
} from "lucide-react";
import confetti from "canvas-confetti";

interface CardsViewProps {
  cardsState: CardsState;
  onUpdateCardsState: (newState: CardsState) => void;
  activeTrainerId: TrainerId;
  profiles: {
    trainer_1: TrainerProfile;
    trainer_2: TrainerProfile;
  };
  unlockedPokemon: DiscoveredPokemon[];
  watchState: WatchStateMap;
  episodes: Episode[];
  onShowToast: (msg: string) => void;
}

export const CardsView: React.FC<CardsViewProps> = ({
  cardsState,
  onUpdateCardsState,
  activeTrainerId,
  profiles,
  unlockedPokemon,
  watchState,
  episodes,
  onShowToast
}) => {
  // Sub-tabs: 'packs' | 'album' | 'trade'
  const [subTab, setSubTab] = useState<"packs" | "album" | "trade">("packs");

  // In Album: view 'my' or 'partner' album
  const [albumOwner, setAlbumOwner] = useState<TrainerId>(activeTrainerId);

  // Filters & Search in Album
  const [search, setSearch] = useState("");
  const [rarityFilter, setRarityFilter] = useState<string>("all");

  // Booster open modal state
  const [isOpeningPack, setIsOpeningPack] = useState(false);
  const [pendingPulledCards, setPendingPulledCards] = useState<TrainerCard[]>([]);

  // Card detail modal
  const [selectedCardForDetail, setSelectedCardForDetail] = useState<{
    card: TrainerCard;
    count: number;
    ownerName: string;
  } | null>(null);

  // Trade selection
  const [selectedMyCardToTrade, setSelectedMyCardToTrade] = useState<string | null>(null);
  const [selectedPartnerCardToTrade, setSelectedPartnerCardToTrade] = useState<string | null>(null);

  const activeProfile = profiles[activeTrainerId];
  const partnerId: TrainerId = activeTrainerId === "trainer_1" ? "trainer_2" : "trainer_1";
  const partnerProfile = profiles[partnerId];

  // Calculate total watched episodes by active trainer
  const watchedCount = useMemo(() => {
    let count = 0;
    Object.values(watchState).forEach((rec) => {
      if (activeTrainerId === "trainer_1" && rec.trainer_1) count++;
      if (activeTrainerId === "trainer_2" && rec.trainer_2) count++;
    });
    return count;
  }, [watchState, activeTrainerId]);

  // Packs earned vs opened
  const openedPacks = cardsState.openedPacksCount?.[activeTrainerId] || 0;
  const availablePacks = Math.max(0, watchedCount - openedPacks);

  // Cards owned by selected album trainer
  const displayedCards = cardsState.cards?.[albumOwner] || [];

  // Group cards by DexId or PokemonName for album presentation
  const groupedCards = useMemo(() => {
    const map = new Map<string, { card: TrainerCard; count: number }>();
    displayedCards.forEach((c) => {
      const key = `${c.dexId}_${c.rarity}`;
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(key, { card: c, count: 1 });
      }
    });

    const list = Array.from(map.values());

    // Sort by DexId, then rarity
    return list.sort((a, b) => a.card.dexId - b.card.dexId);
  }, [displayedCards]);

  // Filtered album cards
  const filteredGroupedCards = useMemo(() => {
    return groupedCards.filter(({ card }) => {
      if (rarityFilter !== "all" && card.rarity !== rarityFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesName = card.pokemonName.toLowerCase().includes(q);
        const matchesDex = card.dexId.toString().includes(q);
        const matchesType = card.type.toLowerCase().includes(q);
        if (!matchesName && !matchesDex && !matchesType) return false;
      }
      return true;
    });
  }, [groupedCards, rarityFilter, search]);

  // Handle starting pack opening
  const handleStartOpenPack = () => {
    if (availablePacks <= 0) {
      onShowToast("⚠️ Keine Packs verfügbar! Schau eine Folge, um eins zu erhalten.");
      return;
    }
    const cards = pullBoosterCards(unlockedPokemon);
    setPendingPulledCards(cards);
    setIsOpeningPack(true);
  };

  // Handle cards accepted from booster
  const handleCardsAccepted = (newCards: TrainerCard[]) => {
    const currentList = cardsState.cards?.[activeTrainerId] || [];
    const currentOpened = cardsState.openedPacksCount?.[activeTrainerId] || 0;

    const updatedState: CardsState = {
      ...cardsState,
      openedPacksCount: {
        ...cardsState.openedPacksCount,
        [activeTrainerId]: currentOpened + 1
      },
      cards: {
        ...cardsState.cards,
        [activeTrainerId]: [...currentList, ...newCards]
      }
    };

    onUpdateCardsState(updatedState);
    onShowToast(`🎉 3 Karten zu deiner Sammlung hinzugefügt!`);
    setIsOpeningPack(false);
    setPendingPulledCards([]);
  };

  // Trade duplicates computation
  const myDuplicates = useMemo(() => {
    const counts = new Map<string, TrainerCard[]>();
    (cardsState.cards?.[activeTrainerId] || []).forEach((c) => {
      const arr = counts.get(c.pokemonName) || [];
      arr.push(c);
      counts.set(c.pokemonName, arr);
    });
    const dupes: TrainerCard[] = [];
    counts.forEach((list) => {
      if (list.length > 1) {
        dupes.push(list[0]);
      }
    });
    return dupes;
  }, [cardsState.cards, activeTrainerId]);

  const partnerDuplicates = useMemo(() => {
    const counts = new Map<string, TrainerCard[]>();
    (cardsState.cards?.[partnerId] || []).forEach((c) => {
      const arr = counts.get(c.pokemonName) || [];
      arr.push(c);
      counts.set(c.pokemonName, arr);
    });
    const dupes: TrainerCard[] = [];
    counts.forEach((list) => {
      if (list.length > 1) {
        dupes.push(list[0]);
      }
    });
    return dupes;
  }, [cardsState.cards, partnerId]);

  // Execute direct trade
  const handleExecuteTrade = () => {
    if (!selectedMyCardToTrade || !selectedPartnerCardToTrade) {
      onShowToast("⚠️ Wähle von beiden Trainern je eine Karte für den Tausch aus!");
      return;
    }

    const myCardList = [...(cardsState.cards?.[activeTrainerId] || [])];
    const partnerCardList = [...(cardsState.cards?.[partnerId] || [])];

    const myCardIdx = myCardList.findIndex((c) => c.id === selectedMyCardToTrade);
    const partnerCardIdx = partnerCardList.findIndex((c) => c.id === selectedPartnerCardToTrade);

    if (myCardIdx === -1 || partnerCardIdx === -1) {
      onShowToast("Fehler beim Tausch: Karte nicht gefunden.");
      return;
    }

    const cardFromMe = myCardList.splice(myCardIdx, 1)[0];
    const cardFromPartner = partnerCardList.splice(partnerCardIdx, 1)[0];

    myCardList.push(cardFromPartner);
    partnerCardList.push(cardFromMe);

    const updatedState: CardsState = {
      ...cardsState,
      cards: {
        ...cardsState.cards,
        [activeTrainerId]: myCardList,
        [partnerId]: partnerCardList
      }
    };

    onUpdateCardsState(updatedState);
    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch {}

    onShowToast(`🔄 Tausch erfolgreich! ${cardFromPartner.pokemonName} erhalten!`);
    setSelectedMyCardToTrade(null);
    setSelectedPartnerCardToTrade(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Sub-Navigation Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab("packs")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition ${
              subTab === "packs"
                ? "bg-red-600 text-white shadow-md shadow-red-500/25"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Booster Packs</span>
            {availablePacks > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                {availablePacks}
              </span>
            )}
          </button>

          <button
            onClick={() => setSubTab("album")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition ${
              subTab === "album"
                ? "bg-red-600 text-white shadow-md shadow-red-500/25"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Sammelalbum</span>
            <span className="ml-1 text-[11px] opacity-80">({displayedCards.length})</span>
          </button>

          <button
            onClick={() => setSubTab("trade")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition ${
              subTab === "trade"
                ? "bg-red-600 text-white shadow-md shadow-red-500/25"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Tauschen</span>
            {(myDuplicates.length > 0 || partnerDuplicates.length > 0) && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>
        </div>

        {/* Quick status */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <span>Trainer:</span>
          <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 font-black">
            {activeProfile.name}
          </span>
        </div>
      </div>

      {/* TAB 1: BOOSTER PACKS OPENING */}
      {subTab === "packs" && (
        <div className="space-y-6">
          {/* Main Hero Card for Opening */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 text-white p-6 sm:p-8 shadow-xl border-4 border-red-800 text-center flex flex-col items-center">
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/30 shadow-inner mb-4">
              <PokeballLogo size="xl" className="hover:rotate-45 transition-transform duration-500" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
              Pokémon TCG Booster Packs
            </h2>
            <p className="text-xs sm:text-sm text-red-100 max-w-md mx-auto mb-6">
              Jede geschaute Folge schaltet 1 Booster-Pack frei! Ziehe bis zu 3 Karten aus den bisher entdeckten Pokémon deiner Reise.
            </p>

            {/* Pack Count Stat Box */}
            <div className="inline-flex items-center gap-4 bg-slate-950/40 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 mb-6">
              <div className="text-left">
                <span className="block text-[10px] uppercase font-black tracking-wider text-amber-300">
                  Verfügbare Packs
                </span>
                <span className="text-2xl font-black text-white">{availablePacks}</span>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-left">
                <span className="block text-[10px] uppercase font-black tracking-wider text-slate-300">
                  Bereits geöffnet
                </span>
                <span className="text-2xl font-black text-slate-200">{openedPacks}</span>
              </div>
            </div>

            {/* Open Button */}
            <button
              onClick={handleStartOpenPack}
              disabled={availablePacks <= 0}
              className={`flex items-center gap-2.5 px-8 py-4 rounded-2xl font-black text-base shadow-2xl transition-all duration-200 ${
                availablePacks > 0
                  ? "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 cursor-pointer hover:scale-105 active:scale-95 shadow-amber-500/30 animate-pulse"
                  : "bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700"
              }`}
            >
              <Package className="w-5 h-5 flex-shrink-0" />
              <span>
                {availablePacks > 0 ? `Booster öffnen (1 von ${availablePacks})` : "Keine Packs verfügbar"}
              </span>
            </button>

            {availablePacks <= 0 && (
              <p className="text-[11px] text-red-200 mt-3 font-semibold">
                💡 Schau die nächste Folge und markiere sie als geschaut, um sofort ein neues Pack zu erhalten!
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SAMMELALBUM (BINDER) */}
      {subTab === "album" && (
        <div className="space-y-5">
          {/* Owner Switcher & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            {/* Album Selector (Ash vs Misty) */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => setAlbumOwner("trainer_1")}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-black transition ${
                  albumOwner === "trainer_1"
                    ? "bg-white text-red-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {profiles.trainer_1.name}s Album ({cardsState.cards?.trainer_1?.length || 0})
              </button>
              <button
                onClick={() => setAlbumOwner("trainer_2")}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-black transition ${
                  albumOwner === "trainer_2"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {profiles.trainer_2.name}s Album ({cardsState.cards?.trainer_2?.length || 0})
              </button>
            </div>

            {/* Rarity & Search */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Pokémon suchen..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-red-500 outline-none"
                />
              </div>

              <select
                value={rarityFilter}
                onChange={(e) => setRarityFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-bold outline-none"
              >
                <option value="all">Alle Seltenheiten</option>
                <option value="crown">👑 Crown</option>
                <option value="holo">★ Holo</option>
                <option value="rare">◆◆ Rare</option>
                <option value="common">◆ Common</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredGroupedCards.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 space-y-3">
              <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-600">Noch keine Karten in diesem Album gefunden.</p>
              <p className="text-xs max-w-sm mx-auto">
                Öffne deine verdienten Booster-Packs, um das Album mit seltenen Pokémon-Karten zu füllen!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {filteredGroupedCards.map(({ card, count }) => {
                const isCrown = card.rarity === "crown";
                const isHolo = card.rarity === "holo";
                const artworkUrl = getPokemonArtworkUrl(card.pokemonName) ||
                  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${card.dexId}.png`;

                return (
                  <div
                    key={card.id}
                    onClick={() =>
                      setSelectedCardForDetail({
                        card,
                        count,
                        ownerName: profiles[albumOwner].name
                      })
                    }
                    className={`group relative cursor-pointer aspect-[2.5/3.5] rounded-2xl p-2.5 flex flex-col justify-between text-slate-900 border-2 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all select-none overflow-hidden ${
                      isCrown
                        ? "bg-gradient-to-br from-amber-300 via-yellow-100 to-amber-400 border-amber-400 shadow-amber-500/20"
                        : isHolo
                        ? "bg-gradient-to-br from-indigo-100 via-sky-50 to-pink-100 border-indigo-300 shadow-indigo-500/20"
                        : "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-300/60 pb-1">
                      <span className="font-black text-[11px] sm:text-xs truncate max-w-[70px]">
                        {card.pokemonName}
                      </span>
                      <span className="text-[10px] font-black text-red-600">
                        {card.hp} <span className="text-[8px] text-slate-500">KP</span>
                      </span>
                    </div>

                    {/* Artwork */}
                    <div className="my-1 rounded-xl overflow-hidden bg-slate-100 border border-slate-300/80 aspect-[4/3] flex items-center justify-center p-1 relative shadow-inner">
                      <img
                        src={artworkUrl}
                        alt={card.pokemonName}
                        className="max-h-full max-w-full object-contain filter drop-shadow-xs group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                      {isCrown && (
                        <span className="absolute top-1 right-1 text-xs">👑</span>
                      )}
                    </div>

                    {/* Bottom attack & count badge */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-300/60 text-[9px] font-bold">
                      <span className="truncate max-w-[65px] text-slate-700">
                        {card.attackName}
                      </span>
                      {count > 1 ? (
                        <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white font-black text-[9px]">
                          x{count}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[8px] font-black uppercase">
                          {card.rarity}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TAUSCHBÖRSE (TRADE) */}
      {subTab === "trade" && (
        <div className="space-y-6">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-900 to-purple-900 text-white shadow-md">
            <h3 className="text-base sm:text-lg font-black flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-amber-300" />
              <span>Karten-Tausch zwischen {profiles.trainer_1.name} & {profiles.trainer_2.name}</span>
            </h3>
            <p className="text-xs text-indigo-200 mt-1">
              Hier seht ihr doppelte Karten! Wählt je eine Karte aus beiden Listen aus, um einen direkten 1-zu-1 Tausch durchzuführen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* My Duplicates */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="font-black text-sm text-slate-900 flex items-center justify-between">
                <span>Deine doppelten Karten ({activeProfile.name})</span>
                <span className="text-xs text-slate-500 font-bold">{myDuplicates.length} verfügbar</span>
              </h4>

              {myDuplicates.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center italic">
                  Du hast momentan keine doppelten Karten zum Tauschen.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {myDuplicates.map((card) => {
                    const isSelected = selectedMyCardToTrade === card.id;
                    const artworkUrl = getPokemonArtworkUrl(card.pokemonName) ||
                      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${card.dexId}.png`;

                    return (
                      <div
                        key={card.id}
                        onClick={() => setSelectedMyCardToTrade(isSelected ? null : card.id)}
                        className={`cursor-pointer p-2 rounded-xl border-2 transition text-center ${
                          isSelected
                            ? "border-red-500 bg-red-50 shadow-md scale-102"
                            : "border-slate-200 hover:border-slate-300 bg-slate-50"
                        }`}
                      >
                        <img src={artworkUrl} alt={card.pokemonName} className="w-12 h-12 mx-auto object-contain" />
                        <p className="text-xs font-black truncate mt-1 text-slate-800">{card.pokemonName}</p>
                        <span className="text-[9px] font-bold text-slate-500 uppercase">{card.rarity}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Partner Duplicates */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="font-black text-sm text-slate-900 flex items-center justify-between">
                <span>Doppelte Karten von {partnerProfile.name}</span>
                <span className="text-xs text-slate-500 font-bold">{partnerDuplicates.length} verfügbar</span>
              </h4>

              {partnerDuplicates.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center italic">
                  {partnerProfile.name} hat aktuell keine doppelten Karten.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {partnerDuplicates.map((card) => {
                    const isSelected = selectedPartnerCardToTrade === card.id;
                    const artworkUrl = getPokemonArtworkUrl(card.pokemonName) ||
                      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${card.dexId}.png`;

                    return (
                      <div
                        key={card.id}
                        onClick={() => setSelectedPartnerCardToTrade(isSelected ? null : card.id)}
                        className={`cursor-pointer p-2 rounded-xl border-2 transition text-center ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 shadow-md scale-102"
                            : "border-slate-200 hover:border-slate-300 bg-slate-50"
                        }`}
                      >
                        <img src={artworkUrl} alt={card.pokemonName} className="w-12 h-12 mx-auto object-contain" />
                        <p className="text-xs font-black truncate mt-1 text-slate-800">{card.pokemonName}</p>
                        <span className="text-[9px] font-bold text-slate-500 uppercase">{card.rarity}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Execute Trade Action */}
          <div className="flex items-center justify-center pt-2">
            <button
              onClick={handleExecuteTrade}
              disabled={!selectedMyCardToTrade || !selectedPartnerCardToTrade}
              className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-sm shadow-xl transition-all ${
                selectedMyCardToTrade && selectedPartnerCardToTrade
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white cursor-pointer hover:scale-105 active:scale-95 shadow-emerald-500/25"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Ausgewählte Karten tauschen</span>
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {isOpeningPack && (
        <BoosterOpenModal
          isOpen={isOpeningPack}
          onClose={() => setIsOpeningPack(false)}
          cards={pendingPulledCards}
          onCardsAccepted={handleCardsAccepted}
          trainerName={activeProfile.name}
        />
      )}

      {selectedCardForDetail && (
        <CardDetailModal
          card={selectedCardForDetail.card}
          count={selectedCardForDetail.count}
          trainerName={selectedCardForDetail.ownerName}
          onClose={() => setSelectedCardForDetail(null)}
        />
      )}
    </div>
  );
};

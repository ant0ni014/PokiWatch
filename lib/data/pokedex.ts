import { Episode, WatchStateMap, DiscoveredPokemon } from "@/types";
import { getPokemonArtworkUrl, getPokemonDexId } from "./pokemonMap";

export interface PokedexSummary {
  pokemonList: DiscoveredPokemon[];
  totalUniqueCount: number;
  unlockedCount: number;
  percentage: number;
}

/**
 * Compute the shared Pokédex based on watched episodes.
 * A Pokémon is ONLY unlocked if BOTH trainers (Ash & Misty) have watched at least one episode where it appeared!
 */
export function calculateSharedPokedex(
  episodes: Episode[],
  watchState: WatchStateMap
): PokedexSummary {
  // Map of unique Pokémon name -> appearance info
  const registry = new Map<
    string,
    {
      name: string;
      dexId: number;
      artworkUrl: string;
      isUnlocked: boolean;
      firstEpId: number;
      firstEpTitle: string;
      allEpIds: number[];
    }
  >();

  for (const ep of episodes) {
    // Both trainers have watched this episode
    const watchedByBoth = !!(watchState[ep.id]?.trainer_1 && watchState[ep.id]?.trainer_2);

    for (const pName of ep.pokemonFeatured) {
      const cleanName = pName.trim();
      if (!cleanName) continue;

      const dexId = getPokemonDexId(cleanName) || 9999;
      const artworkUrl = getPokemonArtworkUrl(cleanName) || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dexId}.png`;

      const existing = registry.get(cleanName);
      if (!existing) {
        registry.set(cleanName, {
          name: cleanName,
          dexId,
          artworkUrl,
          isUnlocked: watchedByBoth,
          firstEpId: ep.id,
          firstEpTitle: ep.titleDe,
          allEpIds: [ep.id]
        });
      } else {
        existing.allEpIds.push(ep.id);
        if (watchedByBoth) {
          existing.isUnlocked = true;
        }
      }
    }
  }

  // Convert to array
  const list: DiscoveredPokemon[] = Array.from(registry.values()).map((item) => ({
    name: item.name,
    dexId: item.dexId,
    artworkUrl: item.artworkUrl,
    isUnlocked: item.isUnlocked,
    firstAppearanceEpisodeId: item.firstEpId,
    firstAppearanceEpisodeTitle: item.firstEpTitle,
    allAppearanceEpisodeIds: item.allEpIds
  }));

  // Sort by Dex ID, with unknown IDs placed at the end
  list.sort((a, b) => {
    if (a.dexId !== b.dexId) {
      return a.dexId - b.dexId;
    }
    return a.firstAppearanceEpisodeId - b.firstAppearanceEpisodeId;
  });

  const unlockedCount = list.filter((p) => p.isUnlocked).length;
  const totalUniqueCount = list.length;
  const percentage = totalUniqueCount > 0 ? Math.round((unlockedCount / totalUniqueCount) * 100) : 0;

  return {
    pokemonList: list,
    totalUniqueCount,
    unlockedCount,
    percentage
  };
}

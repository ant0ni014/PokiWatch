import { CardRarity, DiscoveredPokemon, TrainerCard } from "@/types";
import { getPokemonDexId } from "./pokemonMap";

export interface PokemonTypeInfo {
  type: string;
  badgeColor: string;
  bgGradient: string;
  borderClass: string;
}

// Pokemon elementary type mapping
export const POKEMON_ELEMENT_MAP: Record<string, string> = {
  // Fire
  Glumanda: "Feuer", Glutexo: "Feuer", Glurak: "Feuer",
  Vulpix: "Feuer", Vulnona: "Feuer", Fukano: "Feuer", Arkani: "Feuer",
  Ponita: "Feuer", Gallopa: "Feuer", Magmar: "Feuer", Flamara: "Feuer",
  Lavados: "Feuer", Feurigel: "Feuer", Igelavar: "Feuer", Tornupto: "Feuer",
  Flemmli: "Feuer", Jungglut: "Feuer", Lohgock: "Feuer", Panflam: "Feuer",

  // Water
  Schiggy: "Wasser", Schillok: "Wasser", Turtok: "Wasser",
  Enton: "Wasser", Entoron: "Wasser", Quapsel: "Wasser", Quaputzi: "Wasser", Quappo: "Wasser",
  Tentacha: "Wasser", Tentoxa: "Wasser", Flegmon: "Wasser", Lahmus: "Wasser",
  Jurob: "Wasser", Jugong: "Wasser", Muschas: "Wasser", Austos: "Wasser",
  Krabby: "Wasser", Kingler: "Wasser", Seeper: "Wasser", Seemon: "Wasser",
  Goldini: "Wasser", Golking: "Wasser", Sterndu: "Wasser", Starmie: "Wasser",
  Karpador: "Wasser", Garados: "Wasser", Lapras: "Wasser", Aquana: "Wasser",
  Amonitas: "Wasser", Amoroso: "Wasser", Kabuto: "Wasser", Kabutops: "Wasser",
  Karnimani: "Wasser", Tyracroc: "Wasser", Impergator: "Wasser", Marill: "Wasser", Azumarill: "Wasser",
  Hydropi: "Wasser", Plinfa: "Wasser",

  // Grass / Poison / Bug
  Bisasam: "Pflanze", Bisaknosp: "Pflanze", Bisaflor: "Pflanze",
  Myrapla: "Pflanze", Duflor: "Pflanze", Giflor: "Pflanze",
  Paras: "Pflanze", Parasek: "Pflanze", Knofensa: "Pflanze", Ultrigaria: "Pflanze", Sarzenia: "Pflanze",
  Owei: "Pflanze", Kokowei: "Pflanze", Tangela: "Pflanze", Endivie: "Pflanze", Lorblatt: "Pflanze", Meganie: "Pflanze",
  Geckarbor: "Pflanze", Chelast: "Pflanze",
  Raupy: "Käfer", Safcon: "Käfer", Smettbo: "Käfer",
  Hornliu: "Käfer", Kokuna: "Käfer", Bibor: "Käfer",
  Bluzuk: "Käfer", Omot: "Käfer", Sichlor: "Käfer", Pinsir: "Käfer", Skaraborn: "Käfer",

  // Electric
  Pikachu: "Elektro", Raichu: "Elektro",
  Magnetilo: "Elektro", Magneton: "Elektro",
  Voltobal: "Elektro", Lektrobal: "Elektro",
  Elektek: "Elektro", Blitza: "Elektro", Zapdos: "Elektro",
  Pichu: "Elektro", Voltilamm: "Elektro", Ampharos: "Elektro", Sheinux: "Elektro", Luxtra: "Elektro",

  // Psychic / Ghost
  Abra: "Psycho", Kadabra: "Psycho", Simsala: "Psycho",
  Traumato: "Psycho", Hypno: "Psycho", Pantimos: "Psycho", Rossana: "Psycho",
  Mewtu: "Psycho", Mew: "Psycho", Psiana: "Psycho", Woingenau: "Psycho",
  Nebulak: "Geist", Alpollo: "Geist", Gengar: "Geist",

  // Fighting / Rock / Ground
  Sandan: "Boden", Sandamer: "Boden", Digda: "Boden", Digdri: "Boden",
  Kleinstein: "Gestein", Georok: "Gestein", Geowaz: "Gestein", Onix: "Gestein",
  Tragosso: "Boden", Knogga: "Boden", Rihorn: "Boden", Rizeros: "Boden",
  Machollo: "Kampf", Maschock: "Kampf", Machomei: "Kampf",
  Menki: "Kampf", Rasaff: "Kampf", Kicklee: "Kampf", Nockchan: "Kampf",
  Kapoera: "Kampf", Skorgla: "Boden", Despotar: "Gestein", Lucario: "Kampf",

  // Normal / Flying / Dragon
  Taubsi: "Normal", Tauboga: "Normal", Tauboss: "Normal",
  Rattfratz: "Normal", Rattikarl: "Normal", Habitak: "Normal", Ibitak: "Normal",
  Piepi: "Fee", Pixi: "Fee", Pummeluff: "Normal", Knuddeluff: "Normal",
  Mauzi: "Normal", Snobilikat: "Normal", Schlurpk: "Normal", Chaneira: "Normal",
  Kangama: "Normal", Tauros: "Normal", Dito: "Normal", Evoli: "Normal", Porygon: "Normal",
  Relaxo: "Normal", Dratini: "Drache", Dragonir: "Drache", Dragoran: "Drache",
  Togepi: "Fee", Togetic: "Fee", Miltank: "Normal", Heiteira: "Normal"
};

export function getPokemonType(name: string): string {
  const clean = name.replace(/\s*\(.*?\)\s*/g, "").trim();
  return POKEMON_ELEMENT_MAP[clean] || "Normal";
}

export function getTypeStyle(type: string): PokemonTypeInfo {
  switch (type) {
    case "Feuer":
      return {
        type,
        badgeColor: "bg-red-500 text-white",
        bgGradient: "from-orange-500/20 via-red-500/10 to-amber-500/20",
        borderClass: "border-red-400"
      };
    case "Wasser":
      return {
        type,
        badgeColor: "bg-blue-500 text-white",
        bgGradient: "from-blue-500/20 via-sky-400/10 to-cyan-500/20",
        borderClass: "border-sky-400"
      };
    case "Pflanze":
      return {
        type,
        badgeColor: "bg-emerald-500 text-white",
        bgGradient: "from-emerald-500/20 via-green-400/10 to-teal-500/20",
        borderClass: "border-emerald-400"
      };
    case "Elektro":
      return {
        type,
        badgeColor: "bg-yellow-400 text-slate-950",
        bgGradient: "from-yellow-400/25 via-amber-300/15 to-yellow-500/20",
        borderClass: "border-yellow-400"
      };
    case "Psycho":
      return {
        type,
        badgeColor: "bg-purple-500 text-white",
        bgGradient: "from-purple-500/20 via-pink-400/10 to-indigo-500/20",
        borderClass: "border-purple-400"
      };
    case "Kampf":
    case "Gestein":
    case "Boden":
      return {
        type,
        badgeColor: "bg-amber-700 text-white",
        bgGradient: "from-amber-700/20 via-orange-600/10 to-stone-500/20",
        borderClass: "border-amber-600"
      };
    case "Geist":
      return {
        type,
        badgeColor: "bg-indigo-700 text-white",
        bgGradient: "from-indigo-800/20 via-purple-900/10 to-violet-800/20",
        borderClass: "border-indigo-500"
      };
    case "Drache":
      return {
        type,
        badgeColor: "bg-violet-600 text-white",
        bgGradient: "from-violet-600/25 via-fuchsia-600/15 to-indigo-600/20",
        borderClass: "border-violet-400"
      };
    default:
      return {
        type: "Normal",
        badgeColor: "bg-slate-500 text-white",
        bgGradient: "from-slate-400/20 via-gray-300/10 to-slate-500/20",
        borderClass: "border-slate-400"
      };
  }
}

// Attack generator based on type and rarity
export function getPokemonAttack(name: string, type: string, rarity: CardRarity): { name: string; dmg: number; hp: number } {
  const baseHp = rarity === 'crown' ? 150 : rarity === 'holo' ? 120 : rarity === 'rare' ? 90 : 60;
  const hpBonus = Math.floor(Math.random() * 3) * 10;
  const hp = baseHp + hpBonus;

  let attackName = "Tackle";
  let dmg = 20;

  switch (type) {
    case "Feuer":
      attackName = rarity === 'crown' ? "Gigantisches Flammeninferno" : rarity === 'holo' ? "Flammenwurf" : rarity === 'rare' ? "Feuerwirbel" : "Glut";
      dmg = rarity === 'crown' ? 160 : rarity === 'holo' ? 100 : rarity === 'rare' ? 60 : 30;
      break;
    case "Wasser":
      attackName = rarity === 'crown' ? "Hydropumpe Extrem" : rarity === 'holo' ? "Hydropumpe" : rarity === 'rare' ? "Blubbstrahl" : "Aquaknarre";
      dmg = rarity === 'crown' ? 150 : rarity === 'holo' ? 90 : rarity === 'rare' ? 50 : 30;
      break;
    case "Pflanze":
      attackName = rarity === 'crown' ? "Solarstrahl Max" : rarity === 'holo' ? "Solarstrahl" : rarity === 'rare' ? "Rasierblatt" : "Rankenhieb";
      dmg = rarity === 'crown' ? 150 : rarity === 'holo' ? 90 : rarity === 'rare' ? 50 : 20;
      break;
    case "Elektro":
      attackName = rarity === 'crown' ? "10.000.000 Volt Donner" : rarity === 'holo' ? "Donnerblitz" : rarity === 'rare' ? "Funkensprung" : "Donnerschock";
      dmg = rarity === 'crown' ? 170 : rarity === 'holo' ? 90 : rarity === 'rare' ? 50 : 30;
      break;
    case "Psycho":
      attackName = rarity === 'crown' ? "Psychostoß Nova" : rarity === 'holo' ? "Psychokinese" : rarity === 'rare' ? "Konfusion" : "Psystrahl";
      dmg = rarity === 'crown' ? 160 : rarity === 'holo' ? 90 : rarity === 'rare' ? 50 : 30;
      break;
    case "Drache":
      attackName = rarity === 'crown' ? "Drachenklaue Ultimativ" : rarity === 'holo' ? "Drachenwut" : "Windhose";
      dmg = rarity === 'crown' ? 170 : rarity === 'holo' ? 100 : 60;
      break;
    default:
      attackName = rarity === 'crown' ? "Hyperstrahl Gigant" : rarity === 'holo' ? "Hyperstrahl" : rarity === 'rare' ? "Bodyslam" : "Ruckzuckhieb";
      dmg = rarity === 'crown' ? 140 : rarity === 'holo' ? 80 : rarity === 'rare' ? 40 : 20;
  }

  return { name: attackName, dmg, hp };
}

// Fallback pool of iconic Kanto Pokemon
export const STARTER_POOL = [
  "Pikachu", "Bisasam", "Glumanda", "Schiggy",
  "Raupy", "Taubsi", "Rattfratz", "Pummeluff",
  "Mauzi", "Enton", "Fukano", "Quapsel",
  "Abra", "Machollo", "Kleinstein", "Evoli",
  "Smettbo", "Tauboga", "Glutexo", "Schillok",
  "Bisaknosp", "Arkani", "Gengar", "Relaxo",
  "Glurak", "Turtok", "Bisaflor", "Raichu", "Mewtu"
];

/**
 * Random rarity determination
 * - Crown (Secret): 3%
 * - Holo: 12%
 * - Rare: 25%
 * - Common: 60%
 */
export function rollRarity(): CardRarity {
  const rand = Math.random() * 100;
  if (rand < 3) return "crown";
  if (rand < 15) return "holo";
  if (rand < 40) return "rare";
  return "common";
}

/**
 * Pull 3 cards from the available unlocked pool
 */
export function pullBoosterCards(
  unlockedPokemon: DiscoveredPokemon[],
  episodeIdHint?: number
): TrainerCard[] {
  // Filter pool to actually unlocked ones if available
  const availableUnlocked = unlockedPokemon.filter(p => p.isUnlocked);
  const pool = availableUnlocked.length > 0
    ? availableUnlocked.map(p => p.name)
    : STARTER_POOL;

  const results: TrainerCard[] = [];

  for (let i = 0; i < 3; i++) {
    // Pick random pokemon
    const chosenName = pool[Math.floor(Math.random() * pool.length)];
    const dexId = getPokemonDexId(chosenName) || (Math.floor(Math.random() * 151) + 1);
    const rarity = rollRarity();
    const type = getPokemonType(chosenName);
    const attack = getPokemonAttack(chosenName, type, rarity);

    results.push({
      id: `card_${Date.now()}_${Math.random().toString(36).substring(2, 9)}_${i}`,
      pokemonName: chosenName,
      dexId,
      rarity,
      hp: attack.hp,
      type,
      attackName: attack.name,
      attackDmg: attack.dmg,
      obtainedAt: new Date().toISOString(),
      obtainedFromEpisodeId: episodeIdHint
    });
  }

  return results;
}

export interface PokemonFactInfo {
  category: string;
  types: string[];
  description: string; // Official Pokédex Biography
  facts: string[];
}

export const POKEMON_FACTS_DATABASE: Record<string, PokemonFactInfo> = {
  "Pikachu": {
    category: "Maus-Pokémon",
    types: ["Elektro"],
    description: "Dieses schlaue Pokémon lädt seine roten Backentaschen im Schlaf mit Elektrizität auf. Berührt man es unerwartet, entlädt es kleine Stromschläge.",
    facts: [
      "Pikachu speichert elektrische Energie in seinen roten Backentaschen. Wenn es wütend wird, entlädt es diese als mächtigen Blitz!",
      "Ashs Pikachu weigert sich bis heute strikt, seinen Pokéball zu betreten oder sich mit einem Donnerstein zu Raichu weiterzuentwickeln.",
      "Es liebt Ketchup über alles – in Staffel 1 trauerte Pikachu herzzerreißend um eine zerbrochene Ketchupflasche!"
    ]
  },
  "Glumanda": {
    category: "Echsen-Pokémon",
    types: ["Feuer"],
    description: "Dieses Pokémon bevorzugt heiße Dinge. Wenn es regnet, dampft die Spitze seines Schwanzes. Seine Flamme spiegelt seine Lebenskraft wider.",
    facts: [
      "Die Flamme an Glumandas Schwanzspitze brennt seit seiner Geburt. Sie spiegelt seinen emotionalen und körperlichen Zustand wider.",
      "Ash rettete sein Glumanda in Staffel 1 vor dem Ertrinken im Regen, nachdem sein ursprünglicher Trainer Damian es grausam ausgesetzt hatte.",
      "Wenn Glumanda gesund und glücklich ist, lodert seine Flamme kräftig und hell."
    ]
  },
  "Glurak": {
    category: "Flammen-Pokémon",
    types: ["Feuer", "Flug"],
    description: "Es speit Flammen, die so heiß sind, dass sie riesige Felsbrocken zum Schmelzen bringen. Es fliegt hoch über den Himmel auf der Suche nach starken Gegnern.",
    facts: [
      "Gluraks Flammenatem ist so heiß, dass er selbst Felsbrocken zum Schmelzen bringen kann.",
      "Nach seiner Entwicklung war Ashs Glurak extrem rebellisch und schlief oft mitten im Kampf ein, bis Ash es im Kampf gegen Quappo aufopferungsvoll wärmte.",
      "Glurak zählt zu Ashs stärksten Pokémon aller Zeiten und besiegte im Finale der Kanto-Liga sogar Magmar auf einem Vulkan!"
    ]
  },
  "Bisasam": {
    category: "Samen-Pokémon",
    types: ["Pflanze", "Gift"],
    description: "Dieses Pokémon trägt von Geburt an einen Pflanzensamen auf seinem Rücken, der mit ihm heranwächst und durch Sonnenlicht Energie tankt.",
    facts: [
      "Die Knospe auf seinem Rücken wächst mit ihm mit und saugt Sonnenlicht auf, um Photosynthese zu betreiben.",
      "Ashs Bisasam war der Anführer und Friedensstifter im Pokémon-Dorf und beschützte verletzte Pokémon vor Gefahren.",
      "Es entschied sich im Anime ganz bewusst gegen eine Entwicklung zu Bisaknosp, um immer Bisasam zu bleiben."
    ]
  },
  "Schiggy": {
    category: "Minikröten-Pokémon",
    types: ["Wasser"],
    description: "Nach der Geburt schwillt sein Rücken an und verhärtet sich zu einem robusten Schutzpanzer. Es schießt kraftvolle Wasserstrahlen aus seinem Mund.",
    facts: [
      "Sein runder Panzer schützt es vor Angriffen und verringert den Wasserwiderstand beim blitzschnellen Schwimmen.",
      "Vor seiner Reise mit Ash war Schiggy der coole Anführer der berüchtigten 'Schiggy-Meute', komplett mit spitzer Sonnenbrille!",
      "Später schloss sich Ashs Schiggy der Feuerwehr an und kehrte immer wieder für wichtige Turniere zurück."
    ]
  },
  "Raupy": {
    category: "Wurm-Pokémon",
    types: ["Käfer"],
    description: "Um sich vor Feinden zu schützen, stößt es aus der roten Antenne auf seinem Kopf einen übelriechenden Geruch aus. Mit seinen Saugnapffüßen erklimmt es Bäume.",
    facts: [
      "Raupy war das allererste wilde Pokémon, das Ash Ketchum auf seiner Reise überhaupt gefangen hat (in Folge 3)!",
      "Misty hatte panische Angst vor Raupy, doch Raupy träumte davon, eines Tages ein wunderschönes Smettbo zu werden, um sie zu beeindrucken.",
      "Es schlägt Fressfeinde mit einem übelriechenden Geruch aus seinen roten Fühlern in die Flucht."
    ]
  },
  "Safcon": {
    category: "Kokon-Pokémon",
    types: ["Käfer"],
    description: "Sein harter Panzer schützt seinen weichen Körper während der Metamorphose. Es wartet regungslos ab, bis die Entwicklung abgeschlossen ist.",
    facts: [
      "Ashs Safcon lieferte sich im Vertania-Wald ein episches 'Härtner'-Duell gegen das Safcon eines Sammlers, das stundenlang dauerte!",
      "Obwohl es fast unbeweglich schien, sprang es heldenhaft vor Ash, um ihn vor einem wütenden Schwarm Bibor zu retten."
    ]
  },
  "Smettbo": {
    category: "Falter-Pokémon",
    types: ["Käfer", "Flug"],
    description: "Im Kampf flattert es geschwind mit seinen Flügeln und verstreut feinen, giftigen Puder in der Luft. Seine Facettenaugen erkennen selbst kleinste Blüten.",
    facts: [
      "Smettbo kann giftigen, betäubenden oder einschläfernden Puder von seinen Flügeln herabregnen lassen.",
      "Ashs Abschied von seinem Smettbo in Folge 21 ('Auf Wiedersehen, Smettbo') gilt als einer der emotionalsten Momente der gesamten Anime-Geschichte.",
      "Es verließ Ash, um mit einem pinken Smettbo über das Meer zu ziehen und eine Familie zu gründen."
    ]
  },
  "Taubsi": {
    category: "Kleinvogel-Pokémon",
    types: ["Normal", "Flug"],
    description: "Ein sanftmütiges Vogel-Pokémon, das Feinde lieber mit aufgewirbeltem Sand verwirrt, als direkt anzugreifen. Es hat einen hervorragenden Orientierungssinn.",
    facts: [
      "Taubsi war das erste Pokémon, das Ash im hohen Gras mit einem Stein bewarf – woraufhin es ihn attackierte!",
      "Es kann selbst aus weiten Entfernungen zielsicher zu seinem Nest zurückfinden."
    ]
  },
  "Tauboga": {
    category: "Vogel-Pokémon",
    types: ["Normal", "Flug"],
    description: "Es besitzt eine überragende Sehkraft und kann selbst aus Kilometern Höhe kleinste Beute am Boden erspähen. Mit scharfen Krallen greift es an.",
    facts: [
      "Tauboga besitzt eine exzellente Sehkraft und kann selbst aus Kilometern Höhe kleinste Beute am Boden erspähen.",
      "Ash fing Tauboga im Vertania-Wald; es entwickelte sich später zu Tauboss, um einen Taubsi-Schwarm vor wilden Habitak zu beschützen."
    ]
  },
  "Mauzi": {
    category: "Katzen-Pokémon",
    types: ["Normal"],
    description: "Es liebt runde, glänzende Gegenstände über alles. Nachts schleicht es leise durch die Straßen und sammelt verlorene Münzen auf.",
    facts: [
      "Team Rockets Mauzi ist eines der wenigen Pokémon weltweit, das fließend die menschliche Sprache sprechen und auf zwei Beinen gehen kann!",
      "Es lernte sprechen, um eine reiche Katzendame namens Miauzi zu beeindrucken – diese hielt es daraufhin jedoch für ein Freak-Pokémon.",
      "Mauzi liebt glänzende Münzen und Schätze über alles."
    ]
  },
  "Enton": {
    category: "Enten-Pokémon",
    types: ["Wasser"],
    description: "Es wird ständig von schweren Kopfschmerzen geplagt. Wenn die Schmerzen unerträglich werden, entfesselt es gewaltige telekinetische Psycho-Kräfte.",
    facts: [
      "Mistys Enton fing sich versehentlich selbst, indem es auf einen von Mistys Pokébällen tappte!",
      "Es leidet unter chronischen Kopfschmerzen. Werden diese Kopfschmerzen unerträglich, setzt es verheerende Psycho-Kräfte wie Konfusion frei.",
      "Obwohl es ein Wasser-Pokémon ist, kann Mistys Enton überhaupt nicht schwimmen und trägt oft Schwimmflügel."
    ]
  },
  "Togepi": {
    category: "Stachelball-Pokémon",
    types: ["Fee"],
    description: "Sein Panzer scheint voller Glücksenergie zu sein. Wenn man es liebevoll und fürsorglich behandelt, bringt es seinem Trainer grenzenloses Glück.",
    facts: [
      "Ash fand das Ei in den Grampa-Canyons, aber als es schlüpfte, sah Togepi als erstes Misty und hielt sie fortan für seine Mutter!",
      "Sein Ei schüttet Glücksenergie aus, wenn es von liebevollen Menschen umsorgt wird.",
      "Ohne dass jemand es bemerkte, rettete Togepis geheimer 'Metronom'-Angriff die Gruppe dutzende Male aus höchster Gefahr."
    ]
  },
  "Ho-Oh": {
    category: "Regenbogen-Pokémon",
    types: ["Feuer", "Flug"],
    description: "Ein legendäres Pokémon, dessen Flügel in allen sieben Farben des Regenbogens leuchten. Eine alte Legende besagt, dass jeder, der es erblickt, ewiges Glück erfährt.",
    facts: [
      "Ho-Oh erschien Ash am Ende von Folge 1 am Regenbogenhimmel – lange bevor die 2. Generation (Gold & Silber) überhaupt offiziell enthüllt wurde!",
      "Legenden besagen, dass diejenigen, die Ho-Oh am Himmel erblicken, ewiges Glück auf ihrer Reise erfahren werden."
    ]
  },
  "Piepi": {
    category: "Fee-Pokémon",
    types: ["Fee"],
    description: "Mit seinen kleinen Flügeln kann es im Mondlicht schweben. Es soll der Sage nach mit einem Meteoriten aus den Weiten des Weltalls auf die Erde gelangt sein.",
    facts: [
      "Piepi soll ursprünglich aus dem Weltall mit einem Meteoriten zur Erde gereist sein.",
      "Ursprünglich war Piepi als Haupt-Maskottchen für das gesamte Pokémon-Franchise geplant, bevor sich die Schöpfer für Pikachu entschieden."
    ]
  },
  "Gengar": {
    category: "Schatten-Pokémon",
    types: ["Geist", "Gift"],
    description: "Es verbirgt sich im Schatten von Menschen und Pokémon. Wenn die Zimmertemperatur plötzlich um mehrere Grad sinkt, ist ein Gengar ganz nah.",
    facts: [
      "Gengar versteckt sich in den Schatten seiner Opfer. Fällt die Raumtemperatur plötzlich um 5 Grad, ist ein Gengar ganz in deiner Nähe!",
      "Ash freundete sich im Pokémon-Turm von Lavandia mit einem verspielten Alpollo an, um Sabrina in der Saffronia-City Arena zu besiegen."
    ]
  },
  "Evoli": {
    category: "Evolutions-Pokémon",
    types: ["Normal"],
    description: "Aufgrund seiner instabilen genetischen Beschaffenheit besitzt es die einzigartige Fähigkeit, sich in acht völlig verschiedene Typen zu verwandeln.",
    facts: [
      "Evoli hat eine instabile genetische Struktur und kann sich in sage und schreibe 8 verschiedene Pokémon-Typen entwickeln!",
      "Gary Eich, Ashs ewiger Rivale, besaß ein starkes Evoli, das später zu einem mächtigen Nachtara wurde."
    ]
  },
  "Relaxo": {
    category: "Tagträumer-Pokémon",
    types: ["Normal"],
    description: "Es ist erst zufrieden, wenn es täglich hunderte Kilogramm Nahrung gefressen hat. Danach schläft es tief und fest, selbst mitten auf belebten Straßen.",
    facts: [
      "Relaxo frisst täglich über 400 Kilogramm Nahrung und schläft fast den gesamten restlichen Tag.",
      "Sein Magen ist so widerstandsfähig, dass selbst verdorbene Beeren oder tödliches Gift ihm überhaupt nichts anhaben können."
    ]
  },
  "Mewtu": {
    category: "Genmutant-Pokémon",
    types: ["Psycho"],
    description: "Dieses Pokémon wurde durch genetische Rekombination der DNA von Mew im Labor erschaffen. Seine übermenschlichen Psychokräfte sind unübertroffen.",
    facts: [
      "Mewtu wurde durch künstliches Klonen der DNA des Ur-Pokémon Mew von Wissenschaftlern auf der Zinnoberinsel erschaffen.",
      "Es ist der legendäre Hauptcharakter des allerersten Pokémon-Kinofilms ('Mewtu schlägt zurück')."
    ]
  },
  "Lugia": {
    category: "Tauch-Pokémon",
    types: ["Psycho", "Flug"],
    description: "Der Hüter der Meere schläft in der Tiefe des Ozeans. Ein einziger Schlag seiner mächtigen Schwingen kann Stürme entfesseln, die über einen Monat anhalten.",
    facts: [
      "Lugia ist der Wächter der Meere und der Anführer des legendären Vogel-Trios Arktos, Zapdos und Lavados.",
      "Schlägt es mit seinen riesigen Schwingen, kann es Stürme entfesseln, die 40 Tage lang andauern."
    ]
  },
  "Karnimani": {
    category: "Großmaul-Pokémon",
    types: ["Wasser"],
    description: "Obwohl sein Körper klein ist, verfügt es über gewaltige Beißkraft. Es neigt dazu, aus purer Spielfreude in alles hineinzubeißen, was sich bewegt.",
    facts: [
      "Ashs Karnimani ist extrem energiegeladen und liebt es, fröhlich zu tanzen, bevor es mit seinen kräftigen Zähnen zubeißt.",
      "Ash und Misty warfen gleichzeitig einen Köderball auf Karnimani und mussten ein Duell austragen, wer es behalten durfte – Ash gewann!"
    ]
  },
  "Geckarbor": {
    category: "Waldgecko-Pokémon",
    types: ["Pflanze"],
    description: "Mit mikroskopischen Häkchen an den Sohlen erklimmt es glatte Wände. Es bewahrt stets die Ruhe und lässt sich selbst in brenzligen Kämpfen nicht aus der Fassung bringen.",
    facts: [
      "Geckarbor hat kleine Häkchen an den Fußsohlen, mit denen es selbst senkrechte Wände und Decken mühelos hinauflaufen kann.",
      "Ashs Geckarbor in der Hoenn-Region war extrem cool und hatte immer einen kleinen Zweig lässig im Mundwinkel."
    ]
  },
  "Plinfa": {
    category: "Pinguin-Pokémon",
    types: ["Wasser"],
    description: "Es ist ein überaus stolzes Pokémon, das die Hilfe fremder Menschen verabscheut. Auf glattem Eis gleitet es mühelos auf seinem dicken Bauch.",
    facts: [
      "Plinfa ist sehr stolz und hasst es, von Trainern bevormundet oder gefüttert zu werden.",
      "Es ist Lucias Partner-Pokémon in Staffel 10 (Diamond & Pearl) und stürzt sich mutig in jeden Wettbewerbskampf!"
    ]
  },
  "Pachirisu": {
    category: "Elektrohörnchen-Pokémon",
    types: ["Elektro"],
    description: "Es speichert Elektrizität in seinen blauen Wangentaschen und gibt statische Schläge über seinen flauschigen Schweif ab.",
    facts: [
      "Pachirisu speichert Elektrizität in seinen blauen Wangentaschen und gibt statische Schläge über seinen flauschigen Schweif ab.",
      "Lucia fing Pachirisu in Staffel 10 Folge 19. Es war so wild und verspielt, dass sie es fast wieder freiließ, bevor sie ein unzertrennliches Team wurden."
    ]
  },
  "Driftlon": {
    category: "Ballon-Pokémon",
    types: ["Geist", "Flug"],
    description: "Es treibt ziellos mit dem Wind umher. Es liebt es, Kinder an der Hand zu nehmen, wird aber wegen seines leichten Gewichts oft selbst mitgezogen.",
    facts: [
      "Driftlon entsteht aus den Seelen von Menschen und Pokémon. Es treibt ziellos durch den Wind und liebt es, an Händen zu ziehen.",
      "In Staffel 10 Folge 28 rettet Ash Kinder vor einem aufziehenden Gewittersturm zusammen mit Driftlon!"
    ]
  }
};

/**
 * Get fact details or fallback intelligently for any of the 189 Pokemon
 */
export function getPokemonFactInfo(pokemonName: string): PokemonFactInfo {
  const clean = pokemonName.trim();
  if (POKEMON_FACTS_DATABASE[clean]) {
    return POKEMON_FACTS_DATABASE[clean];
  }

  // Smart fallback
  return {
    category: "Reise-Pokémon",
    types: ["Pokémon"],
    description: `${clean} ist ein faszinierendes Pokémon, das Ash, Misty und ihre Freunde während ihrer legendären Reisen durch Kanto, Johto, Hoenn und Sinnoh angetroffen haben.`,
    facts: [
      `${clean} gehört zu den 189 handverlesenen Pokémon, die in den 423 Folgen der YouTube-Playlist wichtige Rollen und Kämpfe bestreiten!`,
      `Tritt in den Episoden der Serie als verlässlicher Partner, geschätzter Freund oder spannender Herausforderer auf.`
    ]
  };
}

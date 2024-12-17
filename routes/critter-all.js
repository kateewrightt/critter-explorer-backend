import express from "express";
import axios from "axios";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const NOOK_API_URL = "https://api.nookipedia.com";
const NOOK_API_KEY = process.env.NOOK_API_KEY;

const CACHE_FILE = path.join(__dirname, "../public/json/allCrittersCache.json");

let inMemoryCache = null;

const bugOrder = [
  "Common butterfly",
  "Yellow butterfly",
  "Tiger butterfly",
  "Peacock butterfly",
  "Common bluebottle",
  "Paper kite butterfly",
  "Great purple emperor",
  "Monarch butterfly",
  "Emperor butterfly",
  "Agrias butterfly",
  "Rajah Brooke's birdwing",
  "Queen Alexandra's birdwing",
  "Moth",
  "Atlas moth",
  "Madagascan sunset moth",
  "Long locust",
  "Migratory locust",
  "Rice grasshopper",
  "Grasshopper",
  "Cricket",
  "Bell cricket",
  "Mantis",
  "Orchid mantis",
  "Honeybee",
  "Wasp",
  "Brown cicada",
  "Robust cicada",
  "Giant cicada",
  "Walker cicada",
  "Evening cicada",
  "Cicada shell",
  "Red dragonfly",
  "Darner dragonfly",
  "Banded dragonfly",
  "Damselfly",
  "Firefly",
  "Mole cricket",
  "Pondskater",
  "Diving beetle",
  "Giant water bug",
  "Stinkbug",
  "Man-faced stink bug",
  "Ladybug",
  "Tiger beetle",
  "Jewel Beetle",
  "Violin Beetle",
  "Citrus long-horned beetle",
  "Rosalia Batesi Beetle",
  "Blue weevil beetle",
  "Dung beetle",
  "Earth-boring dung beetle",
  "Scarab Beetle",
  "Drone beetle",
  "Goliath Beetle",
  "Saw Stag",
  "Miyama Stag",
  "Giant stag",
  "Rainbow Stag",
  "Cyclommatus stag",
  "Golden Stag",
  "Giraffe Stag",
  "Horned dynastid",
  "Horned atlas",
  "Horned elephant",
  "Horned hercules",
  "Walking stick",
  "Walking leaf",
  "Bagworm",
  "Ant",
  "Hermit crab",
  "Wharf roach",
  "Fly",
  "Mosquito",
  "Flea",
  "Snail",
  "Pill Bug",
  "Centipede",
  "Spider",
  "Tarantula",
  "Scorpion"
]

const fishOrder = [
  "Bitterling",
  "Pale chub",
  "Crucian carp",
  "Dace",
  "Carp",
  "Koi",
  "Goldfish",
  "Pop-eyed goldfish",
  "Ranchu goldfish",
  "Killifish",
  "Crawfish",
  "Soft-shelled turtle",
  "Snapping turtle",
  "Tadpole",
  "Frog",
  "Freshwater goby",
  "Loach",
  "Catfish",
  "Giant snakehead",
  "Bluegill",
  "Yellow perch",
  "Black bass",
  "Tilapia",
  "Pike",
  "Pond smelt",
  "Sweetfish",
  "Cherry salmon",
  "Char",
  "Golden trout",
  "Stringfish",
  "Salmon",
  "King salmon",
  "Mitten crab",
  "Guppy",
  "Nibble fish",
  "Angelfish",
  "Betta",
  "Neon tetra",
  "Rainbowfish",
  "Piranha",
  "Arowana",
  "Dorado",
  "Gar",
  "Arapaima",
  "Saddled bichir",
  "Sturgeon",
  "Sea butterfly",
  "Sea horse",
  "Clown fish",
  "Surgeonfish",
  "Butterfly fish",
  "Napoleonfish",
  "Zebra turkeyfish",
  "Blowfish",
  "Puffer fish",
  "Anchovy",
  "Horse mackerel",
  "Barred knifejaw",
  "Sea bass",
  "Red snapper",
  "Dab",
  "Olive flounder",
  "Squid",
  "Moray eel",
  "Ribbon eel",
  "Tuna",
  "Blue marlin",
  "Giant trevally",
  "Mahi-mahi",
  "Ocean sunfish",
  "Ray",
  "Saw shark",
  "Hammerhead shark",
  "Great white shark",
  "Whale shark",
  "Suckerfish",
  "Football fish",
  "Oarfish",
  "Barreleye",
  "Coelacanth"
]

const seaCreatureOrder = [
  "Seaweed",
  "Sea grapes",
  "Sea cucumber",
  "Sea pig",
  "Sea star",
  "Sea urchin",
  "Slate pencil urchin",
  "Sea anemone",
  "Moon jellyfish",
  "Sea slug",
  "Pearl oyster",
  "Mussel",
  "Oyster",
  "Scallop",
  "Whelk",
  "Turban shell",
  "Abalone",
  "Gigas giant clam",
  "Chambered nautilus",
  "Octopus",
  "Umbrella octopus",
  "Vampire squid",
  "Firefly squid",
  "Gazami crab",
  "Dungeness crab",
  "Snow crab",
  "Red king crab",
  "Acorn barnacle",
  "Spider crab",
  "Tiger prawn",
  "Sweet shrimp",
  "Mantis shrimp",
  "Spiny lobster",
  "Lobster",
  "Giant isopod",
  "Horseshoe crab",
  "Sea pineapple",
  "Spotted garden eel",
  "Flatworm",
  "Venus' flower basket"
]

/**
 * Ensure that the public/json directory exists
 */
const ensureJsonFolderExists = async () => {
  try {
    const dir = path.dirname(CACHE_FILE);
    await fs.mkdir(dir, { recursive: true });
    console.log("JSON folder ensured at:", dir);
  } catch (error) {
    console.error("Error ensuring JSON folder exists:", error);
    throw new Error("Failed to create cache directory.");
  }
};

/**
 * Transform the critter data to the desired format
 */
const transformCritterData = (data, type) => {
  if (!Array.isArray(data)) {
    console.error("Unexpected API response for", type, ":", data);
    return [];
  }

  return data.map((critter) => ({
    name: critter.name,
    image_url: critter.image_url,
    render_url: critter.render_url,
    type,
    north: {
      months_array: critter.north?.months_array || [],
      time: critter.north?.availability_array?.[0]?.time || "Unavailable",
      availability_array: critter.north?.availability_array || [],
    },
    south: {
      months_array: critter.south?.months_array || [],
      time: critter.south?.availability_array?.[0]?.time || "Unavailable",
      availability_array: critter.south?.availability_array || [],
    },
  }));
};

/**
 * Helper function to group and strictly sort critters by type and predefined order
 */
 const groupAndSortCritters = (critters) => {
  const sortByOrderArray = (critterArray, orderArray) => {
    // Normalize the order array for case insensitivity
    const normalizedOrder = orderArray.map((name) => name.toLowerCase().trim());
  
    return critterArray.sort((a, b) => {
      const indexA = normalizedOrder.indexOf(a.name.toLowerCase().trim());
      const indexB = normalizedOrder.indexOf(b.name.toLowerCase().trim());
  
      // Place critters not in the order array at the end
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
  
      return indexA - indexB;
    });  
  };

  const bugs = critters.filter((c) => c.type === "bug");
  const fish = critters.filter((c) => c.type === "fish");
  const seaCreatures = critters.filter((c) => c.type === "sea-creature");

  const sortedBugs = sortByOrderArray(bugs, bugOrder);
  const sortedFish = sortByOrderArray(fish, fishOrder);
  const sortedSeaCreatures = sortByOrderArray(seaCreatures, seaCreatureOrder);

  return [...sortedBugs, ...sortedFish, ...sortedSeaCreatures];
};

/**
 * Fetch critter data from the Nookipedia API
 */
 const fetchCritterData = async () => {
  try {
    const [bugsResponse, fishResponse, seaCreaturesResponse] = await Promise.all([
      axios.get(`${NOOK_API_URL}/nh/bugs`, { headers: { "X-API-KEY": NOOK_API_KEY } }),
      axios.get(`${NOOK_API_URL}/nh/fish`, { headers: { "X-API-KEY": NOOK_API_KEY } }),
      axios.get(`${NOOK_API_URL}/nh/sea`, { headers: { "X-API-KEY": NOOK_API_KEY } }),
    ]);

    const critters = [
      ...transformCritterData(bugsResponse.data, "bug"),
      ...transformCritterData(fishResponse.data, "fish"),
      ...transformCritterData(seaCreaturesResponse.data, "sea-creature"),
    ];

    return groupAndSortCritters(critters);
  } catch (error) {
    console.error("Error fetching critter data:", error.message);
    throw new Error("Failed to fetch critter data.");
  }
};

/**
 * GET route handler for '/all-critters'
 */
router.get("/", async (req, res) => {
  try {
    await ensureJsonFolderExists();

    if (inMemoryCache) {
      console.log("Serving data from in-memory cache.");
      return res.json({ critters: inMemoryCache });
    }

    try {
      const fileContent = await fs.readFile(CACHE_FILE, "utf8");
      const cachedData = JSON.parse(fileContent);
      inMemoryCache = cachedData; // Update the in-memory cache
      console.log("Serving data from cache file.");
      return res.json({ critters: cachedData });
    } catch (fileError) {
      console.log("Cache file not found or invalid. Fetching from API...");
    }

    const critters = await fetchCritterData();

    await fs.writeFile(CACHE_FILE, JSON.stringify(critters, null, 2), "utf8");
    console.log("Cache file written at:", CACHE_FILE);

    inMemoryCache = critters;

    res.json({ critters });
  } catch (error) {
    console.error("Error in /all-critters route:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;

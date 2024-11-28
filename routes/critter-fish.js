const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");

const NOOK_API_URL = "https://api.nookipedia.com";
const NOOK_API_KEY = process.env.NOOK_API_KEY;
const CACHE_FILE = path.resolve(__dirname, "../json/fishCache.json");

const ensureJsonFolderExists = async () => {
  try {
    await fs.mkdir(path.dirname(CACHE_FILE), { recursive: true });
  } catch (error) {
    console.error("Error ensuring JSON folder exists: ", error);
  }
};

router.get("/", async (req, res) => {
  await ensureJsonFolderExists();

  try {
    // Check if cache file exists
    try {
      const fileContent = await fs.readFile(CACHE_FILE, "utf-8");
      return res.json({ critters: JSON.parse(fileContent) });
    } catch {
      console.log("Cache file missing. Fetching from API...");
    }

    // Fetch data from API
    const response = await axios.get(`${NOOK_API_URL}/nh/fish`, {
      headers: { "X-API-KEY": NOOK_API_KEY },
    });

    // Cache the data
    await fs.writeFile(CACHE_FILE, JSON.stringify(response.data));

    // Respond with data
    res.json({ critters: response.data });
  } catch (error) {
    console.error("Error fetching fish data: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

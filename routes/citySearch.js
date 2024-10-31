// In your Express app (e.g., routes/citySearch.js)
const express = require("express");
const router = express.Router();
const axios = require("axios");
const NodeCache = require("node-cache");
const cityCache = new NodeCache({ stdTTL: 600 });

router.get("/", async (req, res) => {
  const GEO_API_URL = "https://wft-geo-db.p.rapidapi.com/v1/geo";
  const GEO_API_KEY = process.env.GEO_API_KEY;

  try {
    const { query } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ error: 'Query parameter "query" is required.' });
    }
    const cacheKey = `city-${query}`;
    const cachedResult = cityCache.get(cacheKey);

    if (cachedResult) {
      return res.json({ options: cachedResult });
    }
    
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Perform a search using the GeoDB Cities API
    const response = await axios.get(`${GEO_API_URL}/cities`, {
      params: {
        minPopulation: 100000,
        namePrefix: query,
      },
      headers: {
        "X-RapidAPI-Key": GEO_API_KEY,
        "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
      },
    });

    const data = response.data.data;

    const formattedData = data.map((city) => ({
      value: `${city.id}`,
      label: `${city.name}, ${city.countryCode}`,
      latitude: `${city.latitude}`,
    }));

    cityCache.set(cacheKey, formattedData);

    res.json({ options: formattedData });
  } catch (error) {
    console.error("Error fetching search results:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

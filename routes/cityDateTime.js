const express = require("express");
const router = express.Router();
const axios = require("axios");
const NodeCache = require("node-cache");
const Bottleneck = require("bottleneck");

// Initialize cache with a 10-minute TTL
const dateTimeCache = new NodeCache({ stdTTL: 600 });

// Initialize rate limiter
const limiter = new Bottleneck({
  maxConcurrent: 1, // Only one request at a time
  minTime: 2000,    // 2 seconds between requests
  debug: true,      // Enable Bottleneck debugging
});

// Set Axios timeout globally
axios.defaults.timeout = 15000; // 15 seconds

// GeoDB API configuration
const GEO_API_URL = "https://wft-geo-db.p.rapidapi.com/v1/geo";
const GEO_API_KEY = process.env.GEO_API_KEY;

// Enhanced fetch function with retry handling and wait logic
const fetchCityDateTimeWithRetry = limiter.wrap(async (cityId, retries = 3) => {
  try {
    console.log(`[INFO] [${new Date().toISOString()}] Fetching date and time for city ID: ${cityId}`);
    const response = await axios.get(`${GEO_API_URL}/places/${cityId}/dateTime`, {
      headers: {
        "X-RapidAPI-Key": GEO_API_KEY,
        "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
      },
    });
    console.log(`[INFO] [${new Date().toISOString()}] Successfully fetched date and time for city ID: ${cityId}`);
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 429 && retries > 0) {
      console.warn(
        `[WARN] [${new Date().toISOString()}] Rate limit hit for city ID: ${cityId}. Retrying in 3 seconds... (${retries} retries left)`
      );
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds
      return fetchCityDateTimeWithRetry(cityId, retries - 1);
    }

    console.error(`[ERROR] [${new Date().toISOString()}] Failed to fetch date and time for city ID: ${cityId}: ${error.message}`);
    throw error;
  }
});

router.get("/:cityId/dateTime", async (req, res) => {
  try {
    const { cityId } = req.params;

    if (!cityId) {
      console.error(`[ERROR] Missing required parameter: "cityId".`);
      return res.status(400).json({ error: 'Parameter "cityId" is required.' });
    }

    const cacheKey = `dateTime-${cityId}`;
    const cachedResult = dateTimeCache.get(cacheKey);

    // Serve from cache if available
    if (cachedResult) {
      console.log(`[INFO] [${new Date().toISOString()}] Cache hit for city ID: ${cityId}`);
      return res.json({ cityDateTime: cachedResult });
    }

    console.log(`[INFO] [${new Date().toISOString()}] No cache found. Fetching date and time for city ID: ${cityId}`);

    // Fetch date and time with retry and rate limit
    const cityDateTime = await fetchCityDateTimeWithRetry(cityId);

    // Cache the response
    dateTimeCache.set(cacheKey, cityDateTime);

    console.log(`[INFO] [${new Date().toISOString()}] Data successfully cached for city ID: ${cityId}`);
    res.json({ cityDateTime });
  } catch (error) {
    console.error(`[ERROR] Error fetching city date and time for city ID: ${req.params.cityId}: ${error.message || error}`);

    // Respond with an error message
    res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const axios = require("axios");
const NodeCache = require("node-cache");
const Bottleneck = require("bottleneck");

// Initialize cache with a 10-minute TTL
const cityCache = new NodeCache({ stdTTL: 600 });

// Initialize rate limiter
const limiter = new Bottleneck({
  maxConcurrent: 1, // Only one request at a time
  minTime: 1000,    // 1 second between requests
  debug: true,      // Enable Bottleneck debugging
});

// Set Axios timeout globally
axios.defaults.timeout = 10000; // 10 seconds

// GeoDB API configuration
const GEO_API_URL = "https://wft-geo-db.p.rapidapi.com/v1/geo";
const GEO_API_KEY = process.env.GEO_API_KEY;

// Enhanced fetch function with retry handling
const fetchCityDataWithRetry = limiter.wrap(async (query, retries = 3) => {
  try {
    console.log(`[INFO] Attempting to fetch data for: ${query}`);
    const response = await axios.get(`${GEO_API_URL}/cities`, {
      params: { minPopulation: 100000, namePrefix: query },
      headers: {
        "X-RapidAPI-Key": GEO_API_KEY,
        "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
      },
    });
    console.log(`[INFO] Successfully fetched data for: ${query}`);
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 429 && retries > 0) {
      console.warn(
        `[WARN] Rate limit hit for ${query}. Retrying in 2 seconds... (${retries} retries left at ${new Date().toISOString()})`
      );
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
      return fetchCityDataWithRetry(query, retries - 1);
    }

    // Log final failure after all retries
    if (retries === 0) {
      console.error(`[ERROR] Out of retries for ${query}.`);
      throw new Error(`Rate limit exceeded for ${query}`);
    }

    console.error(`[ERROR] Failed to fetch data for ${query}: ${error.message}`);
    throw error;
  }
});


router.get("/", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      console.error(`[ERROR] Missing required query parameter: "query".`);
      return res
        .status(400)
        .json({ error: 'Query parameter "query" is required.' });
    }

    const cacheKey = `city-${query.toLowerCase()}`;
    const cachedResult = cityCache.get(cacheKey);

    // Serve from cache if available
    if (cachedResult) {
      console.log(`[INFO] Cache hit for query: ${query}`);
      return res.json({ options: cachedResult });
    }

    console.log(`[INFO] No cache found. Fetching data for: ${query}`);

    // Fetch data with retry and rate limit
    const data = await fetchCityDataWithRetry(query);

    // Format the response data
    const formattedData = data.map((city) => ({
      value: `${city.id}`,
      label: `${city.name}, ${city.countryCode}`,
      latitude: `${city.latitude}`,
    }));

    // Cache the formatted response
    cityCache.set(cacheKey, formattedData);

    console.log(`[INFO] Data successfully cached for query: ${query}`);
    res.json({ options: formattedData });
  } catch (error) {
    console.error(`[ERROR] Error fetching search results for ${req.query.query}:`, error.message || error);

    // Respond with an error message after retries are exhausted
    res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
});


module.exports = router;

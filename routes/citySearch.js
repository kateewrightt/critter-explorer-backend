const express = require("express");
const router = express.Router();
const axios = require("axios");
const NodeCache = require("node-cache");
const Bottleneck = require("bottleneck");

// Initialize cache with a 10-minute TTL
const cityCache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

// Initialize rate limiter
const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 2000,
  reservoir: 5,      // Allow up to 5 requests in quick succession
  reservoirRefreshAmount: 5, 
  reservoirRefreshInterval: 10000, // Refill every 10 seconds
});

// Set Axios timeout globally
axios.defaults.timeout = 15000; // 15 seconds

// GeoDB API configuration
const GEO_API_URL = "https://wft-geo-db.p.rapidapi.com/v1/geo";
const GEO_API_KEY = process.env.GEO_API_KEY;

// Enhanced fetch function with detailed retry handling
const fetchCityDataWithRetry = limiter.wrap(async (query, retries = 3) => {
  try {
    console.log(`[INFO] [${new Date().toISOString()}] Fetching data for: ${query}`);
    const response = await axios.get(`${GEO_API_URL}/cities`, {
      params: { minPopulation: 100000, namePrefix: query },
      headers: {
        "X-RapidAPI-Key": GEO_API_KEY,
        "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
      },
    });
    console.log(`[INFO] [${new Date().toISOString()}] Successfully fetched data for: ${query}`);
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 429 && retries > 0) {
      console.warn(
        `[WARN] [${new Date().toISOString()}] Rate limit hit for ${query}. Retrying in 2 seconds... (${retries} retries left)`
      );
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
      return fetchCityDataWithRetry(query, retries - 1); // Retry
    }

    // Log final failure after all retries
    if (retries === 0) {
      console.error(`[ERROR] [${new Date().toISOString()}] Out of retries for ${query}.`);
      throw new Error(`Rate limit exceeded for ${query}`);
    }

    console.error(`[ERROR] [${new Date().toISOString()}] Failed to fetch data for ${query}: ${error.message}`);
    throw error; // Pass the error to the caller
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
      console.log(`[INFO] [${new Date().toISOString()}] Cache hit for query: ${query}`);
      return res.json({ options: cachedResult });
    }

    console.log(`[INFO] [${new Date().toISOString()}] No cache found. Fetching data for: ${query}`);
    console.log(`[DEBUG] Queue size before request: ${limiter.queued()}`);

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

    console.log(`[INFO] [${new Date().toISOString()}] Data successfully cached for query: ${query}`);
    res.json({ options: formattedData });
  } catch (error) {
    console.error(`[ERROR] [${new Date().toISOString()}] Error fetching search results for ${req.query.query}:`, error.message || error);

    // Respond with an error message after retries are exhausted
    res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
});

// Monitor Bottleneck events
limiter.on("queued", () => {
  console.log(`[DEBUG] [${new Date().toISOString()}] A job has been queued. Current queue size: ${limiter.queued()}`);
});

limiter.on("executing", (jobInfo) => {
  console.log(`[DEBUG] [${new Date().toISOString()}] Executing job with ID: ${jobInfo.id}`);
});

limiter.on("failed", (error, jobInfo) => {
  console.error(`[ERROR] [${new Date().toISOString()}] Job with ID: ${jobInfo.id} failed: ${error.message}`);
});

module.exports = router;

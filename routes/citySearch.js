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
  minTime: 2000,    // 2 seconds between requests
  debug: true,      // Enable Bottleneck debugging
});

// Set Axios timeout globally
axios.defaults.timeout = 15000; // 15 seconds

// GeoDB API configuration
const GEO_API_URL = "https://wft-geo-db.p.rapidapi.com/v1/geo";
const GEO_API_KEY = process.env.GEO_API_KEY;

// Enhanced fetch function with retry handling and better wait time
const fetchCityDataWithRetry = limiter.wrap(async (query, retries = 3, controller) => {
  try {
    console.log(`[INFO] [${new Date().toISOString()}] Fetching data for: ${query}`);
    const response = await axios.get(`${GEO_API_URL}/cities`, {
      params: { minPopulation: 100000, namePrefix: query },
      headers: {
        "X-RapidAPI-Key": GEO_API_KEY,
        "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
      },
      signal: controller.signal, // Support for request cancellation
    });
    console.log(`[INFO] [${new Date().toISOString()}] Successfully fetched data for: ${query}`);
    return response.data.data;
  } catch (error) {
    if (error.name === "AbortError") {
      console.warn(`[WARN] Request for ${query} was aborted.`);
      return [];
    }

    if (error.response?.status === 429 && retries > 0) {
      console.warn(
        `[WARN] [${new Date().toISOString()}] Rate limit hit for ${query}. Retrying in 3 seconds... (${retries} retries left)`
      );
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds
      return fetchCityDataWithRetry(query, retries - 1, controller);
    }

    console.error(`[ERROR] [${new Date().toISOString()}] Failed to fetch data for ${query}: ${error.message}`);
    throw error;
  }
});

router.get("/", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      console.error(`[ERROR] Missing required query parameter: "query".`);
      return res.status(400).json({ error: 'Query parameter "query" is required.' });
    }

    const cacheKey = `city-${query.toLowerCase()}`;
    const cachedResult = cityCache.get(cacheKey);

    // Serve from cache if available
    if (cachedResult) {
      console.log(`[INFO] [${new Date().toISOString()}] Cache hit for query: ${query}`);
      return res.json({ options: cachedResult });
    }

    console.log(`[INFO] [${new Date().toISOString()}] No cache found. Fetching data for: ${query}`);

    // Create an AbortController for the request
    const controller = new AbortController();

    // Fetch data with retry, rate limit, and cancellation support
    const data = await fetchCityDataWithRetry(query, 3, controller);

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
    if (error.name === "AbortError") {
      console.warn(`[WARN] [${new Date().toISOString()}] Request aborted by client.`);
      return res.status(499).json({ error: "Client closed request." }); // HTTP 499: Client Closed Request
    }

    console.error(`[ERROR] Error fetching search results for ${req.query.query}: ${error.message || error}`);

    // Respond with an error message
    res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const axios = require("axios");
const NodeCache = require("node-cache");

// Initialize cache with a 10-minute TTL
const cityCache = new NodeCache({ stdTTL: 600 });

// GeoDB API configuration
const GEO_API_URL = "https://wft-geo-db.p.rapidapi.com/v1/geo";
const GEO_API_KEY = process.env.GEO_API_KEY;

// Set Axios timeout globally
axios.defaults.timeout = 10000; // Shorten timeout to 10 seconds

/**
 * Fetch city data with retry logic and exponential backoff.
 * @param {string} query - The city name to search for.
 * @param {number} retries - Number of retries allowed.
 * @returns {Promise<Array>} - City data array.
 */
const fetchCityDataWithRetry = async (query, retries = 3) => {
  try {
    console.log(`[INFO] Fetching data for: ${query}`);
    const response = await axios.get(`${GEO_API_URL}/cities`, {
      params: { minPopulation: 100000, namePrefix: query },
      headers: {
        "X-RapidAPI-Key": GEO_API_KEY,
        "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
      },
    });
    console.log(`[INFO] Successfully fetched data for: ${query}`);
    return response.data.data; // Return the city data
  } catch (error) {
    if (error.response?.status === 429 && retries > 0) {
      // Rate limit hit; retry after exponential backoff
      const waitTime = (4 - retries) * 2000; // 2, 4, 6 seconds
      console.warn(`[WARN] Rate limit hit for ${query}. Retrying in ${waitTime / 1000} seconds... (${retries - 1} retries left)`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return fetchCityDataWithRetry(query, retries - 1);
    } else if (error.response) {
      console.error(`[ERROR] API Error: ${error.response.status} ${error.response.statusText}`);
    } else {
      console.error(`[ERROR] Network or other error: ${error.message}`);
    }
    throw error; // Rethrow error after retries
  }
};

router.get("/", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      console.error(`[ERROR] Missing required query parameter: "query".`);
      return res.status(400).json({ error: 'Query parameter "query" is required.' });
    }

    const cacheKey = `city-${query.toLowerCase().trim()}`;
    const cachedResult = cityCache.get(cacheKey);

    // Serve from cache if available
    if (cachedResult) {
      console.log(`[INFO] Cache hit for query: ${query}`);
      return res.json({ options: cachedResult });
    }

    console.log(`[INFO] No cache found. Fetching data for: ${query}`);

    // Fetch data with retry logic
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
    console.error(`[ERROR] Error fetching search results for ${req.query.query}: ${error.message || error}`);
    res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
});

module.exports = router;

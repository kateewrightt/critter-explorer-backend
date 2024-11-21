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
});

// Set Axios timeout globally
axios.defaults.timeout = 10000; // 10 seconds

// GeoDB API configuration
const GEO_API_URL = "https://wft-geo-db.p.rapidapi.com/v1/geo";
const GEO_API_KEY = process.env.GEO_API_KEY;

// Rate-limited version of the GeoDB API request with retry logic
const fetchCityDataWithRetry = limiter.wrap(async (query, retries = 3) => {
  try {
    console.log(`Attempting to fetch data for: ${query}`);
    const response = await axios.get(`${GEO_API_URL}/cities`, {
      params: { minPopulation: 100000, namePrefix: query },
      headers: {
        "X-RapidAPI-Key": GEO_API_KEY,
        "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
      },
    });
    console.log(`Data successfully fetched for: ${query}`);
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 429 && retries > 0) {
      console.warn(
        `Rate limit hit for ${query}. Retrying... (${retries} retries left)`
      );
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
      return fetchCityDataWithRetry(query, retries - 1);
    }
    console.error(`Failed to fetch data for ${query}:`, error.message);
    throw error;
  }
});

router.get("/", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ error: 'Query parameter "query" is required.' });
    }

    const cacheKey = `city-${query.toLowerCase()}`;
    const cachedResult = cityCache.get(cacheKey);

    // Serve from cache if available
    if (cachedResult) {
      console.log(`Cache hit for query: ${query}`);
      return res.json({ options: cachedResult });
    }

    console.log(`Fetching data for: ${query}`);

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

    res.json({ options: formattedData });
  } catch (error) {
    console.error("Error fetching search results:", error.message || error);

    // If retries fail, return cached data if available
    const fallbackData = cityCache.get(`city-${query.toLowerCase()}`);
    if (fallbackData) {
      console.warn(`Serving stale cache for ${query} due to repeated failures.`);
      return res.json({ options: fallbackData });
    }

    res.status(500).json({
      error: error.response?.data?.message || "Internal server error",
    });
  }
});

module.exports = router;

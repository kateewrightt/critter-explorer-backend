import express from "express";
import axios from "axios";
import NodeCache from "node-cache";
import Bottleneck from "bottleneck";

const router = express.Router();

// Initialize cache with a 10-minute TTL
const dateTimeCache = new NodeCache({ stdTTL: 600 });

// Rate limiter for datetime requests
const dateTimeLimiter = new Bottleneck({
  maxConcurrent: 1,  // Only one request at a time
  minTime: 200,      // Minimum 200ms delay between requests
  debug: true,
});

// GeoDB API configuration
const GEO_API_URL = "https://wft-geo-db.p.rapidapi.com/v1/geo";
const GEO_API_KEY = process.env.GEO_API_KEY;

// Function to fetch datetime with retry and timeout logic
const fetchDateTime = async (cityId) => {
  let attempts = 0;
  const maxAttempts = 3;  // Max retries
  const retryDelay = (attempt) => 2 ** attempt * 100; // Exponential backoff

  while (attempts < maxAttempts) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout

      const response = await axios.get(`${GEO_API_URL}/places/${cityId}/dateTime`, {
        headers: {
          "X-RapidAPI-Key": GEO_API_KEY,
          "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId); // Clear the timeout if successful
      return response.data.data;
    } catch (error) {
      attempts++;

      if (error.response?.status === 429 && attempts < maxAttempts) {
        console.warn(`[WARN] Rate limit hit. Retrying after ${retryDelay(attempts)}ms...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay(attempts)));
      } else {
        console.error(`[ERROR] Failed to fetch datetime for city ID: ${cityId} - ${error.message}`);
        throw error;
      }
    }
  }

  throw new Error("Exceeded max retry attempts");
};

// Route to fetch datetime for a given city ID
router.get("/:cityId/dateTime", async (req, res) => {
  const { cityId } = req.params;

  if (!cityId) {
    console.error("[ERROR] Missing required parameter: 'cityId'");
    return res.status(400).json({ error: "Parameter 'cityId' is required." });
  }

  const cacheKey = `dateTime-${cityId}`;
  const cachedResult = dateTimeCache.get(cacheKey);

  if (cachedResult) {
    console.log(`[INFO] Cache hit for city ID: ${cityId}`);
    return res.json({ cityDateTime: cachedResult, isFallback: false });
  }

  console.log(`[INFO] No cache found. Fetching datetime for city ID: ${cityId}`);

  try {
    // Use rate limiter to schedule the request
    const cityDateTime = await dateTimeLimiter.schedule(() => fetchDateTime(cityId));

    // Cache the fetched datetime
    dateTimeCache.set(cacheKey, cityDateTime);
    console.log(`[INFO] Successfully cached datetime for city ID: ${cityId}`);

    res.json({ cityDateTime, isFallback: false });
  } catch (error) {
    // Serve fallback datetime in case of failure
    const fallbackDateTime = new Date().toISOString();
    console.warn(`[WARN] Returning fallback datetime for city ID: ${cityId}`);
    res.status(200).json({
      cityDateTime: fallbackDateTime,
      isFallback: true,
    });
  }
});

export default router;
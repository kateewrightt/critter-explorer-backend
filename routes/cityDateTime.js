// In your Express app (e.g., routes/cityDateTime.js)
const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/:cityId/dateTime", async (req, res) => {
  const GEO_API_URL = "https://wft-geo-db.p.rapidapi.com/v1/geo";
  const GEO_API_KEY = process.env.GEO_API_KEY;
  try {
    const { cityId } = req.params;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Make a GET request to the GeoDB API to fetch city date and time
    const response = await axios.get(
      `${GEO_API_URL}/places/${cityId}/dateTime`,
      {
        headers: {
          "X-RapidAPI-Key": GEO_API_KEY,
          "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
        },
      }
    );
    if (response.status === 200) {
      const cityDateTime = response.data.data;
      res.json({ cityDateTime });
    } else {
      res.status(response.status).json({ error: response.data.message });
    }
  } catch (error) {
    console.error(
      "Error fetching city date and time:",
      error.response.status,
      error.response.data.message
    );
    res
      .status(error.response.status || 500)
      .json({ error: "Internal server error" });
  }
});

module.exports = router;

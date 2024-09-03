const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  const NOOK_API_URL = "https://api.nookipedia.com";
  const NOOK_API_KEY = process.env.NOOK_API_KEY;
  try {
    // Fetch critter data from the Nookipedia API
    const response = await axios.get(`${NOOK_API_URL}/nh/bugs`, {
      headers: {
        "X-API-KEY": NOOK_API_KEY,
      },
    });
    const critters = response.data;

    res.json({ critters });
  } catch (error) {
    console.error("Error fetching critter data: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

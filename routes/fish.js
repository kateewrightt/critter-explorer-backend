// critters/fish.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  const NOOK_API_URL = "https://api.nookipedia.com";
  const NOOK_API_KEY = process.env.NOOK_API_KEY;
  try {
    const response = await axios.get(`${NOOK_API_URL}/nh/fish`, {
      headers: { "X-API-KEY": NOOK_API_KEY },
    });
    res.json({ critters: response.data });
  } catch (error) {
    console.error("Error fetching fish data: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const FLICKR_API_KEY = process.env.FLICKR_API_KEY;

  try {
    const { critterName } = req.query;

    if (!critterName) {
      return res.status(400).json({ error: "critterName query parameter is required" });
    }

    const base = "https://api.flickr.com/services/rest/?";
    const query = `&method=flickr.photos.search&api_key=${FLICKR_API_KEY}&tags=${critterName}&per-page=12&format=json&nojsoncallback=1`;
    const sortOrder = "&sort=relevance";
    const apiUrl = base + query + sortOrder;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Flickr API request failed");
    }

    const data = await response.json();

    if (data.photos && data.photos.photo.length > 0) {
      const images = data.photos.photo.slice(0, 12);
      res.json({ images });
    } else {
      throw new Error("No photos found on Flickr");
    }
  } catch (error) {
    console.error("Error fetching Flickr photos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.send("Index Page <3");
});
module.exports = router;

require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const fs = require("fs");

// Import routes
const indexRouter = require("./routes/index"); // Correctly point to your index route
const citySearchRouter = require("./routes/city-search");
const cityDateTimeRouter = require("./routes/city-datetime");
const critterImagesRouter = require("./routes/flickr-gallery");
const bugsRouter = require("./routes/critter-bugs");
const fishRouter = require("./routes/critter-fish");
const seaCreaturesRouter = require("./routes/critter-sea");

const app = express();

// CORS setup
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://critter-explorer.netlify.app',
    'https://critter-explorer-2.netlify.app',
    'https://critter-explorer.com',
    'https://www.critter-explorer.com'
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

// Middleware setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Define routes
app.use("/", indexRouter); // Root route
app.use("/citySearch", citySearchRouter);
app.use("/cityDateTime", cityDateTimeRouter);
app.use("/critterImages", critterImagesRouter);
app.use("/bugs", bugsRouter);
app.use("/fish", fishRouter);
app.use("/sea-creatures", seaCreaturesRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  console.error("Error:", err.message);
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
});

module.exports = app;

import "dotenv/config";
import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import indexRouter from "./routes/index.js";
import citySearchRouter from "./routes/city-search.js";
import cityDateTimeRouter from "./routes/city-datetime.js";
import critterImagesRouter from "./routes/flickr-gallery.js";
import bugsRouter from "./routes/critter-bugs.js";
import fishRouter from "./routes/critter-fish.js";
import seaCreaturesRouter from "./routes/critter-sea.js";

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

export default app;
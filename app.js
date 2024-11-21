require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
var fs = require("fs");

// Create a write stream for logs
const logStream = fs.createWriteStream(path.join(__dirname, "app.log"), { flags: "a" });

var indexRouter = require("./routes/index");
var citySearchRouter = require("./routes/citySearch");
var cityDateTimeRouter = require("./routes/cityDateTime");
var critterImagesRouter = require("./routes/critterImages");
var favicon = require("serve-favicon");

var bugsRouter = require("./routes/bugs");
var fishRouter = require("./routes/fish");
var seaCreaturesRouter = require("./routes/seaCreatures");

var app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://critter-explorer.netlify.app',
    'https://critter-explorer-2.netlify.app'
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

// Serve the favicon
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Middleware to log all requests
app.use((req, res, next) => {
  const logEntry = `${new Date().toISOString()} - ${req.method} ${req.url} - User-Agent: ${req.headers['user-agent']}\n`;
  console.log(logEntry); // Log to console
  logStream.write(logEntry); // Write to app.log
  next();
});

// Routes
app.use("/", indexRouter);
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
  const errorEntry = `${new Date().toISOString()} - ERROR: ${err.message}\nStack Trace: ${err.stack}\n`;
  console.error(errorEntry); // Log to console
  logStream.write(errorEntry); // Write to app.log
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {}
  });
});

// Global error handling for uncaught exceptions
process.on("uncaughtException", (err) => {
  const logEntry = `${new Date().toISOString()} - Uncaught Exception: ${err.message}\nStack Trace: ${err.stack}\n`;
  console.error(logEntry);
  fs.appendFileSync(path.join(__dirname, "app.log"), logEntry);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  const logEntry = `${new Date().toISOString()} - Unhandled Rejection: ${reason}\n`;
  console.error(logEntry);
  fs.appendFileSync(path.join(__dirname, "app.log"), logEntry);
  process.exit(1);
});

module.exports = app;

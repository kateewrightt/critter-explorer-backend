require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
var fs = require("fs");

var indexRouter = require("./routes/index");
var citySearchRouter = require("./routes/citySearch");
var cityDateTimeRouter = require("./routes/cityDateTime");
var critterImagesRouter = require("./routes/critterImages");
var favicon = require("serve-favicon");

var bugsRouter = require("./routes/bugs");
var fishRouter = require("./routes/fish");
var seaCreaturesRouter = require("./routes/seaCreatures");

var app = express();

// Log file paths
const appLogPath = path.join(__dirname, "app.log");
const serverLogPath = path.join(__dirname, "../server.log");

// Create write streams for logs
const appLogStream = fs.createWriteStream(appLogPath, { flags: "a" });

// Serve logs via endpoints
app.get('/logs/app', (req, res) => {
  fs.readFile(appLogPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Unable to read app log.");
    }
    res.type("text/plain").send(data);
  });
});

app.get('/logs/server', (req, res) => {
  fs.readFile(serverLogPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Unable to read server log.");
    }
    res.type("text/plain").send(data);
  });
});

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
  appLogStream.write(logEntry); // Write to app.log
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
  appLogStream.write(errorEntry); // Write to app.log
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {}
  });
});

module.exports = app;

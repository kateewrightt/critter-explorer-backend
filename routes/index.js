const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.send(`

  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Critter Explorer Backend</title>
      <link rel="icon" href="/favicon.ico" type="image/x-icon">
      <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .header {
            text-align: center;
            margin-top: 40px;
        }
        .content-wrapper {
            width: 80%; 
            max-width: 800px; 
            text-align: left; 
        }
        h1 {
            margin: 0;
        }
        p {
            margin: 0;
            margin-top: 10px; 
        }
        h2 {
            margin-top: 30px;
            margin-bottom: 10px;
        }
        section {
            margin-bottom: 20px;
        }
        section .info,
        section ul {
            margin-left: 20px;
        }
        ul {
            padding-left: 20px;
        }
    </style>

  </head>
  <body>
    <div class="header">
        <h1>Critter Explorer Backend - Original 2023</h1>
        <p>Welcome to the Critter Explorer API! Below are the available endpoints and their explanations:</p>
    </div>
    <div class="content-wrapper">
        <section>
            <h2>City Search</h2>
            <div class="info">
                <p><strong>Purpose:</strong> Search for cities by name.</p>
                <p><strong>How to use:</strong> Replace "brisbane" with the name of the city you want to search for.</p>
                <p><strong>Examples:</strong></p>
                <ul>
                    <li><a href="/citysearch?query=brisbane" target="_blank">GET /citysearch?query=brisbane</a></li>
                    <li><a href="/citysearch?query=sydney" target="_blank">GET /citysearch?query=sydney</a></li>
                    <li><a href="/citysearch?query=melbourne" target="_blank">GET /citysearch?query=melbourne</a></li>
                </ul>
            </div>
        </section>

        <section>
            <h2>City Date and Time</h2>
            <div class="info">
                <p><strong>Purpose:</strong> Fetch the current date and time for a specific city using its unique <code>cityId</code>.</p>
                <p><strong>How to use:</strong> Use the city's <code>cityId</code>, which can be retrieved using the City Search endpoint.</p>
                <p><strong>Examples:</strong></p>
                <ul>
                    <li><a href="/cityDateTime/5499/dateTime" target="_blank">GET /cityDateTime/5499/dateTime</a> (Brisbane)</li>
                    <li><a href="/cityDateTime/4935/dateTime" target="_blank">GET /cityDateTime/4935/dateTime</a> (Sydney)</li>
                    <li><a href="/cityDateTime/4970/dateTime" target="_blank">GET /cityDateTime/4970/dateTime</a> (Melbourne)</li>
                </ul>
            </div>
        </section>

        <section>
            <h2>Critter Data</h2>
            <div class="info">
                <p><strong>Purpose:</strong> Retrieve lists of available bugs in Animal Crossing.</p>
                <p><strong>How to use:</strong> Use the following endpoint to get data for bugs:</p>
                <p><strong>Examples:</strong></p>
                <ul>
                    <li><a href="/crittergrid" target="_blank">GET /crittergrid</a> - Get all bugs.</li>
                </ul>
            </div>
        </section>

        <section>
          <h2>Flickr Images</h2>
          <div class="info">
              <p><strong>Purpose:</strong> Get real-life images of bugs by their in-game name.</p>
              <p><strong>How to use:</strong> Replace "butterfly" with the name of the bug you want to search for.</p>
              <p><strong>Examples:</strong></p>
              <ul>
                  <li><a href="/critterImages?bugName=butterfly" target="_blank">GET /critterImages?bugName=butterfly</a></li>
              </ul>
          </div>
      </section>
    </div>
  </body>
  </html>
  
  `);
});

module.exports = router;

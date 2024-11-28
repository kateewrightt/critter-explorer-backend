// const express = require("express");
// const router = express.Router();
// // const {
// //   ensureBucketExists,
// //   ensureCounterObjectExists,
// //   incrementPageCount,
// // } = require("../aws");

// // ensureBucketExists();

// router.get("/", async (req, res) => {
//   try {
//     // Ensure counter object exists (ensureCounterObjectExists)
//     // await ensureCounterObjectExists();

//     // Retrieve current page count (incrementPageCount) and increment it
//     const updatedCount = await incrementPageCount();

//     // Send the updated page count as a response or render it in your HTML template
//     res.status(200).json({ pageCount: updatedCount }); // Assuming JSON response
//   } catch (error) {
//     // Handle errors
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal Server Error" }); // Example error response
//   }
// });

// module.exports = router;

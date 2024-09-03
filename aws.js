// const AWS = require("aws-sdk");

// // Configure AWS SDK (replace with your own credentials from the AWS console)
// // These credentials expire after approx 6 hours, so you will need to refresh them
// // It is recommended to put these credentials in an env file and use process.env to retrieve them
// // On EC2, you can assign the ec2SSMCab432 IAM role to the instance and the SDK will automatically retrieve the credentials. This will also work from inside a Docker container.
// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   sessionToken: process.env.AWS_SESSION_TOKEN,
//   region: "ap-southeast-2",
// });

// // Create an S3 client
// const s3 = new AWS.S3();

// // Specify the S3 bucket and object key
// const bucketName = "critter3-counter";
// const counterObjectName = "pagecounter.json";

// // Check if the S3 bucket exists, create if it doesn't
// async function ensureBucketExists() {
//   try {
//     await s3.headBucket({ Bucket: bucketName }).promise();
//   } catch (error) {
//     if (error.statusCode === 404) {
//       await s3.createBucket({ Bucket: bucketName }).promise();
//     }
//   }
// }

// // Check if the counter object exists, create if it doesn't
// async function ensureCounterObjectExists() {
//   try {
//     await s3
//       .headObject({ Bucket: bucketName, Key: counterObjectName })
//       .promise();
//   } catch (error) {
//     if (error.statusCode === 404) {
//       // Create the initial counter object with zero count
//       const initialCounter = { count: 0 };
//       await s3
//         .putObject({
//           Bucket: bucketName,
//           Key: counterObjectName,
//           Body: JSON.stringify(initialCounter),
//           ContentType: "application/json",
//         })
//         .promise();
//     }
//   }
// }

// // Increment page count and return the updated count
// async function incrementPageCount() {
//   try {
//     // Retrieve the current counter object
//     const response = await s3
//       .getObject({ Bucket: bucketName, Key: counterObjectName })
//       .promise();
//     const currentCounter = JSON.parse(response.Body.toString("utf-8"));

//     // Increment the count
//     currentCounter.count += 1;

//     // Upload the updated counter object
//     await s3
//       .putObject({
//         Bucket: bucketName,
//         Key: counterObjectName,
//         Body: JSON.stringify(currentCounter),
//         ContentType: "application/json",
//       })
//       .promise();

//     return currentCounter.count; // Return the updated count
//   } catch (error) {
//     console.error("Error updating page count:", error);
//     throw error;
//   }
// }

// module.exports = {
//   ensureBucketExists,
//   ensureCounterObjectExists,
//   incrementPageCount,
// };

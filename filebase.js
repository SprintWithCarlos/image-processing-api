const AWS = require("aws-sdk");
const dotenv = require("dotenv");
dotenv.config();
const AWSCredentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secret: process.env.AWS_SECRET_ACCESS_KEY,
  bucketName: "devchallenges",
};
const s3 = new AWS.S3({
  accessKeyId: AWSCredentials.accessKeyId,
  secretAccessKey: AWSCredentials.secret,
  endpoint: "https://s3.filebase.com",
  signatureVersion: "v4",
});
module.exports = s3;

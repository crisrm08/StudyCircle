import AWS from "aws-sdk";
import { ENV } from "./env.js";

AWS.config.update({
  accessKeyId: ENV.ACCESS_KEY,
  secretAccessKey: ENV.SECRET_ACCESS_KEY,
  region: ENV.AWS_REGION,
});

export const rekognition = new AWS.Rekognition();

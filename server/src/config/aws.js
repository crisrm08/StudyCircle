import AWS from "aws-sdk";
import { ENV } from "./env.js";

let rekognition = null;

if (ENV.ACCESS_KEY && ENV.SECRET_ACCESS_KEY) {
  AWS.config.update({
    accessKeyId: ENV.ACCESS_KEY,
    secretAccessKey: ENV.SECRET_ACCESS_KEY,
    region: ENV.AWS_REGION,
  });
  rekognition = new AWS.Rekognition();
} else {
  console.warn("[AWS] Rekognition deshabilitado: faltan credenciales");
}

export { rekognition };

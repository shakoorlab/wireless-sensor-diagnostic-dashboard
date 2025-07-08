// READS & VALIDATES ENVIRONMENT VARIABLES

import dotenv from "dotenv";
dotenv.config();

const required = [
  "AUTH_URL",
  "CLIENT_ID",
  "USERNAME",
  "PASSWORD",
  "PHENODE_API_BASE_URL",
  "MONGO_URI",
];

required.forEach((k) => {
  if (!process.env[k]) {
    console.error(`Missing required env var: ${k}`);
    process.exit(1);
  }
});

export default {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || "development",
  keycloak: {
    tokenUrl: process.env.AUTH_URL,
    clientId: process.env.CLIENT_ID,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
  // PheNode upstream data API
  phenodeApiBaseUrl: process.env.PHENODE_API_BASE_URL,

  // MongoDB URI (move this here!)
  mongoUri: process.env.MONGO_URI,
};

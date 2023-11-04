import admin, { ServiceAccount } from "firebase-admin";

require("dotenv").config();

const serviceAccount: ServiceAccount = {
  projectId: process.env.SERVICE_ACCOUNT_PROJECT_ID,
  clientEmail: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
  privateKey:
    process.env.CURRENT_ENVIRONMENT === "production"
      ? process.env.SERVICE_ACCOUNT_PRIVATE_KEY
      : JSON.parse(process.env.SERVICE_ACCOUNT_PRIVATE_KEY || "")?.private_key
};

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const db = admin.firestore();

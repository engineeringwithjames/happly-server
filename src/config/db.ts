import admin, { ServiceAccount } from "firebase-admin";

require("dotenv").config();

const SERVICE_ACCOUNT_PRIVATE_KEY = process.env.SERVICE_ACCOUNT_PRIVATE_KEY
  ? JSON.parse(process.env.SERVICE_ACCOUNT_PRIVATE_KEY)
  : undefined;

const serviceAccount: ServiceAccount = {
  projectId: process.env.SERVICE_ACCOUNT_PROJECT_ID,
  clientEmail: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
  privateKey: SERVICE_ACCOUNT_PRIVATE_KEY.privateKey
};

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const db = admin.firestore();

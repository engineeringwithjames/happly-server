"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
require("dotenv").config();
const serviceAccount = {
    projectId: process.env.SERVICE_ACCOUNT_PROJECT_ID,
    clientEmail: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
    privateKey: process.env.SERVICE_ACCOUNT_PRIVATE_KEY
};
console.log(serviceAccount);
// Initialize Firebase Admin SDK
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount)
});
exports.db = firebase_admin_1.default.firestore();

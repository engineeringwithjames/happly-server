"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
require("dotenv").config();
const serviceAccount = {
    projectId: process.env.SERVICE_ACCOUNT_PROJECT_ID,
    clientEmail: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
    privateKey: process.env.CURRENT_ENVIRONMENT === "production"
        ? process.env.SERVICE_ACCOUNT_PRIVATE_KEY
        : (_a = JSON.parse(process.env.SERVICE_ACCOUNT_PRIVATE_KEY || "")) === null || _a === void 0 ? void 0 : _a.private_key
};
// Initialize Firebase Admin SDK
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount)
});
exports.db = firebase_admin_1.default.firestore();

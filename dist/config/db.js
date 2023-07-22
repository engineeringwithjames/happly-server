"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messaging = exports.db = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const serviceAccount = require("../serviceAccountKey.json");
// Initialize Firebase Admin SDK
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
});
exports.db = firebase_admin_1.default.firestore();
exports.messaging = firebase_admin_1.default.messaging(); // Initialize Firebase Cloud Messaging

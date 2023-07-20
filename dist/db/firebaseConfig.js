"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIREBASE_DB = exports.FIREBASE_APP = void 0;
var app_1 = require("firebase/app");
var firestore_1 = require("firebase/firestore");
var firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};
exports.FIREBASE_APP = (0, app_1.initializeApp)(firebaseConfig);
exports.FIREBASE_DB = (0, firestore_1.getFirestore)(exports.FIREBASE_APP);
// export const FIREBASE_AUTH = getAuth(FIREBASE_APP)

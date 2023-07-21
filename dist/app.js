"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const serviceAccount = require("./serviceAccountKey.json");
const app = (0, express_1.default)();
const port = 8081;
app.use((0, cors_1.default)({
    credentials: true,
}));
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
// Initialize Firebase Admin SDK
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
});
const db = firebase_admin_1.default.firestore();
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRef = db.collection('users');
        const userSnapshot = yield userRef.get();
        const users = [];
        userSnapshot.forEach((doc) => {
            users.push(doc.data());
        });
        // Process the list of users
        console.log("List of users: ", users);
        return users;
    }
    catch (e) {
        console.log(e);
    }
});
// Define a simple route
app.get('/', (req, res) => {
    getAllUsers();
    res.send('Hello, this is your Node.js server with TypeScript!');
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

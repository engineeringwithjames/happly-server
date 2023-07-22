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
const node_cron_1 = __importDefault(require("node-cron"));
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
const getAllReminders = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const remindersRef = db.collection('reminders');
        const remindersSnapshot = yield remindersRef.get();
        if (!remindersSnapshot.empty) {
            console.log('remindersSnapshot', remindersSnapshot);
        }
    }
    catch (e) {
        console.log(e);
    }
});
//
// // Schedule habit notifications using a cron job
// cron.schedule('* * * * *', async () => {
//     // Get the current time
//     const currentTime = new Date();
//
//     // Fetch users with habit notification time matching the current time from your database
//     // (e.g., Firebase Firestore)
//
//     // Iterate over the users and send push notifications
//     users.forEach(async (user) => {
//         // Check if the habit notification time matches the current time
//         if (user.habitNotificationTime === currentTime.toISOString()) {
//             // Send push notification using Firebase Admin SDK
//             const message = {
//                 token: user.pushNotificationToken,
//                 notification: {
//                     title: 'Reminder',
//                     body: 'It is time to carry out your habit!',
//                 },
//             };
//
//             try {
//                 await admin.messaging().send(message);
//             } catch (error) {
//                 console.error('Error sending push notification:', error);
//             }
//         }
//     });
// });
// Cron job to run every hour
node_cron_1.default.schedule('* * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    // cron.schedule('* * * * * *', async () => {
    // getAllReminders()
    console.log('Running a task every hour');
    try {
        // Get the current time in UTC
        const currentTime = new Date().toUTCString();
        console.log('currentTime', currentTime);
        // Fetch reminders for the current hour and minute
        // const querySnapshot = await db
        //     .collection('reminders')
        //     .where('reminderHour', '>=', currentTime.getHours())
        //     .where('reminderMinute', '<', currentTime.getMinutes())
        //     .get();
        //
        // sortedReminders.forEach((reminder) => {
        //     if (reminder.minute === currentTime.getMinutes()) {
        //         // Fetch reminders for the current hour
        //         const querySnapshot = await db
        //             .collection('reminders')
        //             .where('reminderTime', '>=', startOfHour)
        //             .where('reminderTime', '<', endOfHour)
        //             .get();
        //     }
        // })
    }
    catch (error) {
        console.error('Error executing cron job:', error);
    }
}));
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

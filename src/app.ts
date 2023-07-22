import express, {Express, Request, Response } from 'express';
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import compression from "compression";
import admin from "firebase-admin";
import cron from "node-cron";

const serviceAccount = require("./serviceAccountKey.json") ;

const app: Express = express();
const port = 8081;


app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const getAllReminders = async () => {
    try {
        const remindersRef = db.collection('reminders')
        const remindersSnapshot = await remindersRef.get()

        if (!remindersSnapshot.empty) {
            console.log('remindersSnapshot', remindersSnapshot)
        }
    } catch (e) {
        console.log(e)
    }
}

const pushNotification = async (userId: string, habitId: string) => {
    const userRef = db.collection('users').doc(userId)
    const userSnapshot = await userRef.get()

    if (userSnapshot.exists) {
        const userData = userSnapshot.data()

        if (userData) {
            const expoPushToken = userData.expoPushToken

            if (expoPushToken) {
                const habitRef = db.collection('habits').doc(habitId)
                const habitSnapshot = await habitRef.get()

                if (habitSnapshot.exists) {
                    const habitData = habitSnapshot.data()

                    if (habitData) {
                        const habitName = habitData.name

                        const message = {
                            to: expoPushToken,
                            sound: 'default',
                            title: 'Habit Reminder',
                            body: `Don't forget to ${habitName}!`,
                            data: { habitId },
                        }

                        try {
                            await fetch('https://exp.host/--/api/v2/push/send', {
                                method: 'POST',
                                headers: {
                                    Accept: 'application/json',
                                    'Accept-encoding': 'gzip, deflate',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(message),
                            })
                        } catch (e) {
                            console.log(e)
                        }
                    }
                }
            }
        }
    }
}

// Cron job to run every hour
cron.schedule('*/5 * * * * *', async () => {
// cron.schedule('* * * * * *', async () => {
    // getAllReminders()
    console.log('Running a task every hour');

    try {
        // Get the current time in UTC
        const currentTime = new Date();

        // Fetch reminders for the current hour and minute
        const reminderQuerySnapshot = await db
            .collection('reminders')
            .where('reminderHour', '==', currentTime.getUTCHours())
            .where('reminderMinute', '==', currentTime.getUTCMinutes())
            .get();

        if (!reminderQuerySnapshot.empty) {
            reminderQuerySnapshot.forEach((doc) => {
                if (doc.exists) {
                    if (doc.data().isDaily) {
                        console.log('doc.data().isDaily', doc.data().isDaily)
                        pushNotification(doc.data().userId, doc.data().habitId)
                    } else {
                        // get current day of the week in non-UTC
                        const currentDay = currentTime.getDay()
                        if (doc.data().daysOfWeek.includes(currentDay)) {
                            console.log('doc.data().daysOfWeek', doc.data().daysOfWeek)
                            pushNotification(doc.data().userId, doc.data().habitId)
                        }
                    }
                } else {
                    console.log('No such document!')
                }
            })

        } else {
            console.log('querySnapshot is empty')
        }
    } catch (error) {
        console.error('Error executing cron job:', error);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

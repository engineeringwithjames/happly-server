import cron from "node-cron";
import {sendPushNotification} from "../services";
import {db} from "../config";
import {Reminder} from "../types";

export const schedulePushNotification = () => {
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
                        const reminderData = doc.data() as Reminder
                        if (reminderData.isDaily) {
                            console.log('reminderData.isDaily',reminderData.isDaily)
                            sendPushNotification(reminderData.userId, reminderData.habitId)
                        } else {
                            // get current day of the week in non-UTC
                            const currentDay = currentTime.getDay()
                            // if (reminderData.daysOfWeek.includes(currentDay)) {
                            //     console.log('reminderData.daysOfWeek', reminderData.daysOfWeek)
                            //     sendPushNotification(reminderData.userId, reminderData.habitId)
                            // }
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
    })
}

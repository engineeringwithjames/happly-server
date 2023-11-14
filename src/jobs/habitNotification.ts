import { sendHabitNotification } from "../services";
import { db } from "../config";
import { Reminder, User } from "../types";
import moment from "moment";
const momentTz = require("moment-timezone");

export const habitNotification = async () => {
  console.log("habitNotification - Running a task every minute");
  try {
    // Inefficient solution
    const userQuerySnapshot = await db.collection("users").get();

    if (!userQuerySnapshot.empty) {
      userQuerySnapshot.forEach(async (doc) => {
        if (doc.exists) {
          const userData = doc.data() as User;

          if (userData.timezone) {
            const userTimezone = userData.timezone;
            const userCurrentDateTime = momentTz().tz(userTimezone);
            const formattedDateTime = moment(userCurrentDateTime).format("HH:mm");

            const remindersQuerySnapshot = await db
              .collection("reminders")
              .where("userId", "==", userData.id)
              .get();
            if (!remindersQuerySnapshot.empty) {
              remindersQuerySnapshot.forEach(async (doc) => {
                const reminderData = doc.data() as Reminder;
                const currentReminderTime = moment(reminderData.reminder).format("HH:mm");
                const pushToken = userData.pushToken;

                if (pushToken && formattedDateTime === currentReminderTime) {
                  sendHabitNotification(pushToken, reminderData.habitId);
                }
              });
            } else {
              console.log("querySnapshot is empty");
            }
          }
        } else {
          console.log("User does not have timezone!");
        }
      });
    }
  } catch (error) {
    console.error("Error executing cron job:", error);
  }
};

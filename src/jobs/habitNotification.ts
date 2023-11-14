import cron from "node-cron";
import { sendHabitNotification } from "../services";
import { db } from "../config";
import { Reminder, User } from "../types";
import moment from "moment";
const momentTz = require("moment-timezone");

export const habitNotification = async () => {
  // cron.schedule("*/5 * * * * *", async () => {
  console.log("habitNotification - Running a task every minute");
  cron.schedule("* * * * * ", async () => {
    try {
      // Inefficient solution
      const remindersQuerySnapshot = await db.collection("reminders").get();

      if (!remindersQuerySnapshot.empty) {
        remindersQuerySnapshot.forEach(async (doc) => {
          const reminderData = doc.data() as Reminder;
          const currentReminderTime = moment(reminderData.reminder).format("HH:mm");
          const userId = reminderData.userId;
          const userQuerySnapshot = await db.collection("users").where("id", "==", userId).get();
          if (!userQuerySnapshot.empty) {
            const userData = userQuerySnapshot.docs[0].data() as User;
            const userTimezone = userData.timezone;
            const userCurrentDateTime = momentTz().tz(userTimezone);
            const formattedDateTime = moment(userCurrentDateTime).format("HH:mm");
            const pushToken = userData.pushToken;
            if (pushToken && formattedDateTime === currentReminderTime) {
              sendHabitNotification(pushToken, reminderData.habitId);
            }
          }
        });
      } else {
        console.log("querySnapshot is empty");
      }
    } catch (error) {
      console.error("Error executing cron job:", error);
    }
  });
};

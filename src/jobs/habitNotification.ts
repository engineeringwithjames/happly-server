import cron from "node-cron";
import { sendHabitNotification } from "../services";
import { db } from "../config";
import { Reminder } from "../types";
import moment from "moment";

export const habitNotification = () => {
  // cron.schedule("*/5 * * * * *", async () => {
  console.log("habitNotification - Running a task every minute");
  cron.schedule("* * * * * ", async () => {
    try {
      // Get the current time in UTC
      const currentTime = moment.utc().format("HH:mm");

      // Fetch reminders for the current hour and minute
      const reminderQuerySnapshot = await db
        .collection("reminders")
        .where("utcReminderHour", "==", parseInt(currentTime.split(":")[0]))
        .where("utcReminderMinute", "==", parseInt(currentTime.split(":")[1]))
        .get();

      if (!reminderQuerySnapshot.empty) {
        reminderQuerySnapshot.forEach((doc) => {
          if (doc.exists) {
            const reminderData = doc.data() as Reminder;
            if (reminderData.isDaily) {
              sendHabitNotification(reminderData.userId, reminderData.habitId);
            } else {
              const currentDay = moment().format("dddd");
              if (reminderData.daysOfWeek.includes(currentDay)) {
                sendHabitNotification(reminderData.userId, reminderData.habitId);
              }
            }
          } else {
            console.log("No such document!");
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

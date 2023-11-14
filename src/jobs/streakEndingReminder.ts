import { sendStreakEndingReminder } from "../services";
import { db } from "../config";
import { User } from "../types";
const moment = require("moment-timezone");

export const streakEndingReminder = async () => {
  console.log("streakEndingReminder - Running a task every hour");
  try {
    // fetch all users check if they have daily habits and if they do, check if they have completed them if not send a push notification for that user
    const userQuerySnapshot = await db.collection("users").get();
    if (!userQuerySnapshot.empty) {
      userQuerySnapshot.forEach((doc) => {
        if (doc.exists) {
          const userData = doc.data() as User;

          if (userData.timezone) {
            const userTimezone = userData.timezone;
            const userCurrentDateTime = moment().tz(userTimezone);
            const formattedDateTime = userCurrentDateTime.format("HH:mm");

            if (formattedDateTime === "21:00") {
              console.log("send streak ending reminder");
              sendStreakEndingReminder(userData, userCurrentDateTime);
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
};

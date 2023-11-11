import cron from "node-cron";
import { sendStreakVerification } from "../services";
import { db } from "../config";
import { User } from "../types";

const moment = require("moment-timezone");

export const streakVerification = async () => {
  // cron.schedule("* * * * * *", async () => {
  try {
    console.log("streakVerification - Running a task every hour");
    const userQuerySnapshot = await db.collection("users").get();

    if (!userQuerySnapshot.empty) {
      userQuerySnapshot.forEach((doc) => {
        if (doc.exists) {
          const userData = doc.data() as User;

          if (userData.timezone) {
            const userTimezone = userData.timezone;
            const userCurrentDateTime = moment().tz(userTimezone);
            const formattedDateTime = userCurrentDateTime.format("HH:mm");
            console.log("streakVerification - formattedDateTime", formattedDateTime);
            if (formattedDateTime === "00:00") {
              console.log("send streak verification");
              sendStreakVerification(userData.id, userCurrentDateTime);
            }
          }
        } else {
          console.log("No such document!");
        }
      });
    }
  } catch (error) {
    console.error("Error executing cron job:", error);
  }
  // });
};

import cron from "node-cron";
import { sendStreakVerification } from "../services";
import { db } from "../config";
const moment = require("moment-timezone");
import { User } from "../types";

export const streakVerification = () => {
  console.log("Running a task every hour");
  cron.schedule("* * * * * *", async () => {
    try {
      const userQuerySnapshot = await db.collection("users").get();

      if (!userQuerySnapshot.empty) {
        userQuerySnapshot.forEach((doc) => {
          if (doc.exists) {
            const userData = doc.data() as User;

            if (userData.timezone) {
              const userTimezone = userData.timezone;
              const userCurrentDateTime = moment().tz(userTimezone);
              const formattedDateTime = userCurrentDateTime.format("HH:mm:ssA");

              if (formattedDateTime === "00:00:00AM") {
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
  });
};

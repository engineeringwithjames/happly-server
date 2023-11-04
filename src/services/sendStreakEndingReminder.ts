import moment from "moment";
import { db } from "../config";
import { Habit, Streak, User } from "../types";
import { sendPushNotification } from "../utils/sendPushNotification";

export const sendStreakEndingReminder = async (user: User, userCurrentDate: string) => {
  try {
    const habitQuerySnapshot = await db
      .collection("habits")
      .where("userId", "==", user.id)
      .where("frequencyOption", "==", "Daily")
      .get();

    if (!habitQuerySnapshot.empty) {
      habitQuerySnapshot.forEach(async (doc) => {
        if (doc.exists) {
          const habitData = doc.data() as Habit;
          const habitId = habitData.id;

          // Check if last updated of streak is not today
          const streakSnapshot = await db
            .collection("streak")
            .where("habitId", "==", habitData.id)
            .get();

          if (!streakSnapshot.empty) {
            streakSnapshot.forEach((doc) => {
              if (doc.exists) {
                const streakData = doc.data() as Streak;
                if (streakData) {
                  const lastUpdatedDate = moment(streakData.lastUpdated).format("YYYY-MM-DD");
                  const todayDateFromUserCurrentDate = moment(userCurrentDate).format("YYYY-MM-DD");

                  if (lastUpdatedDate !== todayDateFromUserCurrentDate) {
                    // Send a push notification
                    const pushToken = user.pushToken;
                    const title = "Streak Ending Soon 😫";
                    const message = "You have some uncompleted habits!";

                    sendPushNotification(pushToken, title, message, { habitId });
                    return;
                  }
                }
              }
            });
          }
        }
      });
    }
  } catch (error) {
    console.error("Error executing cron job:", error);
  }
};

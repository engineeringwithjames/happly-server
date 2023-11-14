import moment from "moment";
import { db } from "../config";
import { Frequency, Habit, Streak } from "../types";

export const sendStreakVerification = async (userId: string, userCurrentDate: string) => {
  try {
    const streakQuerySnapshot = await db.collection("streak").where("userId", "==", userId).get();
    if (!streakQuerySnapshot.empty) {
      streakQuerySnapshot.forEach(async (doc) => {
        if (doc.exists) {
          const streakData = doc.data() as Streak;
          const lastUpdatedDate = moment(streakData.lastUpdated).format("YYYY-MM-DD");
          const yesterdayDateFromUserCurrentDate = moment(userCurrentDate)
            .subtract(1, "days")
            .format("YYYY-MM-DD");
          const todayDateFromUserCurrentDate = moment(userCurrentDate).format("YYYY-MM-DD");
          console.log("lastUpdatedDate", lastUpdatedDate);
          console.log("yesterdayDateFromUserCurrentDate", lastUpdatedDate);
          console.log("todayDateFromUserCurrentDate", lastUpdatedDate);
          if (lastUpdatedDate === yesterdayDateFromUserCurrentDate) {
            return;
          }

          // THis should never happen because we only do this at 12:00AM the user's time
          if (lastUpdatedDate === todayDateFromUserCurrentDate) {
            return;
          }

          const habitRef = db.collection("habits").doc(streakData.habitId);
          const habitSnapshot = await habitRef.get();

          if (habitSnapshot.exists) {
            const habitData = habitSnapshot.data() as Habit;
            console.log("habitData", habitData.id);
            console.log("habitData", habitData.frequencyOption);
            if (habitData) {
              if (habitData.frequencyOption === Frequency.Daily) {
                await db.collection("streak").doc(streakData.id).update({ count: 0 });
              } else {
                const yesterday = moment(yesterdayDateFromUserCurrentDate).format("DDDD");
                // check if yesterday is part of the selected days to do the habit and if the last updated date is not yesterday
                if (
                  habitData.selectedDays.includes(yesterday) &&
                  lastUpdatedDate !== yesterdayDateFromUserCurrentDate
                ) {
                  await db.collection("streak").doc(streakData.id).update({ count: 0 });
                }
              }
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
};

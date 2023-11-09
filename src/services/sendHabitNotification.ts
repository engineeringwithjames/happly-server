import moment from "moment";
import { db } from "../config";
import { Habit } from "../types";
import { Stats } from "../types/Stats";
import { sendPushNotification } from "../utils/sendPushNotification";

export const sendHabitNotification = async (pushToken: string, habitId: string) => {
  const statQuerySnapshot = await db.collection("stats").where("habitId", "==", habitId).get();

  if (!statQuerySnapshot.empty) {
    statQuerySnapshot.forEach((doc) => {
      const statData = doc.data() as Stats;
      const statDate = statData.completedAt;
      const todayDate = moment.utc().format("ddd MMM DD YYYY");

      if (statDate === todayDate) {
        return;
      }
    });
  }

  const habitRef = db.collection("habits").doc(habitId);
  const habitSnapshot = await habitRef.get();

  if (habitSnapshot.exists) {
    const habitData = habitSnapshot.data() as Habit;

    if (habitData) {
      const habitName = habitData.name;
      const habitId = habitData.id;
      sendPushNotification(pushToken, "Habit Reminder", `Don't forget to ${habitName}!`, {
        habitId
      });
    }
  }
};

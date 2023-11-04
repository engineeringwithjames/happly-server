import { db } from "../config";
import { Habit, User } from "../types";
import { sendPushNotification } from "../utils/sendPushNotification";

export const sendHabitNotification = async (userId: string, habitId: string) => {
  const userQuerySnapshot = await db.collection("users").where("id", "==", userId).get();

  if (!userQuerySnapshot.empty) {
    const userData = userQuerySnapshot.docs[0].data() as User;

    if (userData) {
      const pushToken = userData.pushToken;

      if (pushToken) {
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
      }
    }
  }
};

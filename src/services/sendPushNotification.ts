import { db } from "../config";
import { Habit, User } from "../types";
import Expo, { ExpoPushMessage } from "expo-server-sdk";

export const sendPushNotification = async (userId: string, habitId: string) => {
  const userQuerySnapshot = await db.collection("users").where("id", "==", userId).get();

  if (!userQuerySnapshot.empty) {
    const userData = userQuerySnapshot.docs[0].data() as User;

    if (userData) {
      const pushToken = userData.pushToken;

      if (pushToken) {
        const habitRef = db.collection("habits").doc(habitId);
        const habitSnapshot = await habitRef.get();

        console.log("habitSnapshot - ", habitSnapshot);

        if (habitSnapshot.exists) {
          const habitData = habitSnapshot.data() as Habit;

          if (habitData) {
            const habitName = habitData.name;

            const expoPushMessages: ExpoPushMessage[] = [
              {
                to: pushToken,
                sound: "default",
                title: "Habit Reminder",
                body: `Don't forget to ${habitName}!`,
                data: { habitId }
              }
            ];

            const expo = new Expo();

            try {
              const response = await expo.sendPushNotificationsAsync(expoPushMessages);
              console.log("response - ", response);
            } catch (error) {
              console.error("Error sending push notification:", error);
            }
          }
        }
      }
    }
  }
};

import Expo, { ExpoPushMessage } from "expo-server-sdk";

export const sendPushNotification = async (
  pushToken: string,
  title: string,
  message: string,
  data: any
) => {
  try {
    const expoPushMessages: ExpoPushMessage[] = [
      {
        to: pushToken,
        sound: "default",
        title,
        body: message,
        data
      }
    ];

    const expo = new Expo();

    const response = await expo.sendPushNotificationsAsync(expoPushMessages);
    console.log("response - ", response);
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
};

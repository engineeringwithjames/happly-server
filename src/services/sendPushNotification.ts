import {db, messaging} from "../config";
import {Habit, User} from "../types";
import fetch from 'node-fetch';

export const sendPushNotification = async (userId: string, habitId: string) => {
    const userQuerySnapshot = await db
        .collection('users')
        .where('id', '==', userId)
        .get()

    if (!userQuerySnapshot.empty) {
        const userData = userQuerySnapshot.docs[0].data() as User

        if (userData) {
            const pushToken = userData.pushToken

            if (pushToken) {
                const habitRef = db.collection('habits').doc(habitId)
                const habitSnapshot = await habitRef.get()

                if (habitSnapshot.exists) {
                    const habitData = habitSnapshot.data() as Habit

                    if (habitData) {
                        const habitName = habitData.name

                        const message = {
                            to: pushToken,
                            sound: 'default',
                            title: 'Habit Reminder',
                            body: `Don't forget to ${habitName}!`,
                            data: {habitId},
                        };

                        try {


                            await fetch('https://exp.host/--/api/v2/push/send', {
                                method: 'POST',
                                headers: {
                                    Accept: 'application/json',
                                    'Accept-encoding': 'gzip, deflate',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(message),
                            });
                        } catch (error) {
                            console.error('Error sending push notification:', error);
                        }
                    }
                }
            }
        }
    }
}

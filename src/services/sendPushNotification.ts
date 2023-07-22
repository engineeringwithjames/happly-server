import {db} from "../config";
import {Habit, User} from "../types";


export const sendPushNotification = async (userId: string, habitId: string) => {
    const userRef = db.collection('users').doc(userId)
    const userSnapshot = await userRef.get()

    if (userSnapshot.exists) {
        const userData = userSnapshot.data() as User

        if (userData) {
            const expoPushToken = userData.expoPushToken

            if (expoPushToken) {
                const habitRef = db.collection('habits').doc(habitId)
                const habitSnapshot = await habitRef.get()

                if (habitSnapshot.exists) {
                    const habitData = habitSnapshot.data() as Habit

                    if (habitData) {
                        const habitName = habitData.name

                        const message = {
                            to: expoPushToken,
                            sound: 'default',
                            title: 'Habit Reminder',
                            body: `Don't forget to ${habitName}!`,
                            data: { habitId },
                        }

                        try {
                            await fetch('https://exp.host/--/api/v2/push/send', {
                                method: 'POST',
                                headers: {
                                    Accept: 'application/json',
                                    'Accept-encoding': 'gzip, deflate',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(message),
                            })
                        } catch (e) {
                            console.log(e)
                        }
                    }
                }
            }
        }
    }
}

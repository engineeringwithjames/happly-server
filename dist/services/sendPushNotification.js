"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPushNotification = void 0;
const sendPushNotification = (userId, habitId) => __awaiter(void 0, void 0, void 0, function* () {
    const userRef = db.collection('users').doc(userId);
    const userSnapshot = yield userRef.get();
    if (userSnapshot.exists) {
        const userData = userSnapshot.data();
        if (userData) {
            const expoPushToken = userData.expoPushToken;
            if (expoPushToken) {
                const habitRef = db.collection('habits').doc(habitId);
                const habitSnapshot = yield habitRef.get();
                if (habitSnapshot.exists) {
                    const habitData = habitSnapshot.data();
                    if (habitData) {
                        const habitName = habitData.name;
                        const message = {
                            to: expoPushToken,
                            sound: 'default',
                            title: 'Habit Reminder',
                            body: `Don't forget to ${habitName}!`,
                            data: { habitId },
                        };
                        try {
                            yield fetch('https://exp.host/--/api/v2/push/send', {
                                method: 'POST',
                                headers: {
                                    Accept: 'application/json',
                                    'Accept-encoding': 'gzip, deflate',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(message),
                            });
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }
                }
            }
        }
    }
});
exports.sendPushNotification = sendPushNotification;

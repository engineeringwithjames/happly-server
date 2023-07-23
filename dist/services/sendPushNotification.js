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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPushNotification = void 0;
const config_1 = require("../config");
const expo_server_sdk_1 = __importDefault(require("expo-server-sdk"));
const sendPushNotification = (userId, habitId) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuerySnapshot = yield config_1.db
        .collection('users')
        .where('id', '==', userId)
        .get();
    if (!userQuerySnapshot.empty) {
        const userData = userQuerySnapshot.docs[0].data();
        if (userData) {
            const pushToken = userData.pushToken;
            if (pushToken) {
                const habitRef = config_1.db.collection('habits').doc(habitId);
                const habitSnapshot = yield habitRef.get();
                if (habitSnapshot.exists) {
                    const habitData = habitSnapshot.data();
                    if (habitData) {
                        const habitName = habitData.name;
                        const expoPushMessages = [{
                                to: pushToken,
                                sound: 'default',
                                title: 'Habit Reminder',
                                body: `Don't forget to ${habitName}!`,
                                data: { habitId },
                            }];
                        const expo = new expo_server_sdk_1.default();
                        try {
                            const response = yield expo.sendPushNotificationsAsync(expoPushMessages);
                            console.log('response - ', response);
                        }
                        catch (error) {
                            console.error('Error sending push notification:', error);
                        }
                    }
                }
            }
        }
    }
});
exports.sendPushNotification = sendPushNotification;

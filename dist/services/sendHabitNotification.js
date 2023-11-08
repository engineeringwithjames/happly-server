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
exports.sendHabitNotification = void 0;
const config_1 = require("../config");
const sendPushNotification_1 = require("../utils/sendPushNotification");
const sendHabitNotification = (userId, habitId) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuerySnapshot = yield config_1.db.collection("users").where("id", "==", userId).get();
    if (!userQuerySnapshot.empty) {
        const userData = userQuerySnapshot.docs[0].data();
        if (userData) {
            const pushToken = userData.pushToken;
            if (pushToken) {
                const habitRef = config_1.db.collection("habits").doc(habitId);
                const habitSnapshot = yield habitRef.get();
                if (habitSnapshot.exists) {
                    const habitData = habitSnapshot.data();
                    if (habitData) {
                        const habitName = habitData.name;
                        const habitId = habitData.id;
                        (0, sendPushNotification_1.sendPushNotification)(pushToken, "Habit Reminder", `Don't forget to ${habitName}!`, {
                            habitId
                        });
                    }
                }
            }
        }
    }
});
exports.sendHabitNotification = sendHabitNotification;

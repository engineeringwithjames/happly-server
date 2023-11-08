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
exports.sendStreakEndingReminder = void 0;
const moment_1 = __importDefault(require("moment"));
const config_1 = require("../config");
const sendPushNotification_1 = require("../utils/sendPushNotification");
const sendStreakEndingReminder = (user, userCurrentDate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const habitQuerySnapshot = yield config_1.db
            .collection("habits")
            .where("userId", "==", user.id)
            .where("frequencyOption", "==", "Daily")
            .get();
        if (!habitQuerySnapshot.empty) {
            habitQuerySnapshot.forEach((doc) => __awaiter(void 0, void 0, void 0, function* () {
                if (doc.exists) {
                    const habitData = doc.data();
                    const habitId = habitData.id;
                    // Check if last updated of streak is not today
                    const streakSnapshot = yield config_1.db
                        .collection("streak")
                        .where("habitId", "==", habitData.id)
                        .get();
                    if (!streakSnapshot.empty) {
                        streakSnapshot.forEach((doc) => {
                            if (doc.exists) {
                                const streakData = doc.data();
                                if (streakData) {
                                    const lastUpdatedDate = (0, moment_1.default)(streakData.lastUpdated).format("YYYY-MM-DD");
                                    const todayDateFromUserCurrentDate = (0, moment_1.default)(userCurrentDate).format("YYYY-MM-DD");
                                    if (lastUpdatedDate !== todayDateFromUserCurrentDate) {
                                        // Send a push notification
                                        const pushToken = user.pushToken;
                                        const title = "Streak Ending Soon 😫";
                                        const message = "You have some uncompleted habits!";
                                        (0, sendPushNotification_1.sendPushNotification)(pushToken, title, message, { habitId });
                                        return;
                                    }
                                }
                            }
                        });
                    }
                }
            }));
        }
    }
    catch (error) {
        console.error("Error executing cron job:", error);
    }
});
exports.sendStreakEndingReminder = sendStreakEndingReminder;

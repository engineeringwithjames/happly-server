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
exports.habitNotification = void 0;
const services_1 = require("../services");
const config_1 = require("../config");
const moment_1 = __importDefault(require("moment"));
const momentTz = require("moment-timezone");
const habitNotification = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("habitNotification - Running a task every minute");
    try {
        // Inefficient solution
        const userQuerySnapshot = yield config_1.db.collection("users").get();
        if (!userQuerySnapshot.empty) {
            userQuerySnapshot.forEach((doc) => __awaiter(void 0, void 0, void 0, function* () {
                if (doc.exists) {
                    const userData = doc.data();
                    if (userData.timezone) {
                        const userTimezone = userData.timezone;
                        const userCurrentDateTime = momentTz().tz(userTimezone);
                        const formattedDateTime = (0, moment_1.default)(userCurrentDateTime).format("HH:mm");
                        const remindersQuerySnapshot = yield config_1.db
                            .collection("reminders")
                            .where("userId", "==", userData.id)
                            .get();
                        if (!remindersQuerySnapshot.empty) {
                            remindersQuerySnapshot.forEach((doc) => __awaiter(void 0, void 0, void 0, function* () {
                                const reminderData = doc.data();
                                const currentReminderTime = (0, moment_1.default)(reminderData.reminder).format("HH:mm");
                                const pushToken = userData.pushToken;
                                if (pushToken && formattedDateTime === currentReminderTime) {
                                    (0, services_1.sendHabitNotification)(pushToken, reminderData.habitId);
                                }
                            }));
                        }
                        else {
                            console.log("querySnapshot is empty");
                        }
                    }
                }
                else {
                    console.log("User does not have timezone!");
                }
            }));
        }
    }
    catch (error) {
        console.error("Error executing cron job:", error);
    }
});
exports.habitNotification = habitNotification;

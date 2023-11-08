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
const node_cron_1 = __importDefault(require("node-cron"));
const services_1 = require("../services");
const config_1 = require("../config");
const moment_1 = __importDefault(require("moment"));
const habitNotification = () => {
    // cron.schedule("*/5 * * * * *", async () => {
    console.log("habitNotification - Running a task every minute");
    node_cron_1.default.schedule("* * * * * ", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Get the current time in UTC
            const currentTime = moment_1.default.utc().format("HH:mm");
            // Fetch reminders for the current hour and minute
            const reminderQuerySnapshot = yield config_1.db
                .collection("reminders")
                .where("utcReminderHour", "==", parseInt(currentTime.split(":")[0]))
                .where("utcReminderMinute", "==", parseInt(currentTime.split(":")[1]))
                .get();
            if (!reminderQuerySnapshot.empty) {
                reminderQuerySnapshot.forEach((doc) => {
                    if (doc.exists) {
                        const reminderData = doc.data();
                        if (reminderData.isDaily) {
                            (0, services_1.sendHabitNotification)(reminderData.userId, reminderData.habitId);
                        }
                        else {
                            const currentDay = (0, moment_1.default)().format("dddd");
                            if (reminderData.daysOfWeek.includes(currentDay)) {
                                (0, services_1.sendHabitNotification)(reminderData.userId, reminderData.habitId);
                            }
                        }
                    }
                    else {
                        console.log("No such document!");
                    }
                });
            }
            else {
                console.log("querySnapshot is empty");
            }
        }
        catch (error) {
            console.error("Error executing cron job:", error);
        }
    }));
};
exports.habitNotification = habitNotification;

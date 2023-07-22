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
exports.schedulePushNotification = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const services_1 = require("../services");
const config_1 = require("../config");
const schedulePushNotification = () => {
    node_cron_1.default.schedule('*/5 * * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        // cron.schedule('* * * * * *', async () => {
        // getAllReminders()
        console.log('Running a task every minute');
        try {
            // Get the current time in UTC
            const currentTime = new Date();
            // Fetch reminders for the current hour and minute
            const reminderQuerySnapshot = yield config_1.db
                .collection('reminders')
                .where('reminderHour', '==', currentTime.getUTCHours())
                .where('reminderMinute', '==', currentTime.getUTCMinutes())
                .get();
            if (!reminderQuerySnapshot.empty) {
                reminderQuerySnapshot.forEach((doc) => {
                    if (doc.exists) {
                        const reminderData = doc.data();
                        if (reminderData.isDaily) {
                            console.log('reminderData.isDaily', reminderData.isDaily);
                            (0, services_1.sendPushNotification)(reminderData.userId, reminderData.habitId);
                        }
                        else {
                            // get current day of the week in non-UTC
                            const currentDay = currentTime.getDay();
                            // if (reminderData.daysOfWeek.includes(currentDay)) {
                            //     console.log('reminderData.daysOfWeek', reminderData.daysOfWeek)
                            //     sendPushNotification(reminderData.userId, reminderData.habitId)
                            // }
                        }
                    }
                    else {
                        console.log('No such document!');
                    }
                });
            }
            else {
                console.log('querySnapshot is empty');
            }
        }
        catch (error) {
            console.error('Error executing cron job:', error);
        }
    }));
};
exports.schedulePushNotification = schedulePushNotification;

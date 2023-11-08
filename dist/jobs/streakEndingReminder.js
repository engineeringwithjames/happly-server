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
exports.streakEndingReminder = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const services_1 = require("../services");
const config_1 = require("../config");
const moment = require("moment-timezone");
const streakEndingReminder = () => {
    console.log("streakEndingReminder - Running a task every hour");
    node_cron_1.default.schedule("0 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // fetch all users check if they have daily habits and if they do, check if they have completed them if not send a push notification for that user
            const userQuerySnapshot = yield config_1.db.collection("users").get();
            if (!userQuerySnapshot.empty) {
                userQuerySnapshot.forEach((doc) => {
                    if (doc.exists) {
                        const userData = doc.data();
                        if (userData.timezone) {
                            const userTimezone = userData.timezone;
                            const userCurrentDateTime = moment().tz(userTimezone);
                            const formattedDateTime = userCurrentDateTime.format("HH:mm:ssA");
                            if (formattedDateTime === "21:00:00PM") {
                                (0, services_1.sendStreakEndingReminder)(userData, userCurrentDateTime);
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
exports.streakEndingReminder = streakEndingReminder;

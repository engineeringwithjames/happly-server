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
exports.sendStreakVerification = void 0;
const moment_1 = __importDefault(require("moment"));
const config_1 = require("../config");
const types_1 = require("../types");
const sendStreakVerification = (userId, userCurrentDate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const streakQuerySnapshot = yield config_1.db.collection("streak").where("userId", "==", userId).get();
        if (!streakQuerySnapshot.empty) {
            streakQuerySnapshot.forEach((doc) => __awaiter(void 0, void 0, void 0, function* () {
                if (doc.exists) {
                    const streakData = doc.data();
                    const lastUpdatedDate = (0, moment_1.default)(streakData.lastUpdated).format("YYYY-MM-DD");
                    const yesterdayDateFromUserCurrentDate = (0, moment_1.default)(userCurrentDate)
                        .subtract(1, "days")
                        .format("YYYY-MM-DD");
                    const todayDateFromUserCurrentDate = (0, moment_1.default)(userCurrentDate).format("YYYY-MM-DD");
                    if (lastUpdatedDate === yesterdayDateFromUserCurrentDate) {
                        return;
                    }
                    // THis should never happen because we only do this at 12:00AM the user's time
                    if (lastUpdatedDate === todayDateFromUserCurrentDate) {
                        return;
                    }
                    const habitRef = config_1.db.collection("habits").doc(streakData.habitId);
                    const habitSnapshot = yield habitRef.get();
                    if (habitSnapshot.exists) {
                        const habitData = habitSnapshot.data();
                        if (habitData) {
                            if (habitData.frequencyOption === types_1.Frequency.Daily) {
                                yield config_1.db.collection("streaks").doc(streakData.id).update({ currentStreak: 0 });
                            }
                            else {
                                const yesterday = (0, moment_1.default)(yesterdayDateFromUserCurrentDate).format("DDDD");
                                // check if yesterday is part of the selected days to do the habit and if the last updated date is not yesterday
                                if (habitData.selectedDays.includes(yesterday) &&
                                    lastUpdatedDate !== yesterdayDateFromUserCurrentDate) {
                                    yield config_1.db.collection("streaks").doc(streakData.id).update({ currentStreak: 0 });
                                }
                            }
                        }
                    }
                }
                else {
                    console.log("No such document!");
                }
            }));
        }
    }
    catch (error) {
        console.error("Error executing cron job:", error);
    }
});
exports.sendStreakVerification = sendStreakVerification;

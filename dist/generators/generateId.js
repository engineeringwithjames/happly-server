"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateChallengeId = exports.generateReminderId = exports.generateHabitId = exports.generateStreakId = exports.generateStatId = exports.generateUserId = exports.generateId = void 0;
require("react-native-get-random-values");
const nanoid_1 = require("nanoid");
const generateId = (id) => {
    return `${id}-${(0, nanoid_1.nanoid)(16)}`;
};
exports.generateId = generateId;
const generateUserId = () => (0, exports.generateId)('user');
exports.generateUserId = generateUserId;
const generateStatId = () => (0, exports.generateId)('stat');
exports.generateStatId = generateStatId;
const generateStreakId = () => (0, exports.generateId)('streak');
exports.generateStreakId = generateStreakId;
const generateHabitId = () => (0, exports.generateId)('habit');
exports.generateHabitId = generateHabitId;
const generateReminderId = () => (0, exports.generateId)('reminder');
exports.generateReminderId = generateReminderId;
const generateChallengeId = () => (0, exports.generateId)('challenge');
exports.generateChallengeId = generateChallengeId;
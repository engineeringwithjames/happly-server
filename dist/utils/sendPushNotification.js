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
const expo_server_sdk_1 = __importDefault(require("expo-server-sdk"));
const sendPushNotification = (pushToken, title, message, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expoPushMessages = [
            {
                to: pushToken,
                sound: "default",
                title,
                body: message,
                data
            }
        ];
        const expo = new expo_server_sdk_1.default();
        const response = yield expo.sendPushNotificationsAsync(expoPushMessages);
        console.log("response - ", response);
    }
    catch (error) {
        console.error("Error sending push notification:", error);
    }
});
exports.sendPushNotification = sendPushNotification;

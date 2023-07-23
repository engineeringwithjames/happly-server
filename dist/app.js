"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const moment_1 = __importDefault(require("moment"));
const app = (0, express_1.default)();
const port = 8081;
app.use((0, cors_1.default)({
    credentials: true,
}));
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
console.log('moment', (0, moment_1.default)().format('HH:mm A'));
// Cron job to run every minute
// schedulePushNotification();
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

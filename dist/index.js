"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var port = 8000;
var app = (0, express_1.default)();
app.get("/", function (req, res) {
    res.send("HELLO FROM EXPRESS + TS!!!!");
});
app.get("/hi", function (req, res) {
    console.log('hey there');
    res.send("Hey!!");
});
app.listen(port, function () {
    console.log("now listening on port ".concat(port));
});

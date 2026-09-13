"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const server = app_1.default.listen(env_1.ENV.PORT, () => {
    console.log(`🚀 Smart PG Backend API running on http://localhost:${env_1.ENV.PORT}`);
    console.log(`📡 Environment: ${env_1.ENV.NODE_ENV}`);
});
exports.default = server;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const mockdate_1 = __importDefault(require("mockdate"));
// freeze system date to 2022-05-19 12:00 so tests behave deterministically
mockdate_1.default.set(new Date(2022, 4, 19, 12, 0, 0));

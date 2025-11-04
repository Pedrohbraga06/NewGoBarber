"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const RedisCacheProvider_1 = __importDefault(require("./implementations/RedisCacheProvider"));
const providers = {
    redis: RedisCacheProvider_1.default,
};
tsyringe_1.container.registerSingleton('CacheProvider', providers.redis);

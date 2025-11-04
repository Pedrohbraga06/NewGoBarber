"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = require("bcryptjs");
class BCryptHashProvider {
    async generateHash(payload) {
        return (0, bcryptjs_1.hash)(payload, 8);
    }
    async compareHash(payload, hashed) {
        return (0, bcryptjs_1.compare)(payload, hashed);
    }
}
exports.default = BCryptHashProvider;

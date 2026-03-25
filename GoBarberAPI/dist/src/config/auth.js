"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    jwt: {
        secret: process.env.JWT_SECRET || 'change_me_in_production',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
};

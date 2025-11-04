"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FakeMailProvider {
    constructor() {
        this.messages = [];
    }
    async sendMail(message) {
        this.messages.push(message);
    }
}
exports.default = FakeMailProvider;

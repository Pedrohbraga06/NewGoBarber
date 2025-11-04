"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FakeMailTemplateProvider {
    async parse() {
        return 'Mail content';
    }
}
exports.default = FakeMailTemplateProvider;

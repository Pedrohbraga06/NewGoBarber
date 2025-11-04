"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const EtheralMailProvider_1 = __importDefault(require("./implementations/EtheralMailProvider"));
//import SESMailProvider from './implementations/SESMailProvider';
const providers = {
    ethereal: tsyringe_1.container.resolve(EtheralMailProvider_1.default),
    //ses: container.resolve(SESMailProvider),
};
tsyringe_1.container.registerInstance('MailProvider', providers.ethereal //providers[mailConfig.driver],
);

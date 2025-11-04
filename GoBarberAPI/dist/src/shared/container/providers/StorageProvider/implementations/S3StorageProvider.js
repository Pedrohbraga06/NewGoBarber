"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mime_types_1 = require("mime-types");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const upload_1 = __importDefault(require("@config/upload"));
class DiskStorageProvider {
    constructor() {
        this.client = new aws_sdk_1.default.S3({
            region: 'us-east-1',
        });
    }
    async saveFile(file) {
        const originalPath = path_1.default.resolve(upload_1.default.tmpFolder, file);
        const ContentType = (0, mime_types_1.lookup)(originalPath);
        if (!ContentType) {
            throw new Error('File not found');
        }
        const fileContent = await fs_1.default.promises.readFile(originalPath);
        await this.client
            .putObject({
            Bucket: 
            // uploadConfig may not include aws config in this repo snapshot —
            // fall back to environment variable if available
            upload_1.default.config?.aws?.bucket || process.env.AWS_BUCKET,
            Key: file,
            ACL: 'public-read',
            Body: fileContent,
            ContentType,
        })
            .promise();
        await fs_1.default.promises.unlink(originalPath);
        return file;
    }
    async deleteFile(file) {
        await this.client
            .deleteObject({
            Bucket: upload_1.default.config?.aws?.bucket || process.env.AWS_BUCKET,
            Key: file,
        })
            .promise();
    }
}
exports.default = DiskStorageProvider;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const UpdateUserAvatarService_1 = __importDefault(require("@modules/users/services/UpdateUserAvatarService"));
class UserAvatarController {
    async update(request, response) {
        const updateUserAvatar = tsyringe_1.container.resolve(UpdateUserAvatarService_1.default);
        const user = await updateUserAvatar.execute({
            user_id: request.user.id,
            avatarFilename: request.file.filename,
        });
        return response.json();
    }
}
exports.default = UserAvatarController;

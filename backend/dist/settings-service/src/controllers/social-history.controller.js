"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialHistoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const social_history_service_1 = require("../services/social-history.service");
let SocialHistoryController = class SocialHistoryController {
    constructor(socialHistoryService) {
        this.socialHistoryService = socialHistoryService;
    }
    async getSocialHistory() {
        return this.socialHistoryService.getSocialHistory();
    }
    async getSocialHistoryOptions(id) {
        return this.socialHistoryService.getSocialHistoryOptions(parseInt(id));
    }
    async getPatientSocialHistory(patientId, locationId, req) {
        return this.socialHistoryService.getPatientSocialHistory(patientId, locationId, req.user);
    }
    async savePatientSocialHistory(data, req) {
        return this.socialHistoryService.savePatientSocialHistory(data, req.user);
    }
    async deletePatientSocialHistory(data, req) {
        return this.socialHistoryService.deletePatientSocialHistory(data, req.user);
    }
};
exports.SocialHistoryController = SocialHistoryController;
__decorate([
    (0, common_1.Get)('social-history'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SocialHistoryController.prototype, "getSocialHistory", null);
__decorate([
    (0, common_1.Get)('social-history-options/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SocialHistoryController.prototype, "getSocialHistoryOptions", null);
__decorate([
    (0, common_1.Get)('patient-social-history/:patientId'),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('location_id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SocialHistoryController.prototype, "getPatientSocialHistory", null);
__decorate([
    (0, common_1.Post)('patient-social-history'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SocialHistoryController.prototype, "savePatientSocialHistory", null);
__decorate([
    (0, common_1.Delete)('patient-social-history'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SocialHistoryController.prototype, "deletePatientSocialHistory", null);
exports.SocialHistoryController = SocialHistoryController = __decorate([
    (0, swagger_1.ApiTags)('Social History'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [social_history_service_1.SocialHistoryService])
], SocialHistoryController);
//# sourceMappingURL=social-history.controller.js.map
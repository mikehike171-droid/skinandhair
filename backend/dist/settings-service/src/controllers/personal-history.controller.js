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
exports.PersonalHistoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const personal_history_service_1 = require("../services/personal-history.service");
let PersonalHistoryController = class PersonalHistoryController {
    constructor(personalHistoryService) {
        this.personalHistoryService = personalHistoryService;
    }
    async getPersonalHistory() {
        return this.personalHistoryService.getPersonalHistory();
    }
    async createPersonalHistory(data) {
        return this.personalHistoryService.createPersonalHistory(data);
    }
    async updatePersonalHistory(id, data) {
        return this.personalHistoryService.updatePersonalHistory(parseInt(id), data);
    }
    async getPersonalHistoryOptions(id) {
        return this.personalHistoryService.getPersonalHistoryOptions(parseInt(id));
    }
    async getPatientPersonalHistory(patientId, locationId, req) {
        return this.personalHistoryService.getPatientPersonalHistory(patientId, locationId, req.user);
    }
    async savePatientPersonalHistory(data, req) {
        return this.personalHistoryService.savePatientPersonalHistory(data, req.user);
    }
    async deletePatientPersonalHistory(data, req) {
        return this.personalHistoryService.deletePatientPersonalHistory(data, req.user);
    }
};
exports.PersonalHistoryController = PersonalHistoryController;
__decorate([
    (0, common_1.Get)('personal-history'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PersonalHistoryController.prototype, "getPersonalHistory", null);
__decorate([
    (0, common_1.Post)('personal-history'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PersonalHistoryController.prototype, "createPersonalHistory", null);
__decorate([
    (0, common_1.Put)('personal-history/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PersonalHistoryController.prototype, "updatePersonalHistory", null);
__decorate([
    (0, common_1.Get)('personal-history-options/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PersonalHistoryController.prototype, "getPersonalHistoryOptions", null);
__decorate([
    (0, common_1.Get)('patient-personal-history/:patientId'),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('location_id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PersonalHistoryController.prototype, "getPatientPersonalHistory", null);
__decorate([
    (0, common_1.Post)('patient-personal-history'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PersonalHistoryController.prototype, "savePatientPersonalHistory", null);
__decorate([
    (0, common_1.Delete)('patient-personal-history'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PersonalHistoryController.prototype, "deletePatientPersonalHistory", null);
exports.PersonalHistoryController = PersonalHistoryController = __decorate([
    (0, swagger_1.ApiTags)('Personal History'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [personal_history_service_1.PersonalHistoryService])
], PersonalHistoryController);
//# sourceMappingURL=personal-history.controller.js.map
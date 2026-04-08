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
exports.DrugHistoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const drug_history_service_1 = require("../services/drug-history.service");
let DrugHistoryController = class DrugHistoryController {
    constructor(drugHistoryService) {
        this.drugHistoryService = drugHistoryService;
    }
    async getDrugHistory() {
        return this.drugHistoryService.getDrugHistory();
    }
    async getDrugHistoryOptions(id) {
        return this.drugHistoryService.getDrugHistoryOptions(parseInt(id));
    }
    async getPatientDrugHistory(patientId, locationId, req) {
        return this.drugHistoryService.getPatientDrugHistory(patientId, locationId, req.user);
    }
    async savePatientDrugHistory(data, req) {
        return this.drugHistoryService.savePatientDrugHistory(data, req.user);
    }
    async deletePatientDrugHistory(data, req) {
        return this.drugHistoryService.deletePatientDrugHistory(data, req.user);
    }
};
exports.DrugHistoryController = DrugHistoryController;
__decorate([
    (0, common_1.Get)('drug-history'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DrugHistoryController.prototype, "getDrugHistory", null);
__decorate([
    (0, common_1.Get)('drug-history-options/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DrugHistoryController.prototype, "getDrugHistoryOptions", null);
__decorate([
    (0, common_1.Get)('patient-drug-history/:patientId'),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('location_id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], DrugHistoryController.prototype, "getPatientDrugHistory", null);
__decorate([
    (0, common_1.Post)('patient-drug-history'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DrugHistoryController.prototype, "savePatientDrugHistory", null);
__decorate([
    (0, common_1.Delete)('patient-drug-history'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DrugHistoryController.prototype, "deletePatientDrugHistory", null);
exports.DrugHistoryController = DrugHistoryController = __decorate([
    (0, swagger_1.ApiTags)('Drug History'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [drug_history_service_1.DrugHistoryService])
], DrugHistoryController);
//# sourceMappingURL=drug-history.controller.js.map
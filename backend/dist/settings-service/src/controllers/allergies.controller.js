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
exports.AllergiesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const allergies_service_1 = require("../services/allergies.service");
let AllergiesController = class AllergiesController {
    constructor(allergiesService) {
        this.allergiesService = allergiesService;
    }
    async getAllergies() {
        return this.allergiesService.getAllergies();
    }
    async getPatientAllergies(patientId, locationId, req) {
        return this.allergiesService.getPatientAllergies(patientId, locationId, req.user);
    }
    async savePatientAllergies(data, req) {
        return this.allergiesService.savePatientAllergies(data, req.user);
    }
    async deletePatientAllergies(data, req) {
        return this.allergiesService.deletePatientAllergies(data, req.user);
    }
};
exports.AllergiesController = AllergiesController;
__decorate([
    (0, common_1.Get)('allergies'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AllergiesController.prototype, "getAllergies", null);
__decorate([
    (0, common_1.Get)('patient-allergies/:patientId'),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('location_id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AllergiesController.prototype, "getPatientAllergies", null);
__decorate([
    (0, common_1.Post)('patient-allergies'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AllergiesController.prototype, "savePatientAllergies", null);
__decorate([
    (0, common_1.Delete)('patient-allergies'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AllergiesController.prototype, "deletePatientAllergies", null);
exports.AllergiesController = AllergiesController = __decorate([
    (0, swagger_1.ApiTags)('Allergies'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [allergies_service_1.AllergiesService])
], AllergiesController);
//# sourceMappingURL=allergies.controller.js.map